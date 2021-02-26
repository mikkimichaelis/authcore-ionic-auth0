import { Observable } from 'rxjs';

export declare interface IAngularFireFunctions {
    httpsCallable: <T = any, R = any>(name: string) => (data: T) => Observable<R>;
}