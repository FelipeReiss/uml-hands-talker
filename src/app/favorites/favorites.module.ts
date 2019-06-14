import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FavoritesPage } from './favorites.page';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../words/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    RouterModule.forChild([{ path: '', component: FavoritesPage }])
  ],
  declarations: [FavoritesPage]
})
export class FavoritesPageModule {}
