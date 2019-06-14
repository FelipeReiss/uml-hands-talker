import { UserService } from './auth/services/user.service';
import { UserFirestoreClass } from './auth/classes/UserFirestoreClass.class';
import { AuthService } from './core/services/auth.service';
import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OverlayService } from './core/services/overlay.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  user: firebase.User;
  userFirestoreClass = new UserFirestoreClass();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private navCtrl: NavController,
    private overlayService: OverlayService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.authService.authState$.subscribe(async user => {
      this.user = user;
      this.authService.setUserFire(user);
    });
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async onLogout(): Promise<void> {
    await this.overlayService.alert({
      message: this.user.displayName + ', você realmente deseja sair?',
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            const loading = await this.overlayService.loading();
            await this.authService.logout()
            .then(() => {
              this.navCtrl.navigateRoot('/tabs/home');
              loading.dismiss();
          });
          }
        },
        'Não'
      ]
    });
  }

  onRefresh(): void {
    window.location.reload();
  }
  onExit(): void {
    navigator['app'].exitApp();
  }
}
