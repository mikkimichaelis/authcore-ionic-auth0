import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AUTH_SERVICE, IAuthService } from 'src/app/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private navController: NavController, @Inject(AUTH_SERVICE) private authService: IAuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated) {
      return true;
    } else {
      if (!window.location.pathname.includes('/core/login')) {
        console.log(`AuthGuard.redirect(): /core/login?redirect=${window.location.pathname}`);
        this.navController.navigateRoot(`/core/login?redirect=${window.location.pathname}`);
        // this.router.navigate([`/core/login?redirect=${window.location.pathname}`]);
      }
      return false;
    }
  }
}
