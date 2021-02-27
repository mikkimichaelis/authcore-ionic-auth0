import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

import { CORDOVA_AUTH_CONFIG, WEB_AUTH_CONFIG} from '../../private/private.config';
import Auth0Cordova from '@auth0/cordova';
import * as auth0 from 'auth0-js';

import { of, Subscription, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

declare let cordova: any;
@Injectable()
export class AuthService {
  loading = true;

  user: any;
  userProfile: any;
  isAuthenticated: boolean;
  loggedInFirebase: boolean;
  
  options = {
    responseType: 'token',
    audience: 'https://meetingmakerapp.uc.r.appspot.com',
    scope: 'openid profile email offline_access'
  };

  private accessToken: string;
  private firebaseTokenSub: Subscription;
  private refreshFirebaseTokenSub: Subscription;

  private Auth0 = new auth0.WebAuth(CORDOVA_AUTH_CONFIG);  // TODO WEB_AUTH_CONFIG
  private Client = new Auth0Cordova(CORDOVA_AUTH_CONFIG);

  constructor(
    public zone: NgZone,
    private storage: Storage,
    private router: Router,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private safariViewController: SafariViewController
  ) {
    this.storage.get('profile').then(user => this.user = user);
    this.storage.get('access_token').then(token => this.accessToken = token);
    this.storage.get('expires_at').then(exp => {
      this.isAuthenticated = Date.now() < JSON.parse(exp);
      this.loading = false;
    });
  }

  signIn() {
    this.loading = true;
    // Authorize login request with Auth0: open login page and get auth results
    this.Client.authorize(this.options, (err, authResult) => {
      if (err) {
        this.zone.run(() => this.loading = false);
        // this.loading = false
        throw err;
      }
      // Set access token
      this.storage.set('access_token', authResult.accessToken);
      this.accessToken = authResult.accessToken;
      // Set access token expiration
      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      this.storage.set('expires_at', expiresAt);
      // Set logged in
      this.loading = false;
      this.isAuthenticated = true;

      // Fetch user's profile info
      this.getUserInfo(authResult);

      // this.Auth0.client.userInfo(this.accessToken, (err, profile) => {
      //   if (err) {
      //     throw err;
      //   }
      //   this.storage.set('profile', profile).then(val =>
      //     this.zone.run(() => this.user = profile)
      //   );
      // });
    });
  }

  signOut() {
    this.accessToken = null;
    this.user = null;
    this.isAuthenticated = false;
    this.safariViewController.isAvailable()
      .then((available: boolean) => {
        const auth0Domain = CORDOVA_AUTH_CONFIG.domain;
        const clientId = CORDOVA_AUTH_CONFIG.clientId;
        const pkgId = CORDOVA_AUTH_CONFIG.packageIdentifier;
        let url = `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${pkgId}://${auth0Domain}/cordova/${pkgId}/callback`;
        if (available) {
          this.safariViewController.show({
            url: url
          })
            .subscribe((result: any) => {
              if (result.event === 'opened') console.log('Opened');
              else if (result.event === 'closed') console.log('Closed');

              if (result.event === 'loaded') {
                console.log('Loaded');
                this.storage.remove('profile');
                this.storage.remove('access_token');
                this.storage.remove('expires_at');
                this.safariViewController.hide();
              }
            },
              (error: any) => console.error(error)
            );
        } else {
          // use fallback browser
          cordova.InAppBrowser.open(url, '_system');
        }
      }
      );
  }

  //////////////////////// Exchange Code ////////////////////////////
  getUserInfo(authResult) {
    // Use access token to retrieve user's profile and set session
    this.Auth0.client.userInfo(this.accessToken, (err, profile) => {
      
      if (profile) {
        this._setSession(authResult, profile);
        this.storage.set('profile', profile).then(val =>
          this.zone.run(() => this.user = profile)
        );
      }

      if (err) {
        console.warn(`Error retrieving profile: ${err.error}`);
      }
      // Redirect to desired route
      this.router.navigateByUrl(localStorage.getItem('auth_redirect'));
    });
  }

  private _setSession(authResult, profile) {
    // Set tokens and expiration in localStorage
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());
    localStorage.setItem('expires_at', expiresAt);
    this.userProfile = profile;
    // Session set; set isAuthenticated and loading
    this.isAuthenticated = true;
    this.loading = false;
    this.storage.set('profile', profile).then(val =>
      this.zone.run(() => this.user = profile)
    );
    // Get Firebase token
    this._getFirebaseToken();
  }

  private _getFirebaseToken() {
    // Prompt for login if no access token
    // if (!this.accessToken) {
    //   this.signIn();
    // }
    const getToken$ = () => {
      return this.http
        .get(`${WEB_AUTH_CONFIG.apiAuthTokenExchange}auth/firebase`, {
          headers: new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`)
        });
    };
    this.firebaseTokenSub = getToken$().subscribe(
      res => this._firebaseAuth(res),
      err => console.error(`An error occurred fetching Firebase token: ${err.message}`)
    );
  }

  private _firebaseAuth(tokenObj) {
    this.afAuth.auth.signInWithCustomToken(tokenObj.firebaseToken)
      .then(res => {

        if (res.additionalUserInfo.isNewUser) {
          //create user
        }

        // retrieve user

        // TODO validate res store?
        console.log(`token: ${tokenObj}`);
        console.log(`firebase res: ${JSON.stringify(res)}`);
        this.loggedInFirebase = true;
        // Schedule token renewal
        this.scheduleFirebaseRenewal();
        console.log('Successfully authenticated with Firebase!');
      })
      .catch(err => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.error(`${errorCode} Could not log into Firebase: ${errorMessage}`);
        this.loggedInFirebase = false;
      });
  }

  scheduleFirebaseRenewal() {
    // If user isn't authenticated, check for Firebase subscription
    // and unsubscribe, then return (don't schedule renewal)
    if (!this.loggedInFirebase) {
      if (this.firebaseTokenSub) {
        this.firebaseTokenSub.unsubscribe();
      }
      return;
    }
    // Unsubscribe from previous expiration observable
    this.unscheduleFirebaseRenewal();
    // Create and subscribe to expiration observable
    // Custom Firebase tokens minted by Firebase
    // expire after 3600 seconds (1 hour)
    const expiresAt = new Date().getTime() + (3600 * 1000);
    const expiresIn$ = of(expiresAt)
      .pipe(
        mergeMap(
          expires => {
            const now = Date.now();
            // Use timer to track delay until expiration
            // to run the refresh at the proper time
            return timer(Math.max(1, expires - now));
          }
        )
      );

    this.refreshFirebaseTokenSub = expiresIn$
      .subscribe(
        () => {
          console.log('Firebase token expired; fetching a new one');
          this._getFirebaseToken();
        }
      );
  }

  unscheduleFirebaseRenewal() {
    if (this.refreshFirebaseTokenSub) {
      this.refreshFirebaseTokenSub.unsubscribe();
    }
  }

  handleLoginCallback() {}
}
