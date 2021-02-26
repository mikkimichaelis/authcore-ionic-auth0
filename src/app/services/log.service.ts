import { Inject, Injectable } from '@angular/core';
import LogRocket from 'logrocket';

import { ILogService } from './log.service.interface';
import { ISettingsService } from './settings.service.interface';
import { SETTINGS_SERVICE } from './injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class LogService implements ILogService {

  constructor(@Inject(SETTINGS_SERVICE) private settingsService: ISettingsService) {
    
  }

  async initialize() {
      LogRocket.init("tdzfnj/anonymous-meetings", {});
      // TODO identify(uid: string, traits?: IUserTraits): void;
  }

  trace(msg: any, ...args: any[]) {
    LogRocket.log(msg, ...args);
  }
  message(msg: any, ...args: any[]) {
    LogRocket.log(msg, ...args);
  }
  error(error: any, ...args: any[]) {
    LogRocket.error(error, ...args);
  }
  exception(e: any, ...args: any[]) {
    LogRocket.error(e, ...args);
  }

  private stringify(x: any): string {
    if(typeof x === 'string') {
      return x;
    } else {
      return JSON.stringify(x);
    }
  }
}
