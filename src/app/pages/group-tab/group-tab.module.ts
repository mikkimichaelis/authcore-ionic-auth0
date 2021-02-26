import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';

import { GroupTabPageRoutingModule } from './group-tab-routing.module';

import { GroupTabPage } from './group-tab.page';
import { GroupPage } from './group/group.page';
import { MembersPage } from './members/members.page';

@NgModule({
  imports: [
    SharedModule,
    GroupTabPageRoutingModule
  ],
  declarations: [
    GroupTabPage,
    GroupPage,
    MembersPage]
})
export class GroupTabPageModule {}
