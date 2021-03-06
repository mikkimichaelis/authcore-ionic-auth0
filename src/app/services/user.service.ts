import { environment } from 'src/environments/environment';
import { Inject, Injectable } from '@angular/core';
import { iif, ObjectUnsubscribedError, Observable, of, ReplaySubject, Subscription, throwError, timer } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { IMeeting, IUser, Meeting } from '../../shared/models';
import { User } from '../../shared/models';

import { IUserService, ITranslateService, IFirestoreService, IDataService, IToastService } from './';
import { TRANSLATE_SERVICE, FIRESTORE_SERVICE, ANGULAR_FIRE_FUNCTIONS, SETTINGS_SERVICE, AUTH_SERVICE, DATA_SERVICE, TOAST_SERVICE } from './injection-tokens';
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

  _user: User;

  _homeMeeting: Meeting;
  homeMeeting$: ReplaySubject<Meeting> = new ReplaySubject<Meeting>(1);

  private _userSubscription: Subscription;
  private _homeMeetingSubscription: Subscription;

  constructor(
    @Inject(TOAST_SERVICE) private toastService: IToastService,
    @Inject(FIRESTORE_SERVICE) private fss: IFirestoreService,
    @Inject(ANGULAR_FIRE_FUNCTIONS) private aff: IAngularFireFunctions,
    @Inject(DATA_SERVICE) private dataService: IDataService,
    @Inject(TRANSLATE_SERVICE) private translate: ITranslateService,
    @Inject(SETTINGS_SERVICE) private settingsService: ISettingsService) {

    this.dataService.fireUser$.subscribe(async (fireUser) => {
      if (fireUser !== null) {
        await this.getUserWithCreate(fireUser);
      } else {
        this.unsubscribe();
        this._user = null;
        this.dataService.user$.next(this._user);
      }
    });
  }

  public async getUserWithCreate(fireUser: firebase.User) {
    if (this.dataService.isNewUser) {
      try {
        await this.createUser(fireUser);
      } catch (error) {
        console.error(error.message);
        this.toastService.present(`createUser(isNewUser): Network Communication Error`);
        return;
      }
    }

    try {
      await this.getUser(fireUser.uid);
      this.userSubscribe(this._user.id);
      return;
    } catch {
      try {
        await this.createUser(fireUser);
        await this.getUser(fireUser.uid);
        this.userSubscribe(this._user.id);
      return;
      } catch (error) {
        console.error(error.message);
        this.toastService.present(`getUser() -> createUser(): Network Communication Error`);
        return;
      }
    }
  }

  async createUser(fireUser: any): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.makeCallableAsync('createUser', { 
          uid: fireUser.uid, 
          name: this.dataService.authUser.name,
          authUser: this.dataService.authUser
        });
        console.log(`createUser(): SUCCESS`);
        resolve(true);
      } catch (error) {
        console.log(`createUser(): ERROR: ${error.message}`);
        resolve(false);
      }
    })
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
          return this._user;
        } else {
          throw new Error(`User not found: ${id}`);
        }
      }),
      // retryWhen(errors => {
      //   return errors
      //     .pipe(
      //       delayWhen(() => timer(2000)),
      //       tap(() => console.log('retrying...'))
      //     );
      // })
    ).toPromise();
  }

  unsubscribe() {
    this.userUnsubscribe();
    this.homeMeetingUnsubscribe();
  }

  userUnsubscribe() {
    if (this._userSubscription && !this._userSubscription.closed) {
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
        this.dataService.user$.next(this._user);
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
