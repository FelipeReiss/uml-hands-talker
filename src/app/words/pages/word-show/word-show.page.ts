import { ActivatedRoute } from '@angular/router';
import { WordsService } from './../../services/words.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-word-show',
  templateUrl: './word-show.page.html',
  styleUrls: ['./word-show.page.scss'],
})
export class WordShowPage implements OnInit {

  wordID: string = undefined;
  wordLink: string = undefined;
  wordTitle: string = undefined;
  wordDescription: string = undefined;

  constructor(
    private wordsService: WordsService,
    private route: ActivatedRoute,
    private dom: DomSanitizer
  ) { }

  ngOnInit() {
    this.init();
  }

  init(): void {
    const wordID = this.route.snapshot.paramMap.get('id');
    this.wordID = wordID;
    this.wordsService
    .get(this.wordID)
    .pipe(take(1))
    .subscribe(({ title, link, description }) => {
      this.wordTitle = title;
      this.wordLink = link;
      this.wordDescription = description;
    });
  }

  getSafeLink(): SafeResourceUrl {
    return this.dom.bypassSecurityTrustResourceUrl(this.wordLink);
  }
}
