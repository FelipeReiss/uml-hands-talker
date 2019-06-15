import { UserService } from 'src/app/auth/services/user.service';
import { AuthService } from './../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'node_modules/rxjs';
import { UserFirestore } from 'src/app/auth/models/userFirestore.model';
import { OverlayService } from '../core/services/overlay.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserFirestoreClass } from '../auth/classes/UserFirestoreClass.class';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-adminSettings',
  templateUrl: 'adminSettings.page.html',
  styleUrls: ['adminSettings.page.scss']
})
export class AdminSettingsPage implements OnInit {
  public searchTerm = '';
  user$: Observable<UserFirestore[]>;
  error = false;
  messageError: string;
  searchForm: FormGroup;
  sentence: string;
  isAdm = 'AdminSettings'; 

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController
  ) { }

  async ngOnInit(): Promise<void> {
    this.createForm();
    const loading = await this.overlayService.loading();
    this.user$ = null;
    try {
      this.user$ = this.userService.getAll();
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
      message: 'Atualizando lista de usuários...'
    });
    await this.timeOut(500)
    .then(() => {
        this.searchForm.get('searchTerm').setValue('');
        loading.dismiss();
    });
  }

  async onDelete(user: UserFirestore): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja remover o usuário "${user.name}" de email "${user.email}" do aplicativo?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.userService.delete(user);
            await this.overlayService.toast({
              message: `Usuário "${user.name}" de email "${user.email}" deletado com sucesso!`
            });
          }
        },
        'Não'
      ]
    });
  }

  async onChangeAdmin(user: UserFirestore): Promise<void> {
    this.userService.update({
      id: user.id,
      admin: !user.admin,
      favoritesWords: user.favoritesWords,
      name: user.name,
      email: user.email
    });
    this.authService.updateUserFireClass(this.userService);
    this.updateList();
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

