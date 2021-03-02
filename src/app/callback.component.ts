import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_SERVICE, IAuthService } from './services';

@Component({
  selector: 'app-callback',
  template: `
    Loading...
  `
})
export class CallbackComponent {

  constructor(private router: Router, @Inject(AUTH_SERVICE) private authService: IAuthService) { }

  async ionViewDidEnter() {
    // if handled, we should be authenticated and redirected appropriately
    if (!await this.authService.handleLoginCallback()) {
      // if not, lets explicitly route to login
      this.router.navigateByUrl('/core/login');
    };
  }
}
