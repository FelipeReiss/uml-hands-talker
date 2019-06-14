import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { WordSavePage } from './word-save.page';

const routes: Routes = [
  {
    path: '',
    component: WordSavePage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WordSavePage]
})
export class WordSavePageModule {}
