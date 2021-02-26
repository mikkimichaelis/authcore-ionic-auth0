import { Component, Inject, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController, NavController, Platform } from '@ionic/angular';
import { BUSY_SERVICE, IBusyService } from 'src/app/services';
import { GroupsService } from 'src/app/services/groups.service';
import { LocationService } from 'src/app/services/location.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SearchPage } from '../search.page';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage extends SearchPage {

  latitude: number;
  longitude: number;

  constructor(
    public _navController: NavController,
    public _routerOutlet: IonRouterOutlet, 
    public _modalCtrl: ModalController, 
    public _groupsSvc: GroupsService,
    public _locSvc: LocationService,
    public _settingsSvc: SettingsService,
    @Inject(BUSY_SERVICE) public _busyService: IBusyService
    ) {
      super(_navController, _routerOutlet, _modalCtrl, _groupsSvc, _locSvc, _settingsSvc, _busyService)
     }

    async ionViewDidEnter() {
      const { lat, lon } = await this._locSvc.getGps();
      this.latitude = lat;
      this.longitude = lon;

      await this.refresh();
    };
  
    _infoWindow: any;
     clickedMarker( infoWindow ) {
       if( this._infoWindow ) this._infoWindow.close();
       this._infoWindow = infoWindow;
     }
}
