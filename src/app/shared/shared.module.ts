import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchPipe } from '../search.pipe';

@NgModule({
  declarations: [SearchPipe],
  exports: [ CommonModule, ReactiveFormsModule, IonicModule, SearchPipe ]
})
export class SharedModule { }
