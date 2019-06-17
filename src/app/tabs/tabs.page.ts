import { FeedbackServiceService } from './../feedback/services/feedback-service.service';
import { UserService } from './../auth/services/user.service';
import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  isAdmin = false;
  feedbackUsers = 0;

  constructor(
    private feedbackService: FeedbackServiceService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  timeOut(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  }

  setFav() {
    this.authService.setNextPath('/tabs/favorites');
  }

  initializeApp() {
    this.authService.authState$.subscribe(async user => {
      if (user) {
        this.authService.updateUserFireClass(this.userService);
        await this.timeOut(1000)
        .then(() => this.isAdmin = this.authService.getUserFireClass().admin);
        this.authService.setFeedbackUsers(this.feedbackService);
        this.timeOut(500).then(() => this.feedbackUsers = this.authService.getFeedbackUsers());
      }
    });
  }

  ionViewWillEnter() {
    this.authService.setFeedbackUsers(this.feedbackService);
    this.timeOut(500).then(() => this.feedbackUsers = this.authService.getFeedbackUsers());
  }

  ionViewDidEnter() {

  }
}
