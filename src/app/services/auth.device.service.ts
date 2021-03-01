import { Inject, Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

import { CORDOVA_AUTH_CONFIG } from '../../private/private.config';
import Auth0Cordova from '@auth0/cordova';


import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthServiceBase } from './auth.service.base';
import { DATA_SERVICE, IAuthService, IDataService, IUserService, USER_SERVICE } from '.';

declare let cordova: any;
@Injectable()
export class AuthService extends AuthServiceBase implements IAuthService {
  private auth0 = new Auth0Cordova(CORDOVA_AUTH_CONFIG);

  constructor(
    public zone: NgZone,
    private storage: Storage,
    private router: Router,
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private safariViewController: SafariViewController,
    @Inject(USER_SERVICE) public userService: IUserService,
    @Inject(DATA_SERVICE) public dataService: IDataService
  ) {
    super(
      zone,
      storage,
      router,
      http,
      afAuth,
      userService,
      dataService);
  }

  async signIn(redirect: string): Promise<any> {
    this.loading = true;
    await this.setAuthRedirect(redirect);
    return new Promise((resolve, reject) => {
      this.auth0.authorize(this.options, async (error, authResult) => {
        if (!error && authResult) {
          await this.processAuthResult(authResult);
          this.redirect();
          resolve(true);
        } else {
          this.zone.run(() => this.loading = false);
          reject(error);
        }
      });
    });
  }

  async signOut(): Promise<any> {
    super.signOut();
    this.safariViewController.isAvailable()
      .then((available: boolean) => {
        if (available) {
          this.safariViewController.show({
            url: this.deviceSignOutUrl
          })
            .subscribe((result: any) => {
              // if (result.event === 'opened') console.log('Opened');
              // else if (result.event === 'closed') console.log('Closed');

              if (result.event === 'loaded') {
                // console.log('Loaded');

                this.safariViewController.hide();
              }
            },
              (error: any) => console.error(error)
            );
        } else {
          cordova.InAppBrowser.open(this.deviceSignOutUrl, '_system');
        }
      }
      );
  }
}
