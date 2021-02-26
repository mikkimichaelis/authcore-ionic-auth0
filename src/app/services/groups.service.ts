import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGroup } from 'src/shared/models';
import { ISearchSettings } from '../models';
import { IGroupsService } from './groups.service.interface';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { TranslateService } from '@ngx-translate/core';
// import firebase from 'firebase/app';
// import * as geofirex from 'geofirex';
// import { BehaviorSubject, combineLatest } from 'rxjs';
// import { map, switchMap } from 'rxjs/operators';
// import { DateTime } from 'luxon';


// import { Group, IGroup, ISchedule } from '../../shared/models';
// import { IGroupsService, IBusyService } from '.';
// import { BUSY_SERVICE, FIRESTORE_SERVICE } from './injection-tokens'
// import { ISearchSettings } from '../models';
// import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService implements IGroupsService {
  initialize() {
    throw new Error('Method not implemented.');
  }
  groups$: BehaviorSubject<IGroup[]>;
  groups: IGroup[];
  verbose: string;
  getGroupsAsync(search: ISearchSettings): Promise<IGroup[]> {
    throw new Error('Method not implemented.');
  }

  // public groups$: BehaviorSubject<IGroup[]> = new BehaviorSubject<IGroup[]>(<any>[]);
  // public groups: IGroup[];
  // public verbose: string;

  // private geo: geofirex.GeoFireClient;
  // field = 'point';

  // constructor(
  //   private afs: AngularFirestore,
  //   private transSvc: TranslateService,
  //   @Inject(FIRESTORE_SERVICE) private fss: FirestoreService) { }

  // initialize() {
  //   this.geo = geofirex.init(firebase);
  // }

  // async getGroupsAsync(search: ISearchSettings): Promise<IGroup[]> {
  //   console.trace('getGroupsAsyn()', search);
  //   //var position: GeolocationPosition = await Geolocation.getCurrentPosition();
  //   //const center = this.geo.point(position.coords.latitude, position.coords.longitude); 
  //   //const center = this.geo.point(39.8249268571429, -84.8946604285714);
  //   const center = this.geo.point(search.lat, search.lon);

  //   // ${await this.transSvc.get('POSTCODE').toPromise()} 
  //   this.verbose = search.gps ? `${await this.transSvc.get('CURRENT.GPS').toPromise()}` : `${search.zipcode}`
  //   //this.verbose = `${this.verbose} ${await this.transSvc.get('RADIUS').toPromise()} ${search.radius}m`;

  //   //const active; = .collection('users').where('status', '==', 'active');
  //   //const q = this.db.list('/meetings').snapshotChanges();

  //   let query = this.geo.query<IGroup>('groups').within(center, 100, this.field);

  //   query = query.pipe(
  //     switchMap((groups: any[]) => {
  //       const res = groups.map((group: any) => {
  //         return this.fss.col$<ISchedule>('schedules', ref => ref.where('gid', '==', group.id))
  //           .pipe(
  //             map(schedules => {
  //               group.schedules = schedules;
  //               return group
  //             })
  //           );
  //       });
  //       return combineLatest(res);
  //     })
  //   );

  //   if (!search.byAnyDay) {
  //     const dayVerbose = search.byDay !== `${await this.transSvc.get('TODAY').toPromise()}` ? search.byDay
  //       : await this.transSvc.get(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][(new Date()).getDay()]).toPromise();

  //     // ${await this.transSvc.get('ON').toPromise()}
  //     this.verbose = `${this.verbose} ${dayVerbose}`;

  //     // `${await this.transSvc.get('TODAY').toPromise()}`
  //     const day = search.byDay !== 'today' ? search.byDay
  //       : await this.transSvc.get(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][(new Date()).getDay()]).toPromise();

  //     query = query.pipe(
  //       map(groups => {

  //         const rv = [];
  //         groups.forEach(group => {
  //           const schedules = [];
  //           group.schedules.forEach(schedule => {
  //             if (schedule.day === day) {
  //               rv.push(group);
  //               schedules.push(schedule);
  //             }
  //             group.schedules = schedules;
  //           })
  //         });
  //         return rv;
  //       })
  //     );
  //   } else {
  //     this.verbose = `${this.verbose} ${(await this.transSvc.get('ANYDAY').toPromise()).toLowerCase()}`;
  //   }

  //   if (search.byRelativeTime) {
  //     const within = `${await this.transSvc.get('WITHIN').toPromise()}`;
  //     query = query.pipe(
  //       map(groups => {
  //         const date = new Date();
  //         const time = date.toTimeString();
  //         const now = Date.parse('01/' + (date.getDay() + 1) + '/1970 ' + time.substring(0, time.indexOf(' ')) + ' UTC');
  //         const window = <number>search.byRelative.early * 60 * 1000;

  //         this.verbose = `${this.verbose} ${within} ${search.byRelative.early} hour(s)`;

  //         const rv = [];
  //         const schedules = [];
  //         groups.forEach(group => {
  //           group.schedules.forEach(schedule => {
  //             if (
  //               now <= (schedule.millis + <number>search.byRelative.late * 60 * 1000)
  //               && (now >= (schedule.millis - window))) {
  //               rv.push(group);
  //               schedules.push(schedule);
  //             }
  //             group.schedules = schedules;
  //           })
  //         });
  //         return rv;
  //       })
  //     )
  //   } else if (search.bySpecificTime) {
  //     const between = `${await this.transSvc.get('BETWEEN').toPromise()}`;
  //     this.verbose = `${this.verbose} ${between} ${DateTime.fromISO(search.bySpecific.start).toLocaleString(DateTime.TIME_SIMPLE)} - ${DateTime.fromISO(search.bySpecific.end).toLocaleString(DateTime.TIME_SIMPLE)}`;

  //     let today = DateTime.utc();
  //     let start = DateTime.fromISO(search.bySpecific.start).toUTC();
  //     start = DateTime.fromObject({
  //       year: today.year,
  //       month: today.month,
  //       day: today.day,
  //       hour: start.hour,
  //       minute: start.minute
  //     })

  //     let end = DateTime.fromISO(search.bySpecific.end).toUTC();
  //     end = DateTime.fromObject({
  //       year: today.year,
  //       month: today.month,
  //       day: today.day,
  //       hour: end.hour,
  //       minute: end.minute
  //     })

  //     query = query.pipe(
  //       map(groups => {
  //         const rv = [];
  //         const schedules = [];
  //         groups.forEach(group => {
  //           group.schedules.forEach(schedule => {
  //             let time = DateTime.fromFormat(schedule.time, 't');
  //             if (time >= start && time <= end) {
  //               rv.push(group);
  //               schedules.push(schedule);
  //             }
  //             group.schedules = schedules;
  //           })
  //         });
  //         return rv;
  //       })
  //     )
  //   } else {
  //     this.verbose = `${this.verbose} ${(await this.transSvc.get('ANYTIME').toPromise()).toLowerCase()}`;
  //   }

  //   query = query.pipe(
  //     map(groups => {
  //       const rv = [];
  //       groups.forEach(group => {
  //         rv.push(new Group(group))
  //       });
  //       return rv;
  //     }));

  //   return new Promise((resolve, reject) => {
  //     query.subscribe(async groups => {
  //       this.groups = groups;
  //       this.groups$.next(<IGroup[]>(<any>groups));
  //       resolve(this.groups);
  //     },
  //       async error => {
  //         console.error(error);
  //         reject(error);
  //       });
  //   });
  // }
}
