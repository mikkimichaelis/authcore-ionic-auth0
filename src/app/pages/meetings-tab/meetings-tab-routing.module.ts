import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesPage } from './favorites/favorites.page';
import { SearchPage } from './search/search.page';

import { MeetingsTabPage } from './meetings-tab.page';

const routes: Routes = [
  {
    path: 'tab',
    component: MeetingsTabPage,
    children: [
      {
        path: 'home',
        redirectTo: '/home/tab/home',
      },
      {
        path: 'search',
        component: SearchPage
      },
      {
        path: 'favorites',
        component: FavoritesPage
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingsTabPageRoutingModule {}
