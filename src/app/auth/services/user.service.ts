import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserFirestore } from '../models/userFirestore.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends Firestore<UserFirestore> {
  constructor(private authService: AuthService, db: AngularFirestore) {
    super(db);
    this.init();
  }

   private init(): void {
     this.authService.authState$.subscribe(user => {
       if (user) {
         this.setCollection(`/users`);
         return;
       }
       this.setCollection(null);
     });
   }

}
