import { Component, Inject, OnInit } from '@angular/core';
import { IMeetingService, MEETING_SERVICE } from 'src/app/services';

@Component({
  selector: 'app-meetings-tab',
  templateUrl: './meetings-tab.page.html',
  styleUrls: ['./meetings-tab.page.scss'],
})
export class MeetingsTabPage implements OnInit {

  constructor(@Inject(MEETING_SERVICE) private meetingService: IMeetingService) { }

  ngOnInit() {
    //this.meetingService.favoriteMeetingsValueChanges()
  }
}
