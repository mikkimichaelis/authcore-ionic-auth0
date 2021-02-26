import { Component, Inject } from '@angular/core';
import { AUTH_SERVICE, IAuthService } from '../services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(
    @Inject(AUTH_SERVICE) public auth: IAuthService
  ) {}

}
