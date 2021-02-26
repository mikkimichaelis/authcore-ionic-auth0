import { Component, Inject, OnInit } from '@angular/core';
import { AUTH_SERVICE, IAuthService } from './services';

@Component({
  selector: 'app-callback',
  template: `
    callback
  `
})
export class CallbackComponent implements OnInit {

  constructor(@Inject(AUTH_SERVICE) private auth: IAuthService) { }

  ngOnInit() {
    this.auth.handleLoginCallback();
  }

}
