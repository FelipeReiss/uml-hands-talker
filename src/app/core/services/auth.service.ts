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
  private userFirestoreClass = new UserFirestoreClass();
  private userFirebase;
  private feedbackUsers = 0;
  private nextPath = '';

  constructor(
    private afAuth: AngularFireAuth,
  ) {
    this.authState$ = this.afAuth.authState;
  }

  get isAuthenticated(): Observable<boolean> {
    return this.authState$.pipe(map(user => user !== null));
  }

  doAuthenticate({ isSignIn, provider, user }: AuthOptions): Promise<auth.UserCredential> {
    if (provider !== AuthProvider.Email) {
      return this.signInWithPopup(provider);
    } else {
      return isSignIn ? this.signInWithEmail(user) : this.signUpWithEmail(user);
    }
  }

  timeOut(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  }

  async tryAuthenticate({ isSignIn, provider, user }: AuthOptions, userService: UserService ): Promise<auth.UserCredential> {
    this.operation = this.doAuthenticate({isSignIn, provider, user});
    this.isAuthenticated.pipe(take(1)).subscribe(isAuth => {
      if (isAuth) {
        this.updateUserFireClass(userService);
      } else {
        this.setUserFireClass(undefined);
      }
    });
    return this.operation;
  }

  callback(): void {
  }

  updateUserFireClass(userService): Promise<void> {
    const promise = new Promise<void>(this.callback);
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
        this.setUserFireClass(userFirestoreClass);
      }
      );
    } else {
      this.cleanUserApp();
    }
    return promise;
  }

  setNextPath(path: string){
    this.nextPath = path;
  }

  getNextPacth(){
    return this.nextPath;
  }

  removeUser(): void {
    this.userFirestoreClass = undefined;
  }

  setUserFire(user): void {
    this.userFirebase = user;
  }

  getUserFire() {
    return this.userFirebase;
  }

  setUserFireClass(user): void {
    this.userFirestoreClass = user;
  }

  getUserFireClass() {
    return this.userFirestoreClass;
  }

  setFeedbackUsers(feedbackService): void {
    this.isAuthenticated.pipe(take(1)).subscribe((isAuth) => {
      if (isAuth){
        feedbackService.getMailsClosed('isClosed', true, '/feedbacks').subscribe((result) => {
          this.feedbackUsers = result.length;
        });
      } else {
        this.feedbackUsers = 0;
      }
    });
  }

  getFeedbackUsers() {
    return this.feedbackUsers;
  }

  cleanUserApp(): void {
    this.operation = undefined;
    this.userFirestoreClass = undefined;
    this.userFirebase = undefined;
  }

  logout(): Promise<void> {
    this.cleanUserApp();
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
