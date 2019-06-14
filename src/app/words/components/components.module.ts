import { WordItemComponent } from './word-item/word-item.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    WordItemComponent],
  imports: [SharedModule],
  exports: [WordItemComponent]
})
export class ComponentsModule { }
