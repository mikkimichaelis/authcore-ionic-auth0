import { Inject, Injectable, InjectionToken } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import _ from 'lodash';

import { DateTime } from 'luxon';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IDataService, IUserService } from '.';

import { Group, IGroup, IMeeting, ISchedule, Meeting } from '../../shared/models';
import { ISearchSettings } from '../models';
import { IAngularFireFunctions } from './angular-fire-functions.interface';
import { FirestoreService } from './firestore.service';
import { ANGULAR_FIRE_FUNCTIONS, DATA_SERVICE, FIRESTORE_SERVICE, USER_SERVICE } from './injection-tokens';
import { IMeetingService } from './meeting.service.interface';

@Injectable({
  providedIn: 'root'
})
export class MeetingService implements IMeetingService {
  ownedMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);
  favoriteMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);
  liveMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);
  searchMeetings$: ReplaySubject<Meeting[]> = new ReplaySubject<Meeting[]>(1);

  meetingQuery: Subscription;

  constructor(
    private afs: AngularFirestore,
    @Inject(FIRESTORE_SERVICE) private fss: FirestoreService,
    @Inject(ANGULAR_FIRE_FUNCTIONS) private aff: IAngularFireFunctions,
    @Inject(DATA_SERVICE) private DataService: IDataService,
    @Inject(USER_SERVICE) private userService: IUserService,
  ) {

  }

  async resetAdminMeetings() { }

  ownedMeetingsUnsubscribe() {
    if (!_.isEmpty(this._ownedMeetingsSubscription) && !this._ownedMeetingsSubscription.closed) {
      this._ownedMeetingsSubscription.unsubscribe();
      this._ownedMeetingsSubscription = null;
    }
  }

  _ownedMeetingsSubscription: Subscription;
  ownedMeetingsSubscribe() {
    this.ownedMeetingsUnsubscribe();
    this._ownedMeetingsSubscription =
      this.fss.col$<IMeeting[]>(`meetings`, ref =>
        ref.where('active', '==', true)
          //.where('verified', '==', true)
          //.where('authorized', '==', true)
          .where('uid', '==', this.userService._user.id))
        .subscribe({
          next: async (imeetings: any) => {
            const rv = [];
            for (let i = 0; i < imeetings.length; i++) {
              rv.push(new Meeting(imeetings[i]));
            }

            this.ownedMeetings$.next(rv);
          },
          error: async (error) => {
            console.error(error);
          },
        });
  }

  favoriteMeetingsUnsubscribe() {
    if (!_.isEmpty(this._favoriteMeetingsSubscription)) {
      this._favoriteMeetingsSubscription.unsubscribe();
      this._favoriteMeetingsSubscription = null;
    }
  }

  _favoriteMeetingsSubscription: Subscription;
  favoriteMeetingsSubscribe() {
    this.favoriteMeetingsUnsubscribe();
    this._favoriteMeetingsSubscription =
      this.fss.col$<IMeeting[]>(`meetings`, ref => {
        let rv = ref
          .where('active', '==', true)
          .where('verified', '==', true)
          .where('authorized', '==', true);
        if (!_.isEmpty(this.userService._user.favMeetings)) {
          rv = ref.where('id', 'in', this.userService._user.favMeetings)
        } else {
          rv = ref.where('false', '==', 'true')
        }
        return rv;
      })
        .subscribe({
          next: async (imeetings: any) => {
            const rv = [];
            for (let i = 0; i < imeetings.length; i++) {
              rv.push(new Meeting(imeetings[i]));
            }

            this.favoriteMeetings$.next(rv);
          },
          error: async (error) => {
            console.error(error);
          },
        });
  }

  liveMeetingsUnsubscribe() {
    if (!_.isEmpty(this._liveMeetingsSubscription)) {
      this._liveMeetingsSubscription.unsubscribe();
      this._liveMeetingsSubscription = null;
    }

    if (!_.isEmpty(this._continuousMeetingsSubscription)) {
      this._continuousMeetingsSubscription.unsubscribe();
      this._continuousMeetingsSubscription = null;
    }
  }

  _liveMeetingsSubscription: Subscription;
  _continuousMeetingsSubscription: Subscription;
  liveMeetingsSubscribe() {
    this.liveMeetingsUnsubscribe();

    let live: any = null;
    let continuous: any = null;

    const w1 = DateTime.utc();
    const w2 = w1.plus({ hours: 1 });

    this._liveMeetingsSubscription =
      this.fss.col$<IMeeting[]>(`meetings`, ref => ref
        .where('active', '==', true)
        .where('verified', '==', true)
        .where('authorized', '==', true)
        .where('end', '>=', w1.toMillis())
        .where('end', '<=', w2.toMillis()))
        .subscribe({
          next: async (imeetings: any) => {
            const rv = [];
            for (let i = 0; i < imeetings.length; i++) {
              rv.push(new Meeting(imeetings[i]));
            }
            // TODO issue here if that after initial query of both, this updates with new live
            // meetings but continuous never updates to cause the union assignment
            if (!continuous) {
              live = rv;
            } else {
              const u = _.union(rv, continuous);
              this.liveMeetings$.next(u);
              continuous = null;
              live = null;
            }
          },
          error: async (error) => {
            console.error(error);
          },
        });

    this._continuousMeetingsSubscription =
      this.fss.col$<IMeeting[]>(`meetings`, ref => ref
        .where('active', '==', true)
        .where('verified', '==', true)
        .where('authorized', '==', true)
        .where('continuous', '==', true))
        .subscribe({
          next: async (imeetings: any) => {
            const rv = [];
            for (let i = 0; i < imeetings.length; i++) {
              rv.push(new Meeting(imeetings[i]));
            }
            if (!live) {
              // TODO issue here if that after initial query of both, this updates with new continuous
              // meetings but live never updates to cause the union assignment
              continuous = rv;
            } else {
              const u = _.union(rv, live);
              this.liveMeetings$.next(u);
              continuous = null;
              live = null;
            }
          },
          error: async (error) => {
            console.error(error);
          },
        });
  }

  async getMeetingAsync(id: string): Promise<Meeting> {
    return this.fss.doc$(`meetings/${id}`)
      .pipe(map((imeeting: IMeeting) => {
        return new Meeting(imeeting);
      })).toPromise<Meeting>();
  }

  async getMeetingsAsync(search: ISearchSettings): Promise<Meeting[]> {
    return this.fss.col$('meetings', ref => {
      let query = ref.where('active', '==', true).where('verified', '==', true).where('authorized', '==', true);
      if (search.bySpecificTime) {
        // console.log(`DateTime.fromISO(search.bySpecific.start): ${DateTime.fromISO(search.bySpecific.start)}`);
        let start = DateTime.fromObject({
          year: 1970,
          month: 1,
          day: 2,
          hour: DateTime.fromISO(search.bySpecific.start).hour,
          minute: DateTime.fromISO(search.bySpecific.start).minute,
          zone: DateTime.local().zone
        }).toUTC().toMillis();

        let end = DateTime.fromObject({
          year: 1970,
          month: 1,
          day: 2,
          hour: DateTime.fromISO(search.bySpecific.end).hour,
          minute: DateTime.fromISO(search.bySpecific.end).minute,
          zone: DateTime.local().zone.name
        }).toUTC().toMillis();

        query = query.where('start', '>=', start).where('start', '<=', end)
      }
      if (!search.byAnyDay) {
        const dow = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][(new Date()).getDay()]
        query = query.where('recurrence.weekly_days', 'array-contains', search.byDay == 'today' ? dow : search.byDay)
      }
      return query;
    }).pipe(map((imeetings: IMeeting[]) => {
      const meetings = [];
      for (let i = 0; i < imeetings.length; i++) {
        meetings.push(new Meeting(imeetings[i]));
      }
      this.DataService.searchMeetings$.next(meetings);
      return meetings;
    })).toPromise<Meeting[]>();

    // TODO
    // if (search.byRelativeTime) {
    //   let start = 0;
    //   let end = 0;
    //   rv = rv.where('start', '>=', start)
    //     .where('end', '<=', end)
    // }

    // if (!search.byAnyDay) {
    // const dayVerbose = search.byDay !== `${await this.transSvc.get('TODAY').toPromise()}` ? search.byDay
    //   : await this.transSvc.get(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][(new Date()).getDay()]).toPromise();

    // ${await this.transSvc.get('ON').toPromise()}
    //this.verbose = `${this.verbose} ${dayVerbose}`;

    // `${await this.transSvc.get('TODAY').toPromise()}`
    //   const day = search.byDay !== 'today' ? search.byDay
    //     : await this.transSvc.get(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][(new Date()).getDay()]).toPromise();

    //   query = query.pipe(
    //     map(groups => {

    //       const rv = [];
    //       groups.forEach(group => {
    //         const schedules = [];
    //         group.schedules.forEach(schedule => {
    //           if (schedule.day === day) {
    //             rv.push(group);
    //             schedules.push(schedule);
    //           }
    //           group.schedules = schedules;
    //         })
    //       });
    //       return rv;
    //     })
    //   );
    // } else {
    //   this.verbose = `${this.verbose} ${(await this.transSvc.get('ANYDAY').toPromise()).toLowerCase()}`;
    // }

    // if (search.byRelativeTime) {
    //   const within = `${await this.transSvc.get('WITHIN').toPromise()}`;
    //   query = query.pipe(
    //     map(groups => {
    //       const date = new Date();
    //       const time = date.toTimeString();
    //       const now = Date.parse('01/' + (date.getDay() + 1) + '/1970 ' + time.substring(0, time.indexOf(' ')) + ' UTC');
    //       const window = <number>search.byRelative.early * 60 * 1000;

    //       this.verbose = `${this.verbose} ${within} ${search.byRelative.early} hour(s)`;

    //       const rv = [];
    //       const schedules = [];
    //       groups.forEach(group => {
    //         group.schedules.forEach(schedule => {
    //           if (
    //             now <= (schedule.millis + <number>search.byRelative.late * 60 * 1000)
    //             && (now >= (schedule.millis - window))) {
    //             rv.push(group);
    //             schedules.push(schedule);
    //           }
    //           group.schedules = schedules;
    //         })
    //       });
    //       return rv;
    //     })
    //   )
    // } else if (search.bySpecificTime) {
    //   const between = `${await this.transSvc.get('BETWEEN').toPromise()}`;
    //   this.verbose = `${this.verbose} ${between} ${DateTime.fromISO(search.bySpecific.start).toLocaleString(DateTime.TIME_SIMPLE)} - ${DateTime.fromISO(search.bySpecific.end).toLocaleString(DateTime.TIME_SIMPLE)}`;

    //   let today = DateTime.utc();
    //   let start = DateTime.fromISO(search.bySpecific.start).toUTC();
    //   start = DateTime.fromObject({
    //     year: today.year,
    //     month: today.month,
    //     day: today.day,
    //     hour: start.hour,
    //     minute: start.minute
    //   })

    //   let end = DateTime.fromISO(search.bySpecific.end).toUTC();
    //   end = DateTime.fromObject({
    //     year: today.year,
    //     month: today.month,
    //     day: today.day,
    //     hour: end.hour,
    //     minute: end.minute
    //   })

    //   query = query.pipe(
    //     map(groups => {
    //       const rv = [];
    //       const schedules = [];
    //       groups.forEach(group => {
    //         group.schedules.forEach(schedule => {
    //           let time = DateTime.fromFormat(schedule.time, 't');
    //           if (time >= start && time <= end) {
    //             rv.push(group);
    //             schedules.push(schedule);
    //           }
    //           group.schedules = schedules;
    //         })
    //       });
    //       return rv;
    //     })
    //   )
    // } else {
    //   this.verbose = `${this.verbose} ${(await this.transSvc.get('ANYTIME').toPromise()).toLowerCase()}`;
    // }
  }

  async add(meeting: Meeting): Promise<boolean> {
    if (meeting) {
      try {
        await this.makeCallableAsync('addMeeting', meeting.toObject());
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  }

  async update(meeting: Meeting): Promise<boolean> {
    if (meeting) {
      try {
        console.log(meeting.toObject());
        await this.makeCallableAsync('updateMeeting', meeting.toObject());
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  }

  private async makeCallableAsync<T>(func: string, data?: any): Promise<T> {
    let callable: any = this.aff.httpsCallable(func);
    return new Promise<T>(async (resolve, reject) => {
      let rv = await callable(data).toPromise().then((result) => {
        resolve(result);
      }, (error) => {
        console.error(error);
        reject(error);
      })
    })
  }
}
