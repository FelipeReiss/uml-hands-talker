import { Word } from '../../models/word.model';
import { Input, Output, EventEmitter, Component } from '@angular/core';

@Component({
  selector: 'app-word-item-logout',
  templateUrl: './word-item-logout.component.html',
  styleUrls: ['./word-item-logout.component.scss'],
})
export class WordItemLogoutComponent {

  @Input() word: Word;
  @Output() open = new EventEmitter<Word>();
}
