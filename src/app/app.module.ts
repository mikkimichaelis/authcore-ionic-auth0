

// import { SharedModule } from './shared.module';
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
import { AngularFireFunctions, AngularFireFunctionsModule } from '@angular/fire/functions'; // USE_EMULATOR as USE_FUNCTIONS_EMULATOR

// import { FirestoreService } from './services/firestore.service';

import { Zoom } from '@ionic-native/zoom/ngx';

// import { TranslateUniversalLoader } from './utils/translateuniversalloader';

import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useClass: TranslateUniversalLoader
    //   }
    // }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireFunctionsModule,
    AngularFirestoreModule,     // TODO AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AuthService,
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
    Zoom
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
