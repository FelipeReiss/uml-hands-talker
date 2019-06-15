import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminFeedbackPage } from './adminFeedback.page';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../words/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    RouterModule.forChild([{ path: '', component: AdminFeedbackPage }])
  ],
  declarations: [AdminFeedbackPage]
})
export class AdminFeedbackPageModule {}
