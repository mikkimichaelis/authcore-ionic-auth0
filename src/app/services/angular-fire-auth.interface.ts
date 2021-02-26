import firebase from 'firebase/app';
import { Observable } from 'rxjs';

export interface IAngularFireAuth {
    authState: Observable<firebase.User>;

    signInAnonymously();
    signOut();
}