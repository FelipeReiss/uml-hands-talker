import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/auth.service';
import { Feedback } from '../models/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackServiceService extends Firestore<Feedback> {
  constructor(private authService: AuthService, db: AngularFirestore) {
    super(db);
    this.init();
  }

   private init(): void {
     this.authService.authState$.subscribe(user => {
         this.setCollection(`/feedbacks`);
         return;
     });
   }

}
