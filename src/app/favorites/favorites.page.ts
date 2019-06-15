import { UserService } from './../auth/services/user.service';
import { AuthService } from './../core/services/auth.service';
import { WordsService } from './../words/services/words.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'node_modules/rxjs';
import { Word } from '../words/models/word.model';
import { OverlayService } from '../core/services/overlay.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserFirestoreClass } from '../auth/classes/UserFirestoreClass.class';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  templateUrl: 'favorites.page.html',
  styleUrls: ['favorites.page.scss']
})
export class FavoritesPage implements OnInit {
  public searchTerm = '';
  words$: Observable<Word[]>;
  error = false;
  messageError: string;
  searchForm: FormGroup;
  sentence: string;
  isFav = 'Favorites';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private wordsService: WordsService,
    private overlayService: OverlayService,
    private navCtrl: NavController
  ) { }

  haveFav(): boolean{
    if (this.authService.userFirestoreClass$.favoritesWords.length != 0) {
      if(this.authService.userFirestoreClass$.favoritesWords[0] === '') {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    const loading = await this.overlayService.loading();
    this.words$ = null;
    try {
      this.words$ = this.wordsService.getAll();
    } catch (error) {
      this.error = true;
      this.messageError = error.message;
    } finally {
      loading.dismiss();
    }
  }

  timeOut(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  }

  ionViewWillEnter() {
    this.searchForm.get('searchTerm').setValue('  ');
    this.authService.updateUserFireClass(this.userService);
  }

  async ionViewDidEnter() {
    const loading = await this.overlayService.loading({
      message: 'Atualizando lista de favoritos...'
    });
    await this.timeOut(500)
    .then(() => {
      this.searchForm.get('searchTerm').setValue('');
      loading.dismiss();
    });
  }

  onOpen(word: Word): void {
    this.navCtrl.navigateForward(`/tabs/favorites/show-word/${word.id}`);
  }

  async onDelete(word: Word): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja remover o termo "${word.title}" dos favoritos?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.wordsService.delete(word);
            await this.overlayService.toast({
              message: `Termo "${word.title}" deletado com sucesso!`
            });
          }
        },
        'Não'
      ]
    });
  }

  async onChangeFav(word: Word): Promise<void> {
    let userLocal = this.authService.userFirestoreClass$;
    let index = userLocal.favoritesWords.indexOf(word.id);
    this.userService.get(userLocal.id).pipe(take(1)).subscribe( valor => {
      const userFormat = valor as UserFirestoreClass;
      if (index < 0 ) {
        userFormat.favoritesWords.push(word.id);
      } else {
        userFormat.favoritesWords.splice(index, 1);
      }
      this.userService.update(userFormat);
      this.authService.updateUserFireClass(this.userService);
      this.updateList();
    });
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: ''
    });
  }
  onSearchInput() {
    this.sentence = this.searchForm.get('searchTerm').value;
  }
  updateList() {
    this.ionViewWillEnter();
    this.ionViewDidEnter();
  }
}

