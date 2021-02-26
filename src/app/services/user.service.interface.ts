import { ReplaySubject } from 'rxjs';
import { Meeting, User } from '../../shared/models';

export interface IUserService {

    isNewUser: boolean

    _user: User;
    user$: ReplaySubject<User>;

    _homeMeeting: Meeting;
    homeMeeting$: ReplaySubject<Meeting>;

    getUser(id: string): Promise<User>;
    saveUserAsync(user: User);

    setName(firstName: string, lastInitial: string);
    makeHomeGroup(id: string);
    makeFavGroup(id: string, make: boolean);

    unsubscribe();
}