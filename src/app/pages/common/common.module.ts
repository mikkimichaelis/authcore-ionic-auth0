import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';

// import { NgCalendarModule  } from 'ionic2-calendar';

import { CommonRoutingModule } from './common-routing.module';

import { CalendarPage } from './calendar/calendar.page';
import { ChatPage } from './chat/chat.page';
import { FeedPage } from './feed/feed.page';
import { MessagesPage } from './messages/messages.page';
import { SponsorPage } from './sponsor/sponsor.page';
import { UserPage } from './user/user.page';
import { ZoomPage } from './zoom/zoom.page';

@NgModule({
  imports: [
    SharedModule,
    // NgCalendarModule,
    CommonRoutingModule
  ],
  declarations: [
    CalendarPage,
    ChatPage,
    FeedPage,
    MessagesPage,
    SponsorPage,
    UserPage,
    ZoomPage
  ],
  
})
export class CommonModule { }
