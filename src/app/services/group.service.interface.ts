import { ReplaySubject } from 'rxjs';
import { Group } from 'src/shared/models';

export interface IGroupService {
    initialize();

    group$: ReplaySubject<Group>;
    group: Group;
    
    getGroupAsync(id: string): Promise<Group>;
}