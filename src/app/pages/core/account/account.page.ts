import { Component, Inject, OnInit } from '@angular/core';
import { Zoom } from '@ionic-native/zoom/ngx';
import { ToastController } from '@ionic/angular';
import { BUSY_SERVICE, IBusyService, IToastService, TOAST_SERVICE } from 'src/app/services';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  loggedIn = false;
  userName = '';
  password = '';

  constructor( 
    private zoomService: Zoom, 
    @Inject(TOAST_SERVICE) private toastService: IToastService,
    @Inject(BUSY_SERVICE) private busyService: IBusyService) {
  }

  ngOnInit() {
    this.zoomService.isLoggedIn().then((success) => {
      console.log(success);
      if (success === true) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    }).catch((error) => {
      console.log(error);
      this.presentToast(error);
    });
  }

  login() {
    this.busyService.present('Logging in Zoom user.');
    this.zoomService.login(this.userName, this.password).then((success) => {
      console.log(success);
      console.log(success.message);
      this.presentToast(success.message);
      this.loggedIn = true;
      this.userName = '';
      this.password = '';
    }).catch((error) => {
      console.log(error);
      this.presentToast(error.message);
    }).finally(() => {
      this.busyService.dismiss();
    });
  }

  /**
   * Log user out.
   */
  logout() {
    console.log('Going to logout');
    this.zoomService.logout().then((success) => {
      console.log(success.message);
      this.presentToast(success.message);
      this.loggedIn = false;
    }).catch((error) => {
      this.presentToast(error.message);
      console.log(error);
    });
  }

  presentToast(text) {
    this.toastService.present( text, 3000 );
  }
}
