import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarPage } from '../common/calendar/calendar.page';
import { FavoritesPage } from './favorites/favorites.page';
import { MapPage } from './search/map/map.page';
import { SearchPage } from './search/search.page';

import { GroupsTabPage } from './groups-tab.page';

const routes: Routes = [
  // {
  //   path: 'groups',
  //   redirectTo: 'groups/tab',
  //   pathMatch: 'full'
  // },
  {
    path: 'tab',
    component: GroupsTabPage,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'groups/tab/search',
      //   pathMatch: 'full'
      // },
      {
        path: 'search',
        children: [
          {
            path: '',
            component: SearchPage
          }
        ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            component: MapPage
          }
        ]
      },
      {
        path: 'favorites',
        children: [
          {
            path: '',
            component: FavoritesPage
          }
        ]
      },
      {
        path: 'calendar',
        children: [
          {
            path: '',
            component: CalendarPage
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsTabPageRoutingModule {}
