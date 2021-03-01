import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AUTH_SERVICE, IAuthService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(
    private route: ActivatedRoute, 
    @Inject(AUTH_SERVICE) private authService: IAuthService) { }

  async ionViewWillEnter() {
    if (this.route.snapshot.queryParamMap.get('signOut')) {
      await this.authService.signOut();
    }

    console.log(`loginPage.ionViewWillEnter(${window.location.href})`);
    if (this.route.snapshot.queryParamMap.get('redirect')) {
      await this.authService.setAuthRedirect(this.route.snapshot.queryParamMap.get('redirect'));
    }
  }

  ionViewWillLeave() {}
}
