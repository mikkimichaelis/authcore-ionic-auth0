import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import * as auth0 from 'auth0-js';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { WEB_CONFIG } from './auth.config';

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  private Auth0 = new auth0.WebAuth({
    clientID: WEB_CONFIG.auth.clientId,
    domain: WEB_CONFIG.auth.clientDomain,
    responseType: 'token',
    redirectUri: WEB_CONFIG.auth.redirect,
    audience: WEB_CONFIG.auth.audience,
    scope: WEB_CONFIG.auth.scope
  });
  accessToken: string;
  user: any;
  userProfile: any;
  // Track authentication status
  loggedIn: boolean;
  loading: boolean;
  // Track Firebase authentication status
  loggedInFirebase: boolean;
  // Subscribe to the Firebase token stream
  firebaseSub: Subscription;
  // Subscribe to Firebase renewal timer stream
  refreshFirebaseSub: Subscription;

  constructor(
    public zone: NgZone,
    private storage: Storage,
    private router: Router,
    private afAuth: AngularFireAuth,
    private http: HttpClient
  ) {}

  login(redirect?: string) {
    // Set redirect after login
    const _redirect = redirect ? redirect : this.router.url;
    this.storage.set('auth_redirect', _redirect);
    // Auth0 authorize request
    this.Auth0.authorize();
  }

  logout() {
    // Ensure all auth items removed
    this.storage.remove('expires_at');
    this.storage.remove('auth_redirect');
    window.location.href = `https://${WEB_CONFIG.auth.clientDomain}/v2/logout?client_id=${WEB_CONFIG.auth.clientId}&returnTo=${encodeURIComponent(WEB_CONFIG.auth.redirect)}`;
    this.accessToken = undefined;
    this.userProfile = undefined;
    this.loggedIn = false;
    // Sign out of Firebase
    this.loggedInFirebase = false;
    this.afAuth.auth.signOut();
    // Return to homepage
    this.router.navigate(['/']);
  }

  handleLoginCallback() {
    this.loading = true;
    // When Auth0 hash parsed, get profile
    this.Auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        // Store access token
        this.accessToken = authResult.accessToken;
        // Get user info: set up session, get Firebase token
        this.getUserInfo(authResult);
      } else {
        if (err) {
          console.error(`Error authenticating: ${err.error}`);
        }
        this.router.navigate(['/']);
        this.loading = false;
      }
    });
  }

  getUserInfo(authResult) {
    // Use access token to retrieve user's profile and set session
    this.Auth0.client.userInfo(this.accessToken, async (err, profile) => {
      if (err) {
        throw err;
      }
      if (profile) {
        
        this.storage.set('profile', profile).then(val =>
          this.zone.run(() => this.user = profile)
        );

        this._setSession(authResult, profile);
      }

      // Redirect to desired route
      this.router.navigateByUrl(await this.storage.get('auth_redirect'));
    });
  }

  private async _setSession(authResult, profile) {
    // Set tokens and expiration in this.storage
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());
    this.storage.set('expires_at', expiresAt);
    this.userProfile = profile;
    // Session set; set loggedIn and loading
    this.loggedIn = true;
    this.loading = false;
    // Get Firebase token
    this._getFirebaseToken();
    // Redirect to desired route
    this.router.navigateByUrl(await this.storage.get('auth_redirect'));
  }

  private _getFirebaseToken() {
    // Prompt for login if no access token
    if (!this.accessToken) {
      this.login();
    }
    const getToken$ = () => {
      return this.http
        .get(`${WEB_CONFIG.apiAuthTokenExchange}auth/firebase`, {
          headers: new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`)
        });
    };
    this.firebaseSub = getToken$().subscribe(
      res => this._firebaseAuth(res),
      err => console.error(`An error occurred fetching Firebase token: ${err.message}`)
    );
  }

  private _firebaseAuth(tokenObj) {
    this.afAuth.auth.signInWithCustomToken(tokenObj.firebaseToken)
      .then(res => {
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
      if (this.firebaseSub) {
        this.firebaseSub.unsubscribe();
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

    this.refreshFirebaseSub = expiresIn$
      .subscribe(
        () => {
          console.log('Firebase token expired; fetching a new one');
          this._getFirebaseToken();
        }
      );
  }

  unscheduleFirebaseRenewal() {
    if (this.refreshFirebaseSub) {
      this.refreshFirebaseSub.unsubscribe();
    }
  }
}
