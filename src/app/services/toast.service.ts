import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import _ from 'lodash';
import { IToastService } from '.';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToastService implements IToastService {

  private toast: any;

  constructor(public toastController: ToastController) { }
  async present(message: string, duration?: number, options?: any) {

    if( this.toast ) {
      await this.toast.dismiss();
      this.toast = null;
    }

    let opts:any = {};
    if( options ) {
      opts = _.cloneDeep(options);
    }
    if( duration ) {
      opts.duration = duration;
    } else {
      opts.duration = environment.defaultSettings.toastTimeout;
    }

    opts.message = message;

    this.toast = await this.toastController.create(opts)
    await this.toast.present();
  }
}

