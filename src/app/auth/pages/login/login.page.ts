import { UserService } from './../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { OverlayService } from './../../../core/services/overlay.service';
import { AuthProvider } from './../../../core/services/auth.types';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  authForm: FormGroup;
  AuthProviders = AuthProvider;

  configs = {
    isSignIn: true,
    action: 'Entrar',
    actionChange: 'Criar Conta'
  };
  private nameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm(): void {

    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email(): FormControl {
    return this.authForm.get('email') as FormControl;
  }
  get name(): FormControl {
    return this.authForm.get('name') as FormControl;
  }
  get password(): FormControl {
    return this.authForm.get('password') as FormControl;
  }

  changeAuthAction(): void {
    this.configs.isSignIn = !this.configs.isSignIn;
    const{ isSignIn } = this.configs;
    this.configs.action = isSignIn ? 'Entrar' : 'Cadastrar';
    this.configs.actionChange = isSignIn ? 'Criar Conta' : 'Fazer Login';
    !isSignIn ? this.authForm.addControl('name', this.nameControl) : this.authForm.removeControl('name');
  }

  timeOut(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  }

  async onSubmit(provider: AuthProvider): Promise<void> {
    const loading = await this.overlayService.loading();
    try {
      const credentials = await this.authService.tryAuthenticate({
        isSignIn: this.configs.isSignIn,
        user: this.authForm.value,
        provider
      }, this.userService);
      this.navCtrl.navigateRoot(this.route.snapshot.queryParamMap.get('redirect') || '/tabs/home');
    } catch (error) {
      this.overlayService.toast({
        message: error.message,
        duration: 90000
      });
    } finally {
      loading.dismiss();
    }
  }

}
