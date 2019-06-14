import { OverlayService } from './../core/services/overlay.service';
import { SharedModule } from './../shared/shared.module';
import { NgModule, OnInit } from '@angular/core';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    SharedModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }
