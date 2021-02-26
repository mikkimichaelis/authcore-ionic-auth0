declare var navigator: any;

import { environment } from 'src/environments/environment';

import { Inject, Injectable } from '@angular/core';
import { Zoom } from '@ionic-native/zoom/ngx';
import { TranslateService } from '@ngx-translate/core';

import { IInitializeService, IAuthService, IBusyService, IGroupsService, ISettingsService, IUserService, IGroupService, IMeetingService } from './';
import { GROUP_SERVICE, USER_SERVICE, GROUPS_SERVICE, BUSY_SERVICE, AUTH_SERVICE, SETTINGS_SERVICE, MEETING_SERVICE } from './injection-tokens'

import LogRocket from 'logrocket';

@Injectable({
  providedIn: 'root'
})
export class InitializeService implements IInitializeService {

  initialized = false;
  auth_initialized = false;

  // TODO
  SDK_KEY = 'd1BznmF4HfrvRZmabIyCcp2a6bpcZYbqmCXB';
  SDK_SECRET = 'U0j5w2XB4CURvIhIpwf6cJnjRknjCZdG4Sva';

  logRocket_appId = "tdzfnj/anonymous-meetings";

  constructor(
    private translate: TranslateService,
    public zoomService: Zoom,
    @Inject(SETTINGS_SERVICE) private settingsService: ISettingsService,
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    @Inject(BUSY_SERVICE) private busyService: IBusyService,
    @Inject(GROUP_SERVICE) private groupsService: IGroupsService,
    @Inject(GROUPS_SERVICE) private groupService: IGroupService,
    @Inject(USER_SERVICE) private userService: IUserService,
    @Inject(MEETING_SERVICE) private meetingService: IMeetingService
  ) { }

  async initializeServices(auth: boolean, hybrid?: boolean) {
    console.log(`initializeServices(auth: ${auth}, hybrid: ${hybrid}): initialized: ${this.initialized}, auth_initialized: ${this.auth_initialized}`);
    if (auth && !this.auth_initialized) {
      // settings require auth to be retrieved from firestore
      await this.settingsService.initialize(true);

      if (environment.production) {
        LogRocket.init(this.logRocket_appId,
          {
            release: '[TODO insert build info here]',
            console: {
              isEnabled: true,
              shouldAggregateConsoleErrors: true
            }
          });
      }

      if (hybrid) {
        console.log('zoomService.initialize()');
        this.zoomService.initialize(this.SDK_KEY, this.SDK_SECRET)
          .then((success) => {
            console.log(success);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.auth_initialized = true;
    }
    else if (!this.initialized) {
      this.settingsService.initialize(auth);
      await this.busyService.initialize();

      this.translate.setDefaultLang('en-US');
      this.translate.use(navigator.language);

      // await this.groupsService.initialize();
      // await this.groupService.initialize();

      this.initialized = true;
    }
  }
}
