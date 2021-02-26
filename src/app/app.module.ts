// switch to correct branch!
// move this into new core
// find and fix errors top down


import { SharedModule } from './shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctions, AngularFireFunctionsModule, USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/functions';

import { FirestoreService } from './services/firestore.service';

import { Zoom } from '@ionic-native/zoom/ngx';

import { TranslateUniversalLoader } from './utils/translateuniversalloader';
import { GroupService, GroupsService, UserService, AuthService, BusyService, SettingsService, SharedDataService, ZoomService,
  GROUP_SERVICE, SETTINGS_SERVICE, BUSY_SERVICE, USER_SERVICE, GROUPS_SERVICE, 
  AUTH_SERVICE, TRANSLATE_SERVICE, FIRESTORE_SERVICE, 
  ANGULAR_FIRE_FUNCTIONS, TOAST_SERVICE, ToastService, MEETING_SERVICE, MeetingService, DataService, DATA_SERVICE } from './services';

import { AuthGuard, FeatureGuard } from './guards';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CallbackComponent } from './callback.component';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateUniversalLoader
      }
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireFunctionsModule,
    AngularFirestoreModule,     // TODO AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    HttpClientModule
    ],
  providers: [
    SafariViewController,    
    InAppBrowser,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    EmailComposer,
    SocialSharing,
    AngularFirestore,
    TranslateService,
    AngularFireAuth,
    HttpClient,
    AuthGuard,
    FeatureGuard,
    Zoom,
    CallbackComponent,
    { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.firebaseConfig.useEmulators ? ['localhost', 5001] : undefined },
    { provide: FIRESTORE_SERVICE, useExisting: FirestoreService},
    { provide: ANGULAR_FIRE_FUNCTIONS, useExisting: AngularFireFunctions },
    { provide: DATA_SERVICE, useExisting: DataService},
    { provide: TRANSLATE_SERVICE, useExisting: TranslateService},
    { provide: AUTH_SERVICE, useExisting: AuthService },
    { provide: MEETING_SERVICE, useExisting: MeetingService },
    { provide: GROUPS_SERVICE, useExisting: GroupsService },
    { provide: GROUP_SERVICE, useExisting: GroupService },
    { provide: USER_SERVICE, useExisting: UserService },
    { provide: BUSY_SERVICE, useExisting: BusyService },
    { provide: TOAST_SERVICE, useExisting: ToastService },
    { provide: SETTINGS_SERVICE, useExisting: SettingsService },
    ZoomService,
    SharedDataService,

    // { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.firebaseConfig.useEmulators ? ['localhost', 5001] : undefined },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
