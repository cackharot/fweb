import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { Router } from '@angular/router';
import { URLSearchParams, Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private http: Http,
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {

  }

  ngOnInit() {
    this.initOAuth();
  }

  initOAuth() {
    try {
      this.oauthService.loginUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      this.oauthService.redirectUri = window.location.origin;
      this.oauthService.clientId = '280436316587-pc2v79112kdqu0jiruu56m92s8nr4s42.apps.googleusercontent.com';
      this.oauthService.scope = 'openid profile email';
      this.oauthService.oidc = true;
      this.oauthService.setStorage(sessionStorage);
      this.oauthService.logoutUrl = null;

      this.oauthService.tryLogin({
        onTokenReceived: context => {
          if (window.location.hash && window.location.hash.indexOf('access_token') !== -1) {
            this.router.navigate(['home']);
          }
        },
        validationHandler: context => {
          const params = new URLSearchParams();
          params.set('access_token', context.accessToken);
          const v = this.http.get('https://www.googleapis.com/oauth2/v3/tokeninfo', { search: params })
            .toPromise().then(x => {
              if (x.json().aud !== this.oauthService.clientId) {
                console.error('Wrong client_id');
                this.oauthService.logOut();
              }
            });
          return v;
        }
      });

      if (!this.oauthService.hasValidAccessToken()) {
        this.oauthService.logOut();
      }
    } catch (e) {
      console.error(e);
    }
  }
}
