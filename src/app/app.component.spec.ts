import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_SERVICE, BUSY_SERVICE, InitializeService, SettingsService, USER_SERVICE } from './services';
import { Router } from '@angular/router';

describe('AppComponent', () => {

  let statusBarSpy;
  let splashScreenSpy;
  let platformReadySpy;
  let platformSpy;
  let swUpdateSpy;
  let menuControllerSpy;
  let toastControllerSpy;
  let translateServiceSpy;
  let initializeServiceSpy;
  let settingsSpy;
  let routerSpy;
  let busyServiceSpy;
  let authServiceSpy;
  let userServiceSpy;

  beforeEach(waitForAsync(() => {
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', {ready: platformReadySpy, is: true} );
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    swUpdateSpy = jasmine.createSpy('SwUpdate');
    toastControllerSpy = jasmine.createSpy('ToastController');
    initializeServiceSpy = jasmine.createSpyObj('InitializeService', ['initializeServices'])
    settingsSpy = jasmine.createSpyObj('SettingsService', ['initialize']);
    routerSpy = jasmine.createSpy('Router')
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'get']);
    busyServiceSpy = jasmine.createSpy('BUSY_SERVICE');
    authServiceSpy = jasmine.createSpy('AUTH_SERVICE');
    userServiceSpy = jasmine.createSpy('USER_SERVICE');

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        
        { provide: Platform, useValue: platformSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SwUpdate, useValue: swUpdateSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: InitializeService, useValue: initializeServiceSpy },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: BUSY_SERVICE, useValue: busyServiceSpy},
        { provide: AUTH_SERVICE, useValue: authServiceSpy},
        { provide: USER_SERVICE, useValue: userServiceSpy}
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: add more tests!

});
