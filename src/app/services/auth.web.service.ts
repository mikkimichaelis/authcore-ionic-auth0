import { Inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Storage } from '@ionic/storage';

import { AngularFireAuth } from '@angular/fire/auth';
import * as Auth0 from 'auth0-js';

import { AuthServiceBase } from './auth.service.base';
import { IAuthService } from './auth.service.interface';
import { DATA_SERVICE, USER_SERVICE } from './injection-tokens';
import { IDataService } from './data.service.interface';

import _ from 'lodash';
import { IUserService } from './user.service.interface';
@Injectable()
export class AuthService extends AuthServiceBase implements IAuthService {
  // Create Auth0 web auth instance

  constructor(
    public zone: NgZone,
    private storage: Storage,
    private router: Router,
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    @Inject(DATA_SERVICE) public dataService: IDataService
  ) {
    super(
      zone,
      storage,
      router,
      http,
      afAuth,
      dataService);
  }

  async signIn(redirect?: string): Promise<any> {
    this.loading = true;
    await this.setAuthRedirect(redirect);
    this.webAuth0.authorize(this.options);
    return Promise.resolve(true);
  }

  async handleLoginCallback(): Promise<any> {
    this.loading = true;
    return new Promise(async (resolve, reject) => {
      try {
        this.webAuth0.parseHash(async (error, authResult) => {
          // debugger;
          if (authResult && authResult.accessToken) {
            await this.processAuthToken(authResult.accessToken);
            console.log(`handleLoginCallback(): authenticated: ${!_.isEmpty(this.authToken)} firebase: ${!_.isEmpty(this.fireToken)}`)
            this.redirect();
            resolve(true);
          } else {
            if (error) {
              console.error(`handleLoginCallback(): Error authenticating: ${error.message}`);
            }
            this.zone.run(() => this.loading = false);
            resolve(false);
          }
        });
      } catch (error) {
        console.error(`Error handleLoginCallback: ${error.message}`);
        reject(error);
      }
    });
  }

  async signOut(): Promise<any> {
    await super.signOut();
    window.location.href = this.webSignOutUrl;
  }
}
