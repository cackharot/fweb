import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {

  }

  ngOnInit() {

  }

  public isSignedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  public login() {
    this.oauthService.initImplicitFlow();
  }

  public logoff() {
    this.oauthService.logOut();
    this.router.navigateByUrl('/');
  }

  public get name() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) { return null; }
    return claims.given_name;
  }

  public get avatar() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) { return null; }
    return claims.picture;
  }
}
