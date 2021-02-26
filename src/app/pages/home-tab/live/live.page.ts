import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusyService, BUSY_SERVICE, IBusyService, IMeetingService, IToastService, IUserService, MEETING_SERVICE, TOAST_SERVICE, USER_SERVICE, ZoomService } from 'src/app/services';
import { Meeting } from 'src/shared/models';

@Component({
  selector: 'app-live',
  templateUrl: './live.page.html',
  styleUrls: ['./live.page.scss'],
})
export class LivePage implements OnInit {

  constructor(
    public busySvc: BusyService, 
    public zoomService: ZoomService,
    @Inject(TOAST_SERVICE) public toastService: IToastService,
    @Inject(BUSY_SERVICE) public busyService: IBusyService,
    @Inject(USER_SERVICE) public userService: IUserService,
    @Inject(MEETING_SERVICE) public meetingService: IMeetingService) {
    
  }

  ngOnInit() {
    this.meetingService.liveMeetingsSubscribe();
  }

  async joinMeeting(meeting: Meeting) {
    await this.busyService.present('Connecting Zoom Meeting...')
    this.zoomService.joinMeeting(meeting.zid, meeting.password, meeting.name, this.userService._user.name).then(
      rv => {
      this.busyService.dismiss();
    }, error => {
      this.busyService.dismiss();
      this.toastService.present(`${error}`, 3000);
    })
  }
}
