import { ReplaySubject } from 'rxjs';
import { Meeting, User } from '../../shared/models';

export interface IUserService {

    _user: User;

    _homeMeeting: Meeting;
    homeMeeting$: ReplaySubject<Meeting>;

    getUser(id: string): Promise<User>;
    saveUserAsync(user: User);

    createUser(authUser: any): Promise<boolean>;
    setName(firstName: string, lastInitial: string);
    makeHomeGroup(id: string);
    makeFavGroup(id: string, make: boolean);

    unsubscribe();
}