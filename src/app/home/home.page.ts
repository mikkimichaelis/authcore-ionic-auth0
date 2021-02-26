import { Component } from '@angular/core';
import { AuthService } from '../services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(
    public auth: AuthService
  ) {}

}
