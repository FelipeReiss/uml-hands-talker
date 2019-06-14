import { AuthService } from './../../core/services/auth.service';
import { AngularFirestore } from 'node_modules/@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { Word } from '../models/word.model';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FavoritesWordsService extends Firestore<Word> {
  private words: firestore.Query;
  constructor(private authService: AuthService, db: AngularFirestore) {
    super(db);
    this.init();
  }

   private init(): void {
     this.authService.authState$.subscribe(user => {
       if (user) {
         this.setCollection(`/users/${user.uid}/words`, (ref: firestore.CollectionReference) => {
           this.words = ref.orderBy('done', 'desc').orderBy('title', 'asc');
           return this.words;
         });
         return;
       }
       this.setCollection(null);
     });
   }
}
