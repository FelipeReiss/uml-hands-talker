import { AngularFirestore } from 'node_modules/@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { Word } from '../models/word.model';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class WordsService extends Firestore<Word> {
  private words: firestore.Query;
  constructor(db: AngularFirestore) {
    super(db);
    this.init();
  }

   private init(): void {
    this.setCollection(`/words`, (ref: firestore.CollectionReference) => {
       this.words = ref.orderBy('title', 'asc');
       return this.words;
    });
   }
}
