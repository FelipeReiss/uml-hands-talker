import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FeedbackPage } from './feedback.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: FeedbackPage }])
  ],
  declarations: [FeedbackPage]
})
export class FeedbackPageModule {}
