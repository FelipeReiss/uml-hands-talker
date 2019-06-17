import { Feedback } from 'src/app/feedback/models/feedback.model';
import { FeedbackServiceService } from './../feedback/services/feedback-service.service';
import { UserService } from 'src/app/auth/services/user.service';
import { AuthService } from './../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'node_modules/rxjs';
import { OverlayService } from '../core/services/overlay.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-adminFeedback',
  templateUrl: 'adminFeedback.page.html',
  styleUrls: ['adminFeedback.page.scss']
})
export class AdminFeedbackPage implements OnInit {
  public searchTerm = '';
  feedback$: Observable<Feedback[]>;
  error = false;
  messageError: string;
  searchForm: FormGroup;
  sentence: string;
  isFeedback = 'AdminFeedback';
  feedbackUsers = 0;

  constructor(
    private userService: UserService,
    private feedbackService: FeedbackServiceService,
    private authService: AuthService,
    private fb: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController
  ) { }

  async ngOnInit(): Promise<void> {
    this.createForm();
    const loading = await this.overlayService.loading();
    this.feedback$ = null;
    try {
      this.feedback$ = this.feedbackService.getAll();
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
    this.authService.setFeedbackUsers(this.feedbackService);
    this.timeOut(500).then(() => this.feedbackUsers = this.authService.getFeedbackUsers());
  }

  async ionViewDidEnter() {
    const loading = await this.overlayService.loading({
      message: 'Atualizando histórico de feedbacks...'
    });
    await this.timeOut(500)
    .then(() => {
        this.searchForm.get('searchTerm').setValue('');
        loading.dismiss();
    });
  }

  async onDelete(feedback: Feedback): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja remover o feedback de "${feedback.senderName}" enviado em "${feedback.dateTime}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.feedbackService.delete(feedback);
            await this.overlayService.toast({
              message: `Feedback de "${feedback.senderName}" enviado em "${feedback.dateTime}" deletado com sucesso!`
            });
          }
        },
        'Não'
      ]
    });
  }

  async onChangeAdmin(feedback: Feedback): Promise<void> {
    this.feedbackService.update({
      ...feedback,
      isClosed: !feedback.isClosed
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

  onOpen(feedback: Feedback): void {
    this.feedbackService.update({
      ...feedback,
      isClosed: !feedback.isClosed
    });
    this.navCtrl.navigateForward(`/tabs/adminFeedback/show/${feedback.id}`);
  }
}

