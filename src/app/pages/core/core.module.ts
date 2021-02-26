import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';

import { CoreRoutingModule } from './core-routing.module';

import { AboutPage } from './about/about.page';
import { AccountPage } from './account/account.page';
import { LandingPage } from './landing/landing.page';
import { LoginPage } from './login/login.page';
import { ProfilePage } from './profile/profile.page';
import { SettingsPage } from './settings/settings.page';
import { SignupPage } from './signup/signup.page';
import { TutorialPage } from './tutorial/tutorial.page';
import { SupportPage } from './support/support.page';
import { ErrorPage } from './error/error.page';

@NgModule({
  imports: [
    SharedModule,
    CoreRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AboutPage,
    AccountPage,
    LandingPage,
    LoginPage,
    ProfilePage,
    SettingsPage,
    SignupPage,
    TutorialPage,
    SupportPage,
    ErrorPage,
  ]
})
export class CoreModule { }
