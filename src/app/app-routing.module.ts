import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './auth/pages/login/login.module#LoginPageModule' },
  { path: 'tabs/home/new-word', loadChildren: './words/pages/word-save/word-save.module#WordSavePageModule', canLoad: [AuthGuard] },
  { path: 'tabs/home/edit-word/:id', loadChildren: './words/pages/word-save/word-save.module#WordSavePageModule', canLoad: [AuthGuard] },
  { path: 'tabs/home/show-word/:id', loadChildren: './words/pages/word-show/word-show.module#WordShowPageModule' },
  { path: 'tabs/favorites/show-word/:id', loadChildren: './words/pages/word-show/word-show.module#WordShowPageModule' },
  // tslint:disable-next-line:max-line-length
  { path: 'tabs/adminFeedback/show/:id', loadChildren: './adminFeedback/show-feedback/show-feedback.module#ShowFeedbackPageModule', canLoad: [AuthGuard] },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
