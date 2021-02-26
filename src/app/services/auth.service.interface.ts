import { Platform } from '@ionic/angular';
import firebase from 'firebase/app';
import { ReplaySubject, Subject } from 'rxjs';

export interface IAuthService {
    firebaseUi: any; // firebaseui.auth.AuthUI;

    auth: firebase.auth.Auth;
    authUser: firebase.User;
    
    isAuthenticated: boolean;

    signOut(): Promise<any>;
    getUiConfig(platform: Platform): any;
}
    