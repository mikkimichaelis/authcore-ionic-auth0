import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app'
import { from, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { AuthService, AUTH_SERVICE, IAuthService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(
    private platform: Platform, 
    private route: ActivatedRoute, 
    @Inject(AUTH_SERVICE) private authService: IAuthService) { }

  async ionViewWillEnter() {
    // https://github.com/firebase/firebaseui-web/issues/559

    if (this.route.snapshot.queryParamMap.get('signOut')) {
      await this.authService.signOut();
    }

    // console.log(`this.firebaseUi.start('${await this.platform.ready()}')`);
    // await this.authService.firebaseUi.start('#firebaseui-auth-container', this.authService.getUiConfig(this.platform));
  }

  ionViewWillLeave() {
    console.log(`LoginPage.ionViewWillLeave()`);
  }
}
