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
    this.platform.ready().then(async (readySource) => {

      await this.initializeService.initializeServices(false, this.platform.is('hybrid'));

      this.initializing = await this.translateService.get('INITIALIZING').toPromise();
      this.pleaseWait = await this.translateService.get('PLEASE_WAIT').toPromise();
      this.creatingUser = await this.translateService.get('CREATING_USER').toPromise();

      this.dataService.authUser$.subscribe(
        (authUser) => {
          this.handleAuthChange(authUser)
        });

      if (this.platform.is('hybrid')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      } else {
        // fallback to browser APIs
      }

      // Redirect back to app after authenticating
      (window as any).handleOpenURL = (url: string) => {
        Auth0Cordova.onRedirectUri(url);
      }
    });
  }

  async handleAuthChange(authUser: firebase.User) {
    if (!_.isEmpty(authUser)) {
      await this.initializeService.initializeServices(true, this.platform.is('hybrid'));
    }

    if (!_.isEmpty(authUser) && !_.isEmpty(this.userService._user)) {
      console.log(`(authUser && _user) -> navigateRoot('/home/tab/home')`);
      this.navController.navigateRoot('/home/tab/home');
    } else if (!_.isEmpty(authUser)) {
      await this.busyService.present(this.initializing);
      const user = await this.userService.getUser(authUser.uid);
      await this.busyService.dismiss();
      if (user) {
        console.log(`getUser() -> navigateRoot('/home/tab/home')`);
        await this.navController.navigateRoot('/home/tab/home');
      } else {
        this.toastService.present(`Network Error`);
        // console.log(`!user -> navigateRoot('/core/login')`);
        // this.navController.navigateRoot('/core/login');
      }
    } 
    // else {
    //   console.log(`navigateRoot('/core/login')`);
    //   this.navController.navigateRoot('/core/login');
    // }
  }
}
