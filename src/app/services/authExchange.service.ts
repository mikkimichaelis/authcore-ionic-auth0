// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { environment } from '../../environments/environment';
// import * as auth0 from 'auth0-js';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Subscription, of, timer } from 'rxjs';
// import { mergeMap } from 'rxjs/operators';

// @Injectable()
// export class AuthExchangeService {
//   accessToken: string;
//   userProfile: any;
//   loggedIn: boolean;
//   firebaseTokenSub: Subscription;
//   refreshFirebaseTokenSub: Subscription;

//   constructor(
//     private router: Router,
//     private afAuth: AngularFireAuth,
//     private http: HttpClient
//   ) {}

//   getUserInfo(authResult) {
//     // Use access token to retrieve user's profile and set session
//     this._auth0.client.userInfo(this.accessToken, (err, profile) => {
//       if (profile) {
//         this._setSession(authResult, profile);
//       } else if (err) {
//         console.warn(`Error retrieving profile: ${err.error}`);
//       }

//       // Redirect to desired route
//       this.router.navigateByUrl(localStorage.getItem('auth_redirect'));
//     });
//   }

//   private _setSession(authResult, profile) {
//     // Set tokens and expiration in localStorage
//     const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());
//     localStorage.setItem('expires_at', expiresAt);
//     this.userProfile = profile;
//     // Session set; set loggedIn and loading
//     this.loggedIn = true;
//     this.loading = false;
//     // Get Firebase token
//     this._getFirebaseToken();
//   }

//   private _getFirebaseToken() {
//     // Prompt for login if no access token
//     // if (!this.accessToken) {
//     //   this.login();
//     // }
//     const getToken$ = () => {
//       return this.http
//         .get(`${environment.apiAuthTokenExchange}auth/firebase`, {
//           headers: new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`)
//         });
//     };
//     this.firebaseTokenSub = getToken$().subscribe(
//       res => this._firebaseAuth(res),
//       err => console.error(`An error occurred fetching Firebase token: ${err.message}`)
//     );
//   }

//   private _firebaseAuth(tokenObj) {
//     this.afAuth.auth.signInWithCustomToken(tokenObj.firebaseToken)
//       .then(res => {
//         this.loggedInFirebase = true;
//         // Schedule token renewal
//         this.scheduleFirebaseRenewal();
//         console.log('Successfully authenticated with Firebase!');
//       })
//       .catch(err => {
//         const errorCode = err.code;
//         const errorMessage = err.message;
//         console.error(`${errorCode} Could not log into Firebase: ${errorMessage}`);
//         this.loggedInFirebase = false;
//       });
//   }

//   scheduleFirebaseRenewal() {
//     // If user isn't authenticated, check for Firebase subscription
//     // and unsubscribe, then return (don't schedule renewal)
//     if (!this.loggedInFirebase) {
//       if (this.firebaseTokenSub) {
//         this.firebaseTokenSub.unsubscribe();
//       }
//       return;
//     }
//     // Unsubscribe from previous expiration observable
//     this.unscheduleFirebaseRenewal();
//     // Create and subscribe to expiration observable
//     // Custom Firebase tokens minted by Firebase
//     // expire after 3600 seconds (1 hour)
//     const expiresAt = new Date().getTime() + (3600 * 1000);
//     const expiresIn$ = of(expiresAt)
//       .pipe(
//         mergeMap(
//           expires => {
//             const now = Date.now();
//             // Use timer to track delay until expiration
//             // to run the refresh at the proper time
//             return timer(Math.max(1, expires - now));
//           }
//         )
//       );

//     this.refreshFirebaseTokenSub = expiresIn$
//       .subscribe(
//         () => {
//           console.log('Firebase token expired; fetching a new one');
//           this._getFirebaseToken();
//         }
//       );
//   }

//   unscheduleFirebaseRenewal() {
//     if (this.refreshFirebaseTokenSub) {
//       this.refreshFirebaseTokenSub.unsubscribe();
//     }
//   }
// }
