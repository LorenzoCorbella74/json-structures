import { Injectable } from '@angular/core';
import { CanActivate,
         ActivatedRouteSnapshot,
         RouterStateSnapshot } from '@angular/router';
import { AuthenticateService } from './authenticate.service';



@Injectable()
export class CanActivateRouteGuard implements CanActivate {

  constructor(private auth: AuthenticateService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      return this.auth.isLoggedIn();
  }
}
