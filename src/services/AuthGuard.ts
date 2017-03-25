import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../AppConfig';

import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(protected router: Router, protected authService: OAuthService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const token = this.authService.getIdToken();
    if (state.url !== '/login' && !token) {
      this.authService.initImplicitFlow();
      return false;
    }
    return true;
  }
}
