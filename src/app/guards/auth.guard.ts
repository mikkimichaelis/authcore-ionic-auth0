import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AUTH_SERVICE, IAuthService } from 'src/app/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, @Inject(AUTH_SERVICE) private authService: IAuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if (this.authService.isAuthenticated) {
      return true;
    // } else {
    //   this.router.navigate(['/core/landing']);  // TODO config
    //   return false;
    // }
  }
}
