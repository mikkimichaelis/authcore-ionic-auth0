import { Platform } from '@ionic/angular';
import firebase from 'firebase/app';
import { ReplaySubject, Subject } from 'rxjs';

export interface IAuthService {

    loading: boolean;

    user: any;
    userProfile: any;
    loggedInFirebase: boolean;

    isAuthenticated: boolean;

    signIn(): Promise<any>;
    signOut(): Promise<any>;

    handleLoginCallback();

    ////////////////////////////////

    auth: firebase.auth.Auth;
    authUser: firebase.User;
}
    