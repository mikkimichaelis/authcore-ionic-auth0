import { IUserSettings } from '../models';

export interface ISettingsService {
    settings: IUserSettings;
    environment: any;
    googleCloud: any;
    logRocket: any;
    initialize(auth: boolean);
    load();
    save();

    darkTheme: boolean;
}