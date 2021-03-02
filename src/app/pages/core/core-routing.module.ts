import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../guards/auth.guard';
import { FeatureGuard } from '../../guards/feature.guard';

import { AboutPage } from './about/about.page';
import { AccountPage } from './account/account.page';
import { ErrorPage } from './error/error.page';
import { LandingPage } from './landing/landing.page';
import { LoginPage } from './login/login.page';
import { LogoutPage } from './logout/logout.page';
import { ProfilePage } from './profile/profile.page';
import { SettingsPage } from './settings/settings.page';
import { SignupPage } from './signup/signup.page';
import { SupportPage } from './support/support.page';
import { TutorialPage } from './tutorial/tutorial.page';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'landing',
  //   pathMatch: 'full'
  // },
  {
    path: 'landing',
    component: LandingPage
  },
  {
    path: 'about',
    component: AboutPage
  },
  {
    path: 'account',
    component: AccountPage
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'logout',
    component: LogoutPage
  },
  {
    path: 'error',
    component: ErrorPage
  },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'signup',
    component: SignupPage
  },
  {
    path: 'support',
    component: SupportPage
  },
  {
    path: 'tutorial',
    component: TutorialPage
  },
  // {
  //   path: '**',
  //   redirectTo: 'landing',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule { }
