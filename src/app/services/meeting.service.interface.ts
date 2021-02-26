import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { IGroup, IMeeting, Meeting } from 'src/shared/models';
import { ISearchSettings } from '../models';

export interface IMeetingService {
    ownedMeetings$: ReplaySubject<Meeting[]>;
    favoriteMeetings$: ReplaySubject<Meeting[]>;
    liveMeetings$: ReplaySubject<Meeting[]>;
    searchMeetings$: ReplaySubject<Meeting[]>;

    ownedMeetingsSubscribe();
    ownedMeetingsUnsubscribe();

    favoriteMeetingsSubscribe();
    favoriteMeetingsUnsubscribe();

    liveMeetingsSubscribe();
    liveMeetingsUnsubscribe();

    add(meeting: IMeeting): Promise<boolean>;
    update(meeting: IMeeting): Promise<boolean>;

    getMeetingAsync(id: string): Promise<Meeting>;
    getMeetingsAsync(search: ISearchSettings): Promise<Meeting[]>;
}