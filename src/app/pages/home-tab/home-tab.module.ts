import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';

import { HomeTabPageRoutingModule } from './home-tab-routing.module';

import { HomeTabPage } from './home-tab.page';
import { HomePage } from './home/home.page';
import { LivePage } from './live/live.page';
import { FavoritesPage } from './favorites/favorites.page';

@NgModule({
  imports: [
    SharedModule,
    HomeTabPageRoutingModule,
  ],
  declarations: [
    HomeTabPage, 
    HomePage,
    LivePage,
    FavoritesPage
  ],
  providers: [
  ]
})
export class HomeTabPageModule {}
