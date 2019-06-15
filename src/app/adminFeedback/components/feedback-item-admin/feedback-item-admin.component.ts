import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Feedback } from 'src/app/feedback/models/feedback.model';

@Component({
  selector: 'app-feedback-item-admin',
  templateUrl: './feedback-item-admin.component.html',
  styleUrls: ['./feedback-item-admin.component.scss'],
})
export class FeedbackItemAdminComponent {

  @Input() feedback: Feedback;
  @Output() isOpen = new EventEmitter<Feedback>();
  @Output() delete = new EventEmitter<Feedback>();
  @Output() open = new EventEmitter<Feedback>();

}
