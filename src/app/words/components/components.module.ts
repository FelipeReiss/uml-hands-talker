import { WordItemAdminComponent } from './word-item-admin/word-item-admin.component';
import { WordItemLogoutComponent } from './word-item-logout/word-item-logout.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { WordItemComponent } from './word-item/word-item.component';
import { UserItemAdminComponent } from 'src/app/adminSettings/components/user-item-admin/user-item-admin.component';

@NgModule({
  declarations: [
    WordItemLogoutComponent,
    WordItemAdminComponent,
    UserItemAdminComponent,
    WordItemComponent
  ],
  imports: [SharedModule],
  exports: [WordItemLogoutComponent, WordItemAdminComponent, WordItemComponent, UserItemAdminComponent]
})
export class ComponentsModule { }
