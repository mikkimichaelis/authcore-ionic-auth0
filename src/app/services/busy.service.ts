import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { IBusyService } from '.';

@Injectable({
  providedIn: 'root'
})
export class BusyService implements IBusyService {
  private loader: any;

  constructor(private loadingController: LoadingController) { }

  async initialize() { }

  async present(message?: string, duration?: number) {
    this.loader = await this.loadingController.create({
      message: message ? message : 'Please wait...',  // TODO remove hard coded defaults
      duration: duration ? duration : environment.busyTimeoutDuration
    });
    await this.loader.present();
  }

  async dismiss() {
    try {
      await this.loader.dismiss();// .//loadingController.dismiss();
    } catch (e) { }
  }
}
