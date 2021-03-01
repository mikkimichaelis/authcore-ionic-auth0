import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { ReplaySubject, Subject } from 'rxjs';
import { Meeting, User } from 'src/shared/models';
import { IDataService } from './data.service.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService implements IDataService {

  newUser$: Subject<any> = new Subject<any>();
  fireUser$: ReplaySubject<firebase.User> = new ReplaySubject<firebase.User>(1)
  user$: ReplaySubject<User> = new ReplaySubject<User>(1);

  homeMeeting$: ReplaySubject<Meeting> = new ReplaySubject<Meeting>(1);
  ownedMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);
  favoriteMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);
  liveMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);
  searchMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);

  logout$: Subject<boolean> = new Subject<boolean>();

  constructor() { }
}
