import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import _ from 'lodash';
import { BUSY_SERVICE, DATA_SERVICE, IBusyService, IDataService, ISettingsService, IToastService, IUserService, MeetingService, SETTINGS_SERVICE, TOAST_SERVICE, USER_SERVICE, ZoomService } from 'src/app/services';
import { GroupsService } from 'src/app/services/groups.service';
import { LocationService } from 'src/app/services/location.service';
import { SettingsService } from 'src/app/services/settings.service';
import { IMeeting, Meeting } from 'src/shared/models';
import { ViewPage } from '../view/view.page';
import { SearchHelpPage } from './search-help/search-help.page';
import { SearchSettingsPage } from './search-settings/search-settings.page';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor( 
    public routerOutlet: IonRouterOutlet, 
    public modalController: ModalController,
    public meetingService: MeetingService, 
    public locSvc: LocationService,
    public zoomService: ZoomService,
    @Inject(TOAST_SERVICE) public toastService: IToastService,
    @Inject(BUSY_SERVICE) public busyService: IBusyService,
    @Inject(USER_SERVICE) public userService: IUserService,
    @Inject(SETTINGS_SERVICE) public settingsService: ISettingsService,
    @Inject(DATA_SERVICE) public dataService: IDataService
    ) { }

  ngOnInit() {
    this.refresh();
  }

  async ionViewDidEnter() {
    // if (this.settingsService.settings.searchSettings.showHelp) {
    //   await this.presentHelp();
    // }

  };

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

  async refresh() {
    await this.meetingService.getMeetingsAsync(this.settingsService.settings.searchSettings);
  }

  async presentSettings() {
    if( (<any>this)._infoWindow ) { 
      (<any>this)._infoWindow.close(); 
      (<any>this)._infoWindow = null; 
    }
    
    const modal = await this.modalController.create({
      component: SearchSettingsPage,
      cssClass: 'search-options-class',
      componentProps: { input: this.settingsService.settings.searchSettings },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    const rv: any =  await modal.present();
    const settings = await modal.onWillDismiss();
    if( settings.data ) {
      this.settingsService.settings.searchSettings = <any>settings.data;
      await this.settingsService.save()
      await this.refresh();
    }
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

  async removeFavorite(meeting: IMeeting) {
    _.pull(this.userService._user.favMeetings, meeting.id);
      await this.userService.saveUserAsync(this.userService._user);
  }

  async viewMeeting(meeting: IMeeting) {
    const modal = await this.modalController.create({
      component: ViewPage,
      componentProps: {
        meeting: meeting
      }
    });
    return await modal.present();
  }

  async presentHelp() {    
    const modal = await this.modalController.create({
      mode: this.settingsService.environment.design,
      component: SearchHelpPage,
      //cssClass: 'search-help-class',
      //componentProps: { input: this.settingsService.settings.searchSettings },
      swipeToClose: true,
      backdropDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    const rv: any =  await modal.present();
    const result = await modal.onWillDismiss();
    if( result.data ) {
      this.settingsService.settings.searchSettings.showHelp = <any>result.data;
      await this.settingsService.save()
      await this.refresh();
    }
  }
}
