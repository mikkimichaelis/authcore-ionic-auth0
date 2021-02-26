import { environment } from 'src/environments/environment';
import { Inject, Injectable } from '@angular/core';
import { iif, ObjectUnsubscribedError, Observable, of, ReplaySubject, Subscription, throwError, timer } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { IMeeting, IUser, Meeting } from '../../shared/models';
import { User } from '../../shared/models';

import { IUserService, ITranslateService, IFirestoreService, IDataService } from './';
import { TRANSLATE_SERVICE, FIRESTORE_SERVICE, ANGULAR_FIRE_FUNCTIONS, SETTINGS_SERVICE, AUTH_SERVICE, DATA_SERVICE } from './injection-tokens';
import { IAngularFirestore } from './angular-firestore.interface';

import { IAngularFireFunctions } from './angular-fire-functions.interface';
import { ISettingsService } from './settings.service.interface';
import { IAuthService } from './auth.service.interface';
import { concatMap, delay, delayWhen, map, retry, retryWhen, tap } from 'rxjs/operators';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {

  isNewUser: boolean = false;
  _user: User;
  user$: ReplaySubject<User> = new ReplaySubject<User>(1);

  _homeMeeting: Meeting;
  homeMeeting$: ReplaySubject<Meeting> = new ReplaySubject<Meeting>(1);

  private _userSubscription: Subscription;
  private _homeMeetingSubscription: Subscription;

  constructor(
    @Inject(FIRESTORE_SERVICE) private fss: IFirestoreService,
    @Inject(ANGULAR_FIRE_FUNCTIONS) private aff: IAngularFireFunctions,
    @Inject(DATA_SERVICE) private DataService: IDataService,
    @Inject(TRANSLATE_SERVICE) private translate: ITranslateService,
    @Inject(SETTINGS_SERVICE) private settingsService: ISettingsService) {
  }

  public async getUser(id: string): Promise<User> {
    // https://stackoverflow.com/questions/44911251/how-to-create-an-rxjs-retrywhen-with-delay-and-limit-on-tries
    const retryPipeline =
      // Still using retryWhen to handle errors
      retryWhen(errors => errors.pipe(
        // Use concat map to keep the errors in order and make sure they
        // aren't executed in parallel
        concatMap((e, i) =>
          // Executes a conditional Observable depending on the result
          // of the first argument
          iif(
            () => i > environment.getUserRetry,
            // If the condition is true we throw the error (the last error)
            throwError(e),
            // Otherwise we pipe this back into our stream and delay the retry
            of(e).pipe(map(delay(environment.getUserDelay))
            )
          ))));
    return await this.fss.doc<IUser>(`users/${id}`).get().pipe(retryPipeline).pipe(
      map((user: any) => {
        if (user.exists) {
          this._user = new User(user.data());
          console.log(`...Loaded User...`);
          // this.userSubscribe(this._user.id);
          this.user$.next(this._user);
          return this._user;
        } else {
          // User record not yet created by onAuthCreate in the Mighty Google Cloud
          throw new Error(`Where's Waldo? ${id}`);
        }
      }),
      retryWhen(errors => {
        return errors
          .pipe(
            delayWhen(() => timer(2000)),
            tap(() => console.log('retrying...'))
          );
      })
      ).toPromise();
  }

  userUnsubscribe() {
    if (this._userSubscription && !this._userSubscription.closed) {
      console.log(`this._userSubscription.unsubscribe()`);
      this._userSubscription.unsubscribe();
      this._userSubscription = null;
    }
  }

  userSubscribe(uid: string) {
    this.userUnsubscribe();

    console.log(`userSubscribe()`);
    this._userSubscription = this.fss.doc$<IUser>(`users/${uid}`).subscribe({
      next: async (user) => {
        this._user = new User(user);
        console.log(`...Received User...`);
        this.user$.next(this._user);
        this.homeMeetingSubscribe(this._user.homeMeeting);
      },
      error: async (error) => {
        console.error(error);
      },
    });
  }

  homeMeetingUnsubscribe() {
    if (this._homeMeetingSubscription && !this._homeMeetingSubscription.closed) {
      console.log(`this._homeMeetingSubscription.unsubscribe()`);
      this._homeMeetingSubscription.unsubscribe();
      this._homeMeetingSubscription = null;
    }
  }

  homeMeetingSubscribe(homeMeeting: string) {
    this.homeMeetingUnsubscribe();

    if (!_.isEmpty(homeMeeting)) {
      console.log(`homeMeetingSubscribe()`);
      this._homeMeetingSubscription = this.fss.doc$<IUser>(`meetings/${homeMeeting}`).subscribe({
        next: async (meeting: any) => {
          this._homeMeeting = new Meeting(meeting);
          this.homeMeeting$.next(this._homeMeeting);
        },
        error: async (error) => {
          console.error(error);
        },
      });
    } else {
      this.homeMeeting$.next(null);
    }
  }

  unsubscribe() {
    this.userUnsubscribe();
    this.homeMeetingUnsubscribe();
  }

  async saveUserAsync(user: User) {
    console.log(`saveUserAsync()`);
    try {
      await this.fss.doc<IUser>(`users/${this._user.id}`).update(user.toObject());
    } catch (e) {
      console.error(e);
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

  async setName(firstName: string, lastInitial: string) {
    console.log(`setName()`);
    await this.makeCallableAsync('setName', { firstName: firstName, lastInitial: lastInitial });
  }

  async makeHomeGroup(id: string) {
    console.log(`makeHomeGroup()`);
    await this.makeCallableAsync('makeHomeGroup', { id: id });
  }

  async makeFavGroup(id: string, make: boolean) {

    if (make) {
      await this.makeCallableAsync('addFavorite', { gid: id });
    } else {
      await this.makeCallableAsync('removeFavorite', { gid: id });
    }
  }
}
