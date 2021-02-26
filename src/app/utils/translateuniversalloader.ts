import { TranslateLoader } from '@ngx-translate/core';
import _ from 'lodash';
import { Observable, of } from 'rxjs';

import * as contentEnUS from '../../assets/i18n/en-US.json';
import * as contentEs from '../../assets/i18n/es.json';

const TRANSLATIONS = {
  'en-us': contentEnUS,
  'en': contentEnUS,
  'es': contentEs
};

export class TranslateUniversalLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(TRANSLATIONS[lang.toLocaleLowerCase()].default);
  }
}
