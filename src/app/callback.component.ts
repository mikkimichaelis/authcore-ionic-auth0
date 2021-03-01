import { Component, Inject, OnInit } from '@angular/core';
import { AUTH_SERVICE, IAuthService } from './services';

@Component({
  selector: 'app-callback',
  template: `
    callback
  `
})
export class CallbackComponent implements OnInit {

  constructor(@Inject(AUTH_SERVICE) private authService: IAuthService) { }

  ngOnInit() {
    this.authService.initialized$.subscribe(init => {
      if (init) {
        console.log(`handleLoginCallback`);
        this.authService.handleLoginCallback();
      }
    })
  }

  ionViewDidEnter() {
    console.log(`callback`);
  }
}
