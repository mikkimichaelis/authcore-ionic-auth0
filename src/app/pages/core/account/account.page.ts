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

  isAuthenticated = false;
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
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    }).catch((error) => {
      console.log(error);
      this.presentToast(error);
    });
  }

  signIn() {
    this.busyService.present('Logging in Zoom user.');
    this.zoomService.login(this.userName, this.password).then((success) => {
      console.log(success);
      console.log(success.message);
      this.presentToast(success.message);
      this.isAuthenticated = true;
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
  signOut() {
    console.log('Going to logout');
    this.zoomService.logout().then((success) => {
      console.log(success.message);
      this.presentToast(success.message);
      this.isAuthenticated = false;
    }).catch((error) => {
      this.presentToast(error.message);
      console.log(error);
    });
  }

  presentToast(text) {
    this.toastService.present( text, 3000 );
  }
}
