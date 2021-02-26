import { Component, Inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import _ from 'lodash';
import { ViewPage } from 'src/app/pages/meetings-tab/view/view.page';
import { BusyService, BUSY_SERVICE, IBusyService, IToastService, IUserService, TOAST_SERVICE, USER_SERVICE, ZoomService } from 'src/app/services';
import { Meeting } from 'src/shared/models';

@Component({
  selector: 'meeting-listing',
  templateUrl: './meeting-listing.component.html',
  styleUrls: ['./meeting-listing.component.scss'],
})
export class MeetingListingComponent implements OnInit {

  @Input() meeting: Meeting;
  @Input() watch: boolean = false;

  constructor(
    private modalController: ModalController,
    private busySvc: BusyService,
    private zoomService: ZoomService,
    @Inject(USER_SERVICE) private userService: IUserService,
    @Inject(TOAST_SERVICE) private toastService: IToastService,
    @Inject(BUSY_SERVICE) private busyService: IBusyService,) { }

  ngOnInit() {}

  format(str: string): string {
    return _.truncate(str, { length: 30, omission: '...'});
  }

  isHome(meeting: Meeting): boolean {
    return meeting.isHome(this.userService._user);
  }

  async joinOrViewMeeting(meeting: Meeting) {
    if (meeting.isLive) {
      await this.joinMeeting(meeting);
    } else {
      await this.viewMeeting(meeting);
    }
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

  async viewMeeting(meeting: Meeting) {
    const modal = await this.modalController.create({
      component: ViewPage,
      componentProps: {
        meeting: meeting
      }
    });
    return await modal.present();
  }

  

  reportMeeting(meeting) {

  }

  blockMeeting(meeting){

  }

}
