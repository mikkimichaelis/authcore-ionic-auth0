import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './callback.component';

import { AuthGuard } from './guards/auth.guard';
import { FeatureGuard } from './guards/feature.guard';
import { AdminTabPageModule } from './pages/admin-tab/admin-tab.module';
import { CoreModule } from './pages/core/core.module';
import { HomeTabPageModule } from './pages/home-tab/home-tab.module';
import { MeetingsTabPageModule } from './pages/meetings-tab/meetings-tab.module';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/core/landing',
  //   pathMatch: 'full'
  // },
  // { 
  //   path: '', loadChildren: './home/home.module#HomePageModule',
  // },
  {
    path: 'callback', component: CallbackComponent
  },
  {
    path: 'core',
    loadChildren: () => CoreModule,
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => HomeTabPageModule
    // loadChildren: () => import('./pages/home-tab/home-tab.module').then(m => m.HomeTabPageModule)
  },
  {
    path: 'meetings',
    canActivate: [AuthGuard],
    loadChildren: () => MeetingsTabPageModule
    // loadChildren: () => import('./pages/meetings-tab/meetings-tab.module').then(m => m.MeetingsTabPageModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => AdminTabPageModule
    // loadChildren: () => import('./pages/admin-tab/admin-tab.module').then(m => m.AdminTabPageModule)
  },
  {
    path: 'common',
    canActivate: [AuthGuard],
    // loadChildren: () => CommonModule
    loadChildren: () => import('./pages/common/common.module').then(m => m.CommonModule)
  },
  {
    path: '**',
    redirectTo: '/core/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    // enableTracing: true,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'corrected' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
