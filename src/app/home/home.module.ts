import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomePage } from './home.page';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../words/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
