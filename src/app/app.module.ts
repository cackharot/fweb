import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { Ng2Webstorage } from 'ng2-webstorage';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TopNavComponent } from './topnav/topnav.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { HowItWorksComponent } from './howitworks/howitworks.component';

import { FooterComponent } from './footer/footer.component';

import { StoreService } from '../services/store.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';

import { AppRoutes } from './app.routes';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestaurantComponent } from './restaurant/restaurant.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopNavComponent,
    SpinnerComponent,
    HowItWorksComponent,
    FooterComponent,
    RestaurantListComponent,
    RestaurantComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    OAuthModule.forRoot(),
    Ng2Webstorage,
    AppRoutes
  ],
  providers: [OAuthService, LocalStorageService, SessionStorageService,
  OrderService, StoreService, ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
