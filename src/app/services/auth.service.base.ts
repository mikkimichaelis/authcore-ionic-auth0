import _ from 'lodash';

import { of, ReplaySubject, Subscription, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Storage } from '@ionic/storage';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import * as Auth0 from 'auth0-js';

import { IAuthServiceBase, IDataService } from '.';
import { DATA_SERVICE } from './injection-tokens';

import { CORDOVA_AUTH_CONFIG, WEB_AUTH_CONFIG } from '../../private/private.config';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceBase implements IAuthServiceBase {
  public webAuth0 = new Auth0.WebAuth(WEB_AUTH_CONFIG.auth)

  loading: boolean;
  expiresAt: number = 0;

  options = {
    responseType: WEB_AUTH_CONFIG.auth.responseType,
    audience: WEB_AUTH_CONFIG.auth.audience,
    scope: WEB_AUTH_CONFIG.auth.scope
  }; 

  public deviceSignOutUrl = `https://${CORDOVA_AUTH_CONFIG.domain}/v2/logout?client_id=${CORDOVA_AUTH_CONFIG.clientID}&returnTo=${CORDOVA_AUTH_CONFIG.packageIdentifier}://${CORDOVA_AUTH_CONFIG.domain}/cordova/${CORDOVA_AUTH_CONFIG.packageIdentifier}/callback`;
  public webSignOutUrl = `https://${WEB_AUTH_CONFIG.auth.domain}/v2/logout?client_id=${WEB_AUTH_CONFIG.auth.clientID}&returnTo=${encodeURIComponent(WEB_AUTH_CONFIG.auth.redirectUri)}`;

  get isAuthenticated(): boolean {
    return this.fireUser !== null; // && (Date.now() < this.expiresAt);
  }

  _authToken: any = null;
  get authToken(): string {
    return this._authToken;
  }
  set authToken(authToken) {
    this._authToken = authToken;
    this._storage.set('authToken', authToken)
  }

  _authUser: any = null;
  get authUser(): string {
    return this._authUser;
  }
  set authUser(authUser) {
    this._authUser = authUser;
    this._dataService.authUser = this._authUser;
    this._storage.set('authUser', authUser)
  }

  _fireToken: string = null;
  get fireToken(): string {
    return this._fireToken;
  }
  set fireToken(fireToken) {
    this._fireToken = fireToken;
  }

  _fireUser: firebase.User = null;
  get fireUser(): firebase.User {
    return this._fireUser;
  }
  set fireUser(fireUser) {
    if (this._fireUser !== fireUser) {
      this._fireUser = fireUser
      this._dataService.fireUser$.next(fireUser);
      this._dataService.authenticated$.next(fireUser != null);
    }
  }
  
  private afAuthStateSub: Subscription;
  private fireTokenSub: Subscription;
  private refreshFireTokenSub: Subscription;

  constructor(
    public _zone: NgZone,
    private _storage: Storage,
    private _router: Router,
    private _http: HttpClient,
    private _afAuth: AngularFireAuth,
    @Inject(DATA_SERVICE) public _dataService: IDataService) {

    // debugger;
    this.loading = false;

    _afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch(function (error) {
        console.error(error);
      });

    this.fireAuthStateSubscribe();
  }

  public async initialize() {
    await this.getSession();
  }

  public async processAuthToken(accessToken) {
    this.authToken = accessToken;
    try {
      await this.getAuthUser(this.authToken);
      await this.getFirebaseToken(this.authToken);
      this.setSession();
    } catch (error) {
    }
  }

  getAuthUser(authToken: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // this seems to clear this.authToken.  weird.
      this.webAuth0.client.userInfo(authToken, (error, authUser) => {
        if (error) {
          console.warn(`Error retrieving Auth0 profile: ${error.message}`);
          reject(error);
        } else if (authUser) {
          this.authUser = authUser;
          resolve(authUser);
        }
      });
    });
  }

  public getFirebaseToken(authToken: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const getToken$ = () => {
        return this._http
          .get(`${WEB_AUTH_CONFIG.apiAuthTokenExchange}auth/firebase`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${authToken}`)
          });
      };
      this.fireTokenSub = getToken$().subscribe(
        async (result: any) => {
          this.fireToken = result.firebaseToken;
          await this.firebaseSignIn(this.fireToken);
          resolve(true);
        },
        error => {
          console.error(`An error occurred fetching Firebase token: ${error.message}`);
          reject(error);
        }
      );
    });
  }

  private async firebaseSignIn(fireToken: string): Promise<any> {
    console.log(fireToken);
    return new Promise<any>((resolve, reject) => {
      this._afAuth.auth.signInWithCustomToken(fireToken)
        .then(async response => {
          this._dataService.isNewUser = response.additionalUserInfo.isNewUser;
          this.fireUser = response.user;
          this.scheduleCustomTokenRenewal();
          resolve(true);
        })
        .catch(error => {
          console.error(`${error.code} Could not log into Firebase: ${error.message}`);
          reject(error);
        });
    });
  }

  async signOut(): Promise<any> {
    this._storage.remove('authRedirect');

    this.authUser = null;
    this.authToken = null;
    this.fireUser = null;
    this.fireToken = null;
    await this.setSession();

    this._dataService.logout$.next(true);
    await this._afAuth.auth.signOut();
  }

  public async setSession() {
    const session = [];
    session.push(this._storage.set('authUser', this.authUser))
    session.push(this._storage.set('authToken', this.authToken))
    await Promise.all(session);
  }

  public async getSession() {
    // debugger;
    const session = [];
    session.push(this._storage.get('authUser').then(authUser => this.authUser = authUser));
    session.push(this._storage.get('authToken').then(authToken => this.authToken = authToken));
    await Promise.all(session);
    // console.log(`session loaded authToken: ${this.authToken !== null} authUser: ${this.authUser !== null } fireToken: ${this.fireToken !== null} fireUser:${this.fireUser !== null}`)
  }

  async setAuthRedirect(redirect: string) {
    redirect = redirect ? redirect : window.location.pathname;
    if (redirect.includes('core/login') || redirect.includes('callback')) return;
    console.log(`[authRedirect]: ${redirect}`);
    await this._storage.set('authRedirect', redirect);
  }

  public async redirect(url?: string): Promise<any> {
    this._zone.run(() => this.loading = false);
    if (url) {
      console.log(`authService.redirect(): ${window.location.pathname} -> url: ${url}`);
      this._router.navigateByUrl(url);
      return Promise.resolve(true);
    } else {
      return new Promise((resolve, reject) => {
        this._storage.get('authRedirect').then(redirect => {
          if (!redirect) {
            redirect = '/home/tab/home';
          } 
          console.log(`authService.redirect(): ${window.location.pathname} -> redirect: ${redirect}`);
          this._router.navigateByUrl(redirect);
          resolve(true);
        }, error => {
          const redirect = '/home/tab/home';
          console.error(`authService.redirect(): ${window.location.pathname} -> redirect: ${redirect}`);
          this._router.navigateByUrl(redirect);
          reject(true);
        })
      });
    }
  }

  ////////////////////////////////////
  // Token Subscription & Renewal 
  ////////////////////////////////////

  scheduleCustomTokenRenewal() {
    if (!this.isAuthenticated) {
      if (this.fireTokenSub) {
        this.fireTokenSub.unsubscribe();
      }
      return;
    }

    this.unscheduleCustomTokenRenewal();

    // Custom Firebase tokens minted by Firebase expire after 1 hour
    const expiresAt = new Date().getTime() + (3600 * 1000);
    const expiresIn$ = of(expiresAt)
      .pipe(
        mergeMap(
          expires => {
            const now = Date.now();
            return timer(Math.max(1, expires - now));
          }
        )
      );

    this.refreshFireTokenSub = expiresIn$
      .subscribe(
        () => {
          console.log('scheduleCustomTokenRenewal; fetching a new one');
          this.getFirebaseToken(this.authToken);
        }
      );

      console.log(`scheduleCustomTokenRenewal: ${(new Date(expiresAt)).toLocaleString()}`);
  }

  unscheduleCustomTokenRenewal() {
    if (this.refreshFireTokenSub && !this.refreshFireTokenSub.closed) {
      this.refreshFireTokenSub.unsubscribe();
      this.refreshFireTokenSub = null;
    }
  }

  fireAuthStateSubscribe() {
    this.fireAuthStateUnsubscribe();

    this.afAuthStateSub = this._afAuth.authState.subscribe(
      (user: firebase.User) => {
        console.log(`fireAuthStateSubscribe.firebaseAuth.authState(${user !== null})`);
        this.fireUser = user;
      },
      (error: any) => {
        console.error(error);
      });
  }

  fireAuthStateUnsubscribe() {
    if (this.afAuthStateSub && !this.afAuthStateSub.closed) {
      this.afAuthStateSub.unsubscribe();
      this.afAuthStateSub = null;
    }
  }

  handleLoginCallback(): Promise<any> {
    return Promise.resolve(true)
   }
}