import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';

import { GroupsTabPageRoutingModule } from './groups-tab-routing.module';

import { GroupsTabPage } from './groups-tab.page';
import { FavoritesPage } from './favorites/favorites.page';
import { SearchPage } from './search/search.page';
import { MapPage } from './search/map/map.page';
import { SearchSettingsPage } from './search/search-settings/search-settings.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    SharedModule,
    GroupsTabPageRoutingModule,
    AgmCoreModule
  ],
  declarations: [
    GroupsTabPage,
    FavoritesPage,
    SearchPage,
    MapPage,
    SearchSettingsPage
  ]
})
export class GroupsTabPageModule {}
