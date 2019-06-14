import { UserService } from './../auth/services/user.service';
import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  isAdmin = false;
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  timeOut(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  }

  initializeApp() {
    this.authService.authState$.subscribe(async user => {
      this.authService.updateUserFireClass(this.userService);
      await this.timeOut(1000)
      .then(() => this.isAdmin = this.authService.userFirestoreClass$.admin);
    });
  }
}
