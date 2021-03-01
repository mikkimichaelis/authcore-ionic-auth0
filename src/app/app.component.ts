declare var navigator: any;

import _ from 'lodash';
import LogRocket from 'logrocket';
import { SharedModule } from './shared.module';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/app';

import { Component, enableProdMode, Inject, Injector } from '@angular/core';
import { Platform, ToastController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Zoom } from '@ionic-native/zoom/ngx';

import { InitializeService, AUTH_SERVICE, IAuthService, IBusyService, IUserService, BUSY_SERVICE, USER_SERVICE, BusyService, ISettingsService, SETTINGS_SERVICE, TOAST_SERVICE, IToastService, IDataService, DATA_SERVICE } from './services';
import { User } from 'src/shared/models';

import Auth0Cordova from '@auth0/cordova';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  initializing = '';
  pleaseWait = '';
  creatingUser = '';

  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public initializeService: InitializeService,
    public translateService: TranslateService,
    public navController: NavController,
    @Inject(TOAST_SERVICE) public toastService: IToastService,
    @Inject(BUSY_SERVICE) public busyService: IBusyService,
    @Inject(AUTH_SERVICE) public authService: IAuthService,
    @Inject(USER_SERVICE) public userService: IUserService,
    @Inject(SETTINGS_SERVICE) public settingsService: ISettingsService,
    @Inject(DATA_SERVICE) public dataService: IDataService
  ) {
    console.log(`AppComponent()`);
    // TODO bug
    // if (environment.production) {
    //   enableProdMode();
    // }

    this.initializeApp();
  }

  async ngOnInit() { }

  async initializeApp() {
    // debugger;
    this.initializeService.initializeServices();

    this.platform.ready().then(async (readySource) => {
      await this.initializeService.initializePlatformServices(this.platform.is('hybrid'));

      if (this.platform.is('hybrid')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }

      this.dataService.authenticated$.subscribe(
        async (auth) => {
          if (auth) {
            await this.initializeService.initializeDataServices();
            if (!await this.authService.redirect()) {
              console.log(`appComponent.authenticated$(${auth}): ${window.location.pathname} -> /home/tab/home`);
              this.navController.navigateRoot('/home/tab/home');
            }
          }

          if (!auth && !window.location.pathname.includes('/core/login')) {
            console.log(`appComponent.authenticated$(${auth}): ${window.location.pathname} -> ${`/core/login?redirect=${window.location.pathname}`}`);
            this.navController.navigateRoot(`/core/login?redirect=${window.location.pathname}`);
          } 
        });

      (window as any).handleOpenURL = (url: string) => {
        Auth0Cordova.onRedirectUri(url);
      }
    });
  }
}
