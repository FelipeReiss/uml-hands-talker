import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { OverlayService } from '../core/services/overlay.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { UserService } from '../auth/services/user.service';

@Component({
  selector: 'app-feedback',
  templateUrl: 'feedback.page.html',
  styleUrls: ['feedback.page.scss']
})
export class FeedbackPage implements OnInit {

  mailForm: FormGroup;
  admMail = 'felipereiss@outlook.com';
  isSignIn = false;
  userName: string;

  private nameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private overlayService: OverlayService,
    private emailComposer: EmailComposer
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ionViewDidEnter(): void {
      if (this.authService.userFirebase) {
        this.isSignIn = true;
        this.userName = this.authService.userFirebase.displayName;
        this.mailForm.removeControl('name');
        this.mailForm.removeControl('email');
      } else {
        this.isSignIn = false;
        this.mailForm.addControl('name', this.nameControl);
        this.mailForm.addControl('email', this.nameControl);
      }
  }

  private createForm(): void {
    this.mailForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(6)]],
      body: ['', [Validators.required, Validators.minLength(30)]]
    });
  }
  
  get email(): FormControl {
    return this.mailForm.get('email') as FormControl;
  }

  get name(): FormControl {
    return this.mailForm.get('name') as FormControl;
  }
  get subject(): FormControl {
    return this.mailForm.get('subject') as FormControl;
  }
  get body(): FormControl {
    return this.mailForm.get('body') as FormControl;
  }

  async onSubmit(): Promise<void> {
    if (!this.isSignIn) {
      this.userName = this.mailForm.get('name').value;
    }
    await this.overlayService.alert({
      // tslint:disable-next-line:max-line-length
      message: this.userName + ', deseja realmente enviar este Feedback?',
      buttons: [
        {
          text: 'Enviar',
          handler: async () => {
            this.sendMail();
          }
        },
        'Cancelar'
      ]
    });
  }

  ionViewWillEnter() {
    this.authService.updateUserFireClass(this.userService);
  }
  async sendMail(): Promise<void> {
    await this.overlayService.alert({
      // tslint:disable-next-line:max-line-length
      message: this.userName + ', você será direcionado(a) para seu aplicativo de e-mails padrão para enviar ao nosso suporte.\nPor gentileza, não se esqueça de clicar no botão de envio.',
      buttons: [
        'Ok'
      ]
    });
    const loading = await this.overlayService.loading({
      message: 'Abrindo aplicativo padrão de email...'
    });
    try {
      this.emailComposer.open({
        to: this.admMail,
        subject: this.mailForm.get('subject').value,
        // tslint:disable-next-line:max-line-length
        body: 'Olá,\n\nEu sou ' + this.userName + ' e tenho o seguinte Feedback sobre seu aplicativo: \n' + this.mailForm.get('body').value,
        isHtml: true
      });
      await this.overlayService.toast({
        message: 'Feedback enviado com sucesso!',
        duration: 90000
      });
      this.mailForm.reset();
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