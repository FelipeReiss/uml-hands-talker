import { Feedback } from './models/feedback.model';
import { FeedbackServiceService } from './services/feedback-service.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { OverlayService } from '../core/services/overlay.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { UserService } from '../auth/services/user.service';
import { FeedbackClass } from './classes/feedbackClass.class';

@Component({
  selector: 'app-feedback',
  templateUrl: 'feedback.page.html',
  styleUrls: ['feedback.page.scss']
})
export class FeedbackPage implements OnInit {

  mailForm: FormGroup;
  isSignIn = false;
  userName: string;
  isAdmin: boolean;
  userMail: string;

  private nameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(
    private feedbackService: FeedbackServiceService,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private overlayService: OverlayService,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  getDate() {
    const dNow = new Date();
    const localdate = dNow.getDate()
                      + '/' + (dNow.getMonth() + 1)
                      + '/' + dNow.getFullYear()
                      + ' ' + dNow.getHours()
                      + ':' + dNow.getMinutes();
    return localdate;
  }

  ionViewWillEnter() {
    this.authService.updateUserFireClass(this.userService);
  }

  ionViewDidEnter(): void {
      if (this.authService.getUserFire()) {
        this.mailForm.removeControl('name');
        this.mailForm.removeControl('email');
        this.isSignIn = true;
        this.userName = this.authService.getUserFire().displayName;
        this.userMail = this.authService.getUserFire().email;
        this.isAdmin = this.authService.getUserFireClass().admin;
      } else {
        this.isAdmin = false;
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
    let feedbackMessage = new FeedbackClass();
    if (this.isSignIn) {
      feedbackMessage.senderName = this.userName;
      feedbackMessage.senderMail = this.userMail;
    } else {
      feedbackMessage.senderName = this.mailForm.get('name').value;
      feedbackMessage.senderMail = this.mailForm.get('email').value;
    }
    await this.overlayService.alert({
      message: feedbackMessage.senderName + ', deseja realmente enviar este Feedback?',
      buttons: [
        {
          text: 'Enviar',
          handler: async () => {
            this.sendMail(feedbackMessage);
          }
        },
        'Cancelar'
      ]
    });
  }

  async sendMail(feedbackMessage): Promise<void> {
    feedbackMessage.dateTime = this.getDate();
    feedbackMessage.subject = this.mailForm.get('subject').value;
    feedbackMessage.body = this.mailForm.get('body').value;

    const loading = await this.overlayService.loading({
      message: 'Obrigado pelo seu feedback!\nPor favor, aguarde um momento...'
    });
    try {
      this.feedbackService.create({
        id: undefined,
        senderName: feedbackMessage.senderName,
        senderMail: feedbackMessage.senderMail,
        subject: feedbackMessage.subject,
        body: feedbackMessage.body,
        dateTime: feedbackMessage.dateTime,
        isClosed: true
      });
      await this.overlayService.toast({
        message: 'Feedback enviado com sucesso!',
        duration: 6000
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
