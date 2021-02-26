import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import _ from 'lodash';
import { BusyService, BUSY_SERVICE, IBusyService, IMeetingService, IToastService, IUserService, MEETING_SERVICE, TOAST_SERVICE, USER_SERVICE, ZoomService } from 'src/app/services';
import { Meeting } from 'src/shared/models';
import { ViewPage } from '../../meetings-tab/view/view.page';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  constructor(
    public busySvc: BusyService, 
    public modalController: ModalController,
    public zoomService: ZoomService,
    @Inject(TOAST_SERVICE) public toastService: IToastService,
    @Inject(BUSY_SERVICE) public busyService: IBusyService,
    @Inject(USER_SERVICE) public userService: IUserService,
    @Inject(MEETING_SERVICE) public meetingService: IMeetingService) {
    
  }

  ngOnInit() {
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

  isFavorite(meeting: Meeting): boolean {
    return -1 !== _.indexOf(this.userService._user.favMeetings, meeting.id)
  }

  async addFavorite(meeting: Meeting) {
    if( !this.isFavorite(meeting) ) {
      this.userService._user.favMeetings.push(meeting.id);
      await this.userService.saveUserAsync(this.userService._user);
    }
  }

  async removeFavorite(meeting: Meeting) {
    _.pull(this.userService._user.favMeetings, meeting.id);
      await this.userService.saveUserAsync(this.userService._user);
  }
}
