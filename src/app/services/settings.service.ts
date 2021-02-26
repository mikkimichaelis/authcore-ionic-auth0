import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';

import { FIRESTORE_SERVICE, TOAST_SERVICE } from './injection-tokens';
import { IFirestoreService } from './firestore.service.interface';
import { ISettingsService } from './settings.service.interface';
import { IUserSettings } from '../models';
import _ from 'lodash';
import { IToastService } from './toast.service.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements ISettingsService {

  public environment: any = environment;
  public googleCloud: any;
  public logRocket: any;
  public settings: IUserSettings = <any>{};

  get darkTheme(): boolean {
    return this.settings.darkTheme;
  }
  set darkTheme(value: boolean) {
    this.settings.darkTheme = value;
    this.save();
  }

  constructor(
    private storage: Storage, 
    @Inject(FIRESTORE_SERVICE) private fss: IFirestoreService,
    @Inject(TOAST_SERVICE) private toastService: IToastService) { }

  async initialize(auth: boolean) {
    if (auth) {
      try {
        this.googleCloud = (await this.fss.col('config').doc('googleCloud').get().toPromise()).data();
        this.logRocket = (await this.fss.col('config').doc('logRocket').get().toPromise()).data();
      } catch (e) {
        console.error(e);
        this.toastService.present(`Network Communication Error`);
      }
    } else {
      this.settings = <any>Object.assign({}, environment.defaultSettings)
      await this.load();
    }
  }

  async load() {
    try {
      const settings = await this.storage.get('settings');
      if (settings) {
        _.merge(this.settings, settings);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async save() {
    try {
      this.storage.set('settings', this.settings);
    } catch (error) {
      console.error(error);
    }
  }
}
