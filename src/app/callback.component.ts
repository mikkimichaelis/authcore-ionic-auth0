import { Component, Inject, OnInit } from '@angular/core';
import { AUTH_SERVICE, IAuthService } from './services';

@Component({
  selector: 'app-callback',
  template: `
    Loading...
  `
})
export class CallbackComponent implements OnInit {

  constructor(@Inject(AUTH_SERVICE) private authService: IAuthService) { }

  ngOnInit() {
    this.authService.handleLoginCallback();
  }
}
