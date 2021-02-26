import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AgmCoreModule } from '@agm/core';

import { AdminTabPageRoutingModule } from './admin-tab-routing.module';

import { AdminTabPage } from './admin-tab.page';
import { AdminPage } from './admin/admin.page';
import { AddPage } from './add/add.page';
@NgModule({
  imports: [
    SharedModule,
    AdminTabPageRoutingModule,
    // AgmCoreModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    AdminTabPage,
    AdminPage,
    AddPage
  ]
})
export class AdminTabPageModule {}
