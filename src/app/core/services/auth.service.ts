import { UserService } from './../../auth/services/user.service';
import { UserFirestoreClass } from './../../auth/classes/UserFirestoreClass.class';
import { User, AuthProvider, AuthOptions } from './auth.types';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  operation: Promise<auth.UserCredential>;
  authState$: Observable<firebase.User>;
  userFirestoreClass$ = new UserFirestoreClass();
  userFirebase;
  constructor(
    private afAuth: AngularFireAuth,
  ) {
    this.authState$ = this.afAuth.authState;
  }

  get isAuthenticated(): Observable<boolean> {
    return this.authState$.pipe(map(user => user !== null));
  }

  doAuthenticate({ isSignIn, provider, user }: AuthOptions): void {
    if (provider !== AuthProvider.Email){
      this.operation = this.signInWithPopup(provider);
    } else {
      this.operation = isSignIn ? this.signInWithEmail(user) : this.signUpWithEmail(user);
    }
  }


  tryAuthenticate({ isSignIn, provider, user }: AuthOptions, userService: UserService ): Promise<auth.UserCredential> {
    this.doAuthenticate({isSignIn, provider, user});
    this.updateUserFireClass(userService).finally();
    return this.operation;
  }
  callback(): void {
  }
  updateUserFireClass(userService): Promise<void> {
    let promise = new Promise<void>(this.callback);
    const userFirestoreClass = new UserFirestoreClass();
    if (this.userFirebase) {
      userFirestoreClass.id = this.userFirebase.uid;
      userService.search(userFirestoreClass, '/users')
      .pipe(take(1))
      .subscribe(valor => {
        if (valor[0]) {
          userFirestoreClass.favoritesWords = (valor[0] as UserFirestoreClass).favoritesWords.filter(Boolean);
          userFirestoreClass.admin = (valor[0] as UserFirestoreClass).admin;
          userFirestoreClass.name = (valor[0] as UserFirestoreClass).name;
          userFirestoreClass.email = (valor[0] as UserFirestoreClass).email;
        } else {
          userFirestoreClass.favoritesWords = [];
          userFirestoreClass.admin = false;
          userService.create({
            id: userFirestoreClass.id,
            admin: userFirestoreClass.admin,
            favoritesWords: userFirestoreClass.favoritesWords,
            name: this.userFirebase.displayName,
            email: this.userFirebase.email
        });
        }
        this.setUser(userFirestoreClass);
      }
      );
    } else {
      this.removeUser();
    }
    return promise;
  }

  setUser(userFirestoreClass: UserFirestoreClass): void {
    this.userFirestoreClass$ = userFirestoreClass;
   }

  removeUser(): void {
    this.userFirestoreClass$ = new UserFirestoreClass;
  }

  setUserFire(user): void {
    this.userFirebase = user;
  }

  getUserFire() {
    return this.userFirebase;
  }

  logout(): Promise<void> {
    this.userFirestoreClass$ = new UserFirestoreClass();
    this.userFirebase = undefined;
    return this.afAuth.auth.signOut();
  }

  private signInWithEmail({ email, password }: User): Promise<auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  private signUpWithEmail({ email, password, name }: User): Promise<auth.UserCredential> {
    return this.afAuth.auth
    .createUserWithEmailAndPassword(email, password)
    .then(credentials =>
      credentials.user.updateProfile({displayName: name, photoURL: null })
      .then(() => credentials)
    );
  }

  private signInWithPopup(provider: AuthProvider): Promise<auth.UserCredential> {
    let signInProvider = null;
    switch (provider) {
      case AuthProvider.Facebook:
        signInProvider = new auth.FacebookAuthProvider();
        break;
      case AuthProvider.Google:
        signInProvider = new auth.GoogleAuthProvider();
        break;
    }
    return this.afAuth.auth.signInWithPopup(signInProvider);
  }

}
