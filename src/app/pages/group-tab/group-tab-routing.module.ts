import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupTabPage } from './group-tab.page';
import { CalendarPage } from '../common/calendar/calendar.page';
import { FeedPage } from '../common/feed/feed.page';
import { GroupPage } from './group/group.page';
import { ChatPage } from '../common/chat/chat.page';
import { MembersPage } from './members/members.page';

const routes: Routes = [
  // {
  //   path: 'group',
  //   redirectTo: 'group/tab',
  //   pathMatch: 'full'
  // },
  {
    path: 'tab',
    component: GroupTabPage,
    children: [
      // {
      //   path: 'group',
      //   redirectTo: 'group/tab/group',
      //   pathMatch: 'full'
      // },
      {
        path: 'group',
        children: [
          {
            path: '',
            component: GroupPage
          }
        ]
      },
      {
        path: 'feed',
        children: [
          {
            path: '',
            component: FeedPage
          }
        ]
      },
      {
        path: 'calendar',
        children: [
          {
            path: '',
            component: CalendarPage
          }
        ]
      },
      {
        path: 'chat',
        children: [
          {
            path: '',
            component: ChatPage
          }
        ]
      },
      {
        path: 'members',
        children: [
          {
            path: '',
            component: MembersPage
          }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupTabPageRoutingModule {}
