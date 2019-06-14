import { OverlayService } from './../core/services/overlay.service';
import { SharedModule } from './../shared/shared.module';
import { NgModule, OnInit } from '@angular/core';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
/* 
import { AuthService } from '../core/services/auth.service';
import { NavController } from '@ionic/angular';
*/

@NgModule({
  imports: [
    SharedModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule /*implements OnInit*/ {
/*  user: firebase.User;

  constructor(
    private authService: AuthService,
    private overlayService: OverlayService
  ) { }

  async ngOnInit(){
    this.authService.authState$.subscribe(user => this.user = user);
    !this.user
    ? window.location.reload()
    : await this.overlayService.toast({
      message: 'Seja bem vindo(a) ' + this.user.displayName
    });
  } */
}
