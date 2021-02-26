import { ReplaySubject, Subject } from "rxjs";
import firebase from 'firebase/app';
import { Meeting, User } from "src/shared/models";

export interface IDataService {
    authUser$: ReplaySubject<firebase.User>;
    logout$: Subject<boolean>;
    
    user$: ReplaySubject<User>;

    homeMeeting$: ReplaySubject<Meeting>;
    ownedMeetings$: ReplaySubject<Meeting[]>;
    favoriteMeetings$: ReplaySubject<Meeting[]>;
    liveMeetings$: ReplaySubject<Meeting[]>;
    searchMeetings$: ReplaySubject<Meeting[]>;
}
