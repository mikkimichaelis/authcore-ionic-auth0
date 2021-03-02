import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AUTH_SERVICE, IAuthService } from 'src/app/services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage {

  constructor(
    private route: ActivatedRoute, 
    @Inject(AUTH_SERVICE) private authService: IAuthService) { }

  async ionViewDidEnter() {
    await this.authService.signOut();
  }
}
