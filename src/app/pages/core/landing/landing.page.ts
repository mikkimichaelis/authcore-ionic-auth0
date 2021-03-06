
import { Component, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { from, interval, Observable, of, pipe, Subscription } from 'rxjs';
import { concatMap, delay, map, take } from 'rxjs/operators';
import { IAuthService, AUTH_SERVICE, BUSY_SERVICE, IBusyService } from 'src/app/services';
import { BusyService } from 'src/app/services/busy.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  constructor(
    private route: ActivatedRoute, 
    @Inject(BUSY_SERVICE) private busySvc: IBusyService, 
    @Inject(AUTH_SERVICE) private authService: IAuthService) {
  }

  ngOnInit() {}

  spinner: boolean = true;
  async ionViewDidEnter() {
    console.log('LandingPage.ionViewDidEnter()');
  }
}
