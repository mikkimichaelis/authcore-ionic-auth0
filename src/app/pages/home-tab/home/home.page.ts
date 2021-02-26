import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { BusyService } from '../../../services/busy.service';
import { UserService } from '../../../services/user.service';
import { GroupsService } from '../../../services/groups.service';

import { StreamChat, ChannelData, Message, User } from 'stream-chat';
import axios from 'axios';
import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { IMeeting, IUserFriend, Meeting } from 'src/shared/models';
import { AUTH_SERVICE, BUSY_SERVICE, DATA_SERVICE, IAuthService, IBusyService, IDataService, IMeetingService, IToastService, IUserService, MEETING_SERVICE, TOAST_SERVICE, USER_SERVICE, ZoomService } from 'src/app/services';
import { ModalController, NavController } from '@ionic/angular';
import { ViewPage } from '../../meetings-tab/view/view.page';
import _ from 'lodash';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public router: Router,
    public navController: NavController,
    public modalController: ModalController,
    public busySvc: BusyService,
    public socialSharing: SocialSharing,
    public zoomService: ZoomService,
    public iab: InAppBrowser,
    @Inject(TOAST_SERVICE) public toastService: IToastService,
    @Inject(BUSY_SERVICE) public busyService: IBusyService,
    @Inject(AUTH_SERVICE) public authService: IAuthService,
    @Inject(USER_SERVICE) public userService: IUserService,
    @Inject(MEETING_SERVICE) public meetingService: IMeetingService,
    @Inject(DATA_SERVICE) public dataService: IDataService) {
    // debugger;
  }

  ngOnInit() {
    this.dataService.logout$.subscribe(logout => {
      if (logout) {
        this.unsubscribe();
      }
    });
    this.subscribe();
  }

  _userSubscription: Subscription;
  _liveMeetingsSubscription: Subscription;
  _liveMeetingsRefreshInterval: NodeJS.Timeout;
  async subscribe() {
    // TODO move to meeting service
    this._userSubscription = this.userService.user$.subscribe(user => {
      // this is necessary to recreate the fav meeting query from favorites attached to IUser
      // TODO favorite meetings limited to 10 due to the 'where in array' query limit of 10
      this.meetingService.favoriteMeetingsSubscribe();
    })

    // this._liveMeetingsSubscription = this.meetingService.liveMeetings$.subscribe(live => {
    //   this._showLiveMeetings = (live && live.length > 0);
    // })

    this.meetingService.liveMeetingsSubscribe();
    // TODO this is necessary because the live query is time based and requires periodic current recreation 
    // but I hate it
    this._liveMeetingsRefreshInterval = setInterval(() => {
      this.meetingService.liveMeetingsSubscribe();
    }, 60000);
  }

  unsubscribe() {
    this.userService.unsubscribe();

    if (this._userSubscription && !this._userSubscription.closed) {
      this._userSubscription.unsubscribe();
      this._userSubscription = null;
    }
    this.meetingService.favoriteMeetingsUnsubscribe();

    if (this._liveMeetingsSubscription && !this._liveMeetingsSubscription.closed) {
      this._liveMeetingsSubscription.unsubscribe();
      this._liveMeetingsSubscription = null;
    }
    this.meetingService.liveMeetingsUnsubscribe();

    if (this._liveMeetingsRefreshInterval) {
      clearInterval(this._liveMeetingsRefreshInterval);
      this._liveMeetingsRefreshInterval = null;
    }
  }

  async signOut() {
    await this.authService.signOut();
  }

  options = {
    message: 'share this', // not supported on some apps (Facebook, Instagram)
    subject: 'the subject', // fi. for email
    files: ['', ''], // an array of filenames either locally or remotely
    url: 'https://www.website.com/foo/#bar?a=b',
    chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
    appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
    iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
  };
  share() {
    //this.socialSharing.shareWithOptions(this.options);
    this.socialSharing.share("Open WhitsApp", "WhitsApp Recovery Meetings", [], `https://anonymousmeetings.us/assets/pages/download.html`);
  }

  daysSober() {
    console.log('daysSober');
  }

  chatWithFriend(friend: IUserFriend) {
    console.log('chatWithFriend()');
  }

  videoWithFriend(friend: IUserFriend) {
    console.log('videoWithFriend()');
  }

  viewFavorites() {
    this.navController.navigateForward('/home/tab/favorites');
  }

  viewLive() {
    this.navController.navigateForward('/home/tab/live');
  }

  async viewHomeMeeting() {
    this.viewMeeting(this.userService._homeMeeting)
  }

  format(str: string): string {
    return _.truncate(str, { length: 30, omission: '...' });
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

  isFavorite(meeting: Meeting): boolean {
    return -1 !== _.indexOf(this.userService._user.favMeetings, meeting.id)
  }

  async addFavorite(meeting: Meeting) {
    if (!this.isFavorite(meeting)) {
      this.userService._user.favMeetings.push(meeting.id);
      await this.userService.saveUserAsync(this.userService._user);
    }
  }

  async removeFavorite(meeting: Meeting) {
    _.pull(this.userService._user.favMeetings, meeting.id);
    await this.userService.saveUserAsync(this.userService._user);
  }

  async removeHomeMeeting(meeting: Meeting) {
    if (this.userService._user.homeMeeting === meeting.id) {
      this.userService._user.homeMeeting = null,
        await this.userService.saveUserAsync(this.userService._user);
    }
  }

  buymeacoffee() {
    // TODO config
    this.iab.create('https://www.buymeacoffee.com/mikkimichaelis', '_system') // target?: string, options?: string
  }
}
