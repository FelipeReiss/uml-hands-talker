import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminSettingsPage } from './adminSettings.page';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../words/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    RouterModule.forChild([{ path: '', component: AdminSettingsPage }])
  ],
  declarations: [AdminSettingsPage]
})
export class AdminSettingsPageModule {}
