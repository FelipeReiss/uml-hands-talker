import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WordShowPage } from './word-show.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: WordShowPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WordShowPage]
})
export class WordShowPageModule {}
