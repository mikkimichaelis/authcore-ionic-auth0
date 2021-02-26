import { BehaviorSubject } from 'rxjs';
import { IGroup } from 'src/shared/models';
import { ISearchSettings } from '../models';

export interface IGroupsService {
    initialize();
    groups$: BehaviorSubject<IGroup[]>;
    groups: IGroup[];
    verbose: string;
    getGroupsAsync(search: ISearchSettings): Promise<IGroup[]>;
}