import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeTabPage } from './home-tab.page';
import { HomePage } from './home/home.page';
import { FavoritesPage } from './favorites/favorites.page';
import { LivePage } from './live/live.page';

const routes: Routes = [
  {
    path: 'tab',
    component: HomeTabPage,
    children: [
      {
        path: 'home',
        component: HomePage
      },
      {
        path: 'live',
        component: LivePage
      },
      {
        path: 'favorites',
        component: FavoritesPage,
      },
      {
        path: 'search',
        redirectTo: '/meetings/tab/search',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTabPageRoutingModule { }
