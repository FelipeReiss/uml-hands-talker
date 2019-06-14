import { WordItemAdminComponent } from './word-item-admin/word-item-admin.component';
import { WordItemLogoutComponent } from './word-item-logout/word-item-logout.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { WordItemComponent } from './word-item/word-item.component';

@NgModule({
  declarations: [
    WordItemLogoutComponent,
    WordItemAdminComponent,
    WordItemComponent
  ],
  imports: [SharedModule],
  exports: [WordItemLogoutComponent, WordItemAdminComponent, WordItemComponent]
})
export class ComponentsModule { }
