import { Platform } from '@ionic/angular';
import firebase from 'firebase/app';
import { ReplaySubject, Subject } from 'rxjs';

export interface IAuthServiceBase {
    // initialized$: ReplaySubject<boolean>;

    webAuth0: any;

    loading: boolean;
    isAuthenticated: boolean;

    fireUser: firebase.User;
    fireToken: any;
    
    authUser: any;
    authToken: any;
    expiresAt: number;

    deviceSignOutUrl: string;
    webSignOutUrl: string;

    getAuthUser(authToken: string): Promise<any>;
    getFirebaseToken(authToken: string): Promise<any>;
    setSession();
    getSession();

    handleLoginCallback(): Promise<any>;

    setAuthRedirect(url: string);

    initialize();

    redirect(url?: string): Promise<any>;
}
export interface IAuthService extends IAuthServiceBase {

    signIn(redirect?: string): Promise<any>;
    signOut(): Promise<any>;
}
    