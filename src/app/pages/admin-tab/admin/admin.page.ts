import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import _ from 'lodash';
import { IMeetingService, IUserService, MEETING_SERVICE, SharedDataService, USER_SERVICE } from 'src/app/services';
import { Meeting } from 'src/shared/models';
import { AddPage } from '../add/add.page';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  admin = [];

  constructor(
    public modalController: ModalController,
    public sharedDataService: SharedDataService,
    @Inject(USER_SERVICE) public userService: IUserService,
    @Inject(MEETING_SERVICE) public meetingService: IMeetingService) {
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.meetingService.ownedMeetingsSubscribe();
  }

  ionViewWillLeave() {
    this.meetingService.ownedMeetingsUnsubscribe();
  }

  async editMeeting(meeting?: Meeting) {
    const modal = await this.modalController.create({
      component: AddPage,
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