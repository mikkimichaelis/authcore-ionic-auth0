import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { ReplaySubject, Subject } from 'rxjs';
import { Meeting, User } from 'src/shared/models';
import { IDataService } from './data.service.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService implements IDataService {

  isNewUser: boolean;
  hybrid: boolean;

  authUser: any;
  authenticated$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  fireUser$: ReplaySubject<firebase.User> = new ReplaySubject<firebase.User>(1)
  user$: ReplaySubject<User> = new ReplaySubject<User>(1);

  homeMeeting$: ReplaySubject<Meeting> = new ReplaySubject<Meeting>(1);
  ownedMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);
  favoriteMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);
  liveMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);
  searchMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);

  logout$: Subject<boolean> = new Subject<boolean>();

  strings: any;

  constructor() { }

  initialize(hybrid: boolean) {
    this.strings = {};  // TODO persist these
    this.hybrid = hybrid;
  }
}
