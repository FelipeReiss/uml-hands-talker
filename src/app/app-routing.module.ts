import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './auth/pages/login/login.module#LoginPageModule' },
  { path: 'tabs/home/new-word', loadChildren: './words/pages/word-save/word-save.module#WordSavePageModule' },
  { path: 'tabs/home/edit-word/:id', loadChildren: './words/pages/word-save/word-save.module#WordSavePageModule' },
  { path: 'tabs/home/show-word/:id', loadChildren: './words/pages/word-show/word-show.module#WordShowPageModule' },
  { path: 'tabs/favorites/show-word/:id', loadChildren: './words/pages/word-show/word-show.module#WordShowPageModule' },
  { path: 'tabs/favotires/show-word/:id', loadChildren: './words/pages/word-show/word-show.module#WordShowPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
