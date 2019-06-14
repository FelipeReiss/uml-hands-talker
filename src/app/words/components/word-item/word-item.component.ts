import { Word } from './../../models/word.model';
import { Input, Output, EventEmitter, Component } from '@angular/core';

@Component({
  selector: 'app-word-item',
  templateUrl: './word-item.component.html',
  styleUrls: ['./word-item.component.scss'],
})
export class WordItemComponent {

  @Input() word: Word;
  @Output() favorite = new EventEmitter<Word>();
  @Output() open = new EventEmitter<Word>();
}
