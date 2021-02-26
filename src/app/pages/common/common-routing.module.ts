import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../guards/auth.guard';
import { FeatureGuard } from '../../guards/feature.guard';


import { CalendarPage } from './calendar/calendar.page';
import { ChatPage } from './chat/chat.page';
import { FeedPage } from './feed/feed.page';
import { MessagesPage } from './messages/messages.page';
import { SponsorPage } from './sponsor/sponsor.page';
import { UserPage } from './user/user.page';
import { ZoomPage } from './zoom/zoom.page';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/core/landing',
  //   pathMatch: 'full',
  // },
  {
    path: 'calendar',
    component: CalendarPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'feed',
    component: FeedPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    component: UserPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    component: MessagesPage,
    canActivate: [FeatureGuard],
    data: {roles: ['User']}
  },
  {
    path: 'sponsor',
    component: SponsorPage,
    canActivate: [FeatureGuard],
    data: {roles: ['User']}
  },
  {
    path: 'zoom',
    component: ZoomPage,
    canActivate: [FeatureGuard],
    data: {roles: ['User']}
  },
  // {
  //   path: '**',
  //   redirectTo: '/',
  //   pathMatch: 'full'
  // }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonRoutingModule { }
