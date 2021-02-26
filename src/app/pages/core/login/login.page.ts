import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import firebase from 'firebase/app'
import { from, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import * as firebaseui from 'firebaseui';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private platform: Platform, private route: ActivatedRoute, private authService: AuthService) { }

  async ionViewWillEnter() {
    // https://github.com/firebase/firebaseui-web/issues/559

    if (this.route.snapshot.queryParamMap.get('signOut')) {
      await this.authService.signOut();
    }

    console.log(`this.firebaseUi.start('${await this.platform.ready()}')`);
    await this.authService.firebaseUi.start('#firebaseui-auth-container', this.authService.getUiConfig(this.platform));
  }

  ionViewWillLeave() {
    console.log(`LoginPage.ionViewWillLeave()`);
  }
}
