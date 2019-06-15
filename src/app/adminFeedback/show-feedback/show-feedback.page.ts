import { FeedbackClass } from './../../feedback/classes/feedbackClass.class';
import { FeedbackServiceService } from './../../feedback/services/feedback-service.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-show-feedback',
  templateUrl: './show-feedback.page.html',
  styleUrls: ['./show-feedback.page.scss'],
})
export class ShowFeedbackPage implements OnInit {

  feedback = new FeedbackClass();

  constructor(
    private route: ActivatedRoute,
    private feedbackService: FeedbackServiceService
  ) { }

  ngOnInit() {
    this.Init();
  }

  onClose(){
    this.feedbackService.update({
      ...this.feedback,
      isClosed: !this.feedback.isClosed
    });
  }

  Init() {
    this.feedbackService
    .get(this.route.snapshot.paramMap.get('id'))
    .pipe(take(1))
    .subscribe((obj) => {
      this.feedback.id = obj.id;
      this.feedback.isClosed = obj.isClosed;
      this.feedback.dateTime = obj.dateTime;
      this.feedback.body = obj.body;
      this.feedback.senderMail = obj.senderMail;
      this.feedback.senderName = obj.senderMail;
      this.feedback.subject = obj.subject;
    });
  }

}
