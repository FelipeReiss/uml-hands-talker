import { UserFirestoreClass } from './../auth/classes/UserFirestoreClass.class';
import { UserService } from './../auth/services/user.service';
import { WordsService } from './../words/services/words.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'node_modules/rxjs';
import { OverlayService } from '../core/services/overlay.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { Word } from '../words/models/word.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public searchTerm = '';
  words$: Observable<Word[]>;
  error = false;
  messageError: string;
  searchForm: FormGroup;
  sentence: string;
  userApp;
  userLogado = false;
  userAdmin = false;
  isWord = 'Words';
  
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private wordsService: WordsService,
    private overlayService: OverlayService,
    private navCtrl: NavController
  ) { }

  async ngOnInit(): Promise<void> {
    this.authService.authState$.subscribe(async user => {
      this.authService.setUserFire(user);
      if (user) {
        this.userLogado = true;
        this.userAdmin = this.authService.userFirestoreClass$.admin;
      }
      this.updateList();
    });
    this.userApp = this.authService.userFirestoreClass$;
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

  onUpdate(word: Word): void {
    this.navCtrl.navigateForward(`/tabs/home/edit-word/${word.id}`);
  }

  onOpen(word: Word): void {
    this.navCtrl.navigateForward(`/tabs/home/show-word/${word.id}`);
  }

  async onDelete(word: Word): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar o termo "${word.title}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            const loading = await this.overlayService.loading({
              message: `Deletando "${word.title}" do banco de dados...`
            });
            try {
              await this.wordsService.delete(word);
              let allUsers: Observable<{}[]>;

              this.userService
              .searchArray('/users', 'favoritesWords', word.id)
              .subscribe(valor => {
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < valor.length; i++) {
                  const userFormat = valor[i] as UserFirestoreClass;
                  userFormat.favoritesWords.splice(userFormat.favoritesWords.indexOf(word.id), 1);
                  this.userService.update(userFormat);
                }
              });
              await this.overlayService.toast({
                message: `Termo "${word.title}" deletado com sucesso!`
              });
            } catch (error) {
              await this.overlayService.alert({
                message: `Não foi possivel deletar termo "${word.title}". Favor encaminhar feedback com o erro abaixo: \n${error.message}`,
                buttons: ['OK']
              });
            } finally {
              loading.dismiss();
            }
          }
        },
        'Não'
      ]
    });
  }

  timeOut(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  }

  ionViewWillEnter() {
    this.isWord = 'Words';
    this.searchForm.get('searchTerm').setValue('  ');
    this.authService.updateUserFireClass(this.userService);
  }

  async ionViewDidEnter() {
    const loading = await this.overlayService.loading({
      message: 'Atualizando lista de termos...'
    });
    await this.timeOut(500)
    .then(() => {
      this.searchForm.get('searchTerm').setValue('');
      this.userAdmin = this.authService.userFirestoreClass$.admin;
      this.authService.isAuthenticated.pipe(take(1)).subscribe( isAuth => {
        this.userLogado = isAuth;
      });
      loading.dismiss();
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
    console.log(this.isWord);
    this.sentence = this.searchForm.get('searchTerm').value;
  }

  public updateList() {
    this.ionViewWillEnter();
    this.ionViewDidEnter();
  }
}
