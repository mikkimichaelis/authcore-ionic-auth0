import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';

import { SecretaryTabPageRoutingModule } from './secretary-tab-routing.module';

import { SecretaryTabPage } from './secretary-tab.page';
import { AdminPage } from './admin/admin.page';
import { MinutesPage } from './minutes/minutes.page';

@NgModule({
  imports: [
    SharedModule,
    SecretaryTabPageRoutingModule
  ],
  declarations: [
    SecretaryTabPage,
    AdminPage,
    MinutesPage
  ]
})
export class SecretaryTabPageModule {}
