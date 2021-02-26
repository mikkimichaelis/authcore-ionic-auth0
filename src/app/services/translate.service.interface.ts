import { EventEmitter } from '@angular/core';
import { DefaultLangChangeEvent, LangChangeEvent, MissingTranslationHandler, TranslateCompiler, TranslateLoader, TranslateParser, TranslateStore, TranslationChangeEvent } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export interface ITranslateService {
    store: TranslateStore;
    currentLoader: TranslateLoader;
    compiler: TranslateCompiler;
    parser: TranslateParser;
    missingTranslationHandler: MissingTranslationHandler;

    onTranslationChange(): EventEmitter<TranslationChangeEvent>;

    onLangChange(): EventEmitter<LangChangeEvent>;

    onDefaultLangChange(): EventEmitter<DefaultLangChangeEvent>;

    defaultLang: string;

    currentLang: string;

    langs: string[];

    translations: any;

    setDefaultLang(lang: string): void;

    getDefaultLang(): string;

    use(lang: string): Observable<any>;

    getTranslation(lang: string): Observable<any>;

    setTranslation(lang: string, translations: Object, shouldMerge?: boolean): void;

    getLangs(): Array<string>;

    addLangs(langs: Array<string>): void;

    getParsedResult(translations: any, key: any, interpolateParams?: Object): any;

    get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any>;

    getStreamOnTranslationChange(key: string | Array<string>, interpolateParams?: Object): Observable<string | any>;

    stream(key: string | Array<string>, interpolateParams?: Object): Observable<string | any>;

    instant(key: string | Array<string>, interpolateParams?: Object): string | any;

    set(key: string, value: string, lang?: string): void;

    reloadLang(lang: string): Observable<any>;

    resetLang(lang: string): void;

    getBrowserLang(): string;

    getBrowserCultureLang(): string;
}