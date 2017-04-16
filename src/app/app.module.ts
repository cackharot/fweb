import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { OAuthModule } from 'angular-oauth2-oidc';
import { Ng2Webstorage } from 'ng2-webstorage';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';

import { AgmCoreModule } from 'angular2-google-maps/core';

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
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestaurantReviewComponent } from './restaurant-review/restaurant-review.component';
import { RestaurantMenuComponent } from './restaurant-menu/restaurant-menu.component';
import { RestaurantAboutComponent } from './restaurant-about/restaurant-about.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductGridComponent } from './product-grid/product-grid.component';
import { PriceTableComponent } from './price-table/price-table.component';
import { CartSummaryComponent } from './cartsummary/cartsummary.component';
import { YourOrderComponent } from './your-order/your-order.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { OrderFailureComponent } from './order-failure/order-failure.component';
import { TrackOrderComponent } from './track-order/track-order.component';

import { ChunkPipe } from './pipes/chunk.pipe';
import { DateTimePipe } from './pipes/datetime.pipe';
import { TabComponent } from './components/tab';
import { TabsComponent } from './components/tabs';

import { CheckoutModule } from './checkout/checkout.module';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { SearchComponent } from './search/search.component';
import { FilterSearchComponent } from './filter-search/filter-search.component';
import { SigninComponent } from './signin/signin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopNavComponent,
    // SpinnerComponent,
    // YourOrderComponent,
    HowItWorksComponent,
    FooterComponent,
    RestaurantDetailComponent,
    RestaurantListComponent,
    RestaurantMenuComponent,
    RestaurantReviewComponent,
    RestaurantAboutComponent,
    RestaurantComponent,
    ProductListComponent,
    ProductGridComponent,
    PriceTableComponent,
    CartSummaryComponent,
    OrderSuccessComponent,
    OrderFailureComponent,
    TrackOrderComponent,
    DateTimePipe,
    ChunkPipe,
    TabComponent,
    TabsComponent,
    FeaturedProductsComponent,
    SearchComponent,
    FilterSearchComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2Webstorage,
    OAuthModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyARttGEnBB_fhZnU_PGXzYhE-02ez8lqWo'
    }),
    CheckoutModule,
    AppRoutes
  ],
  providers: [LocalStorageService, SessionStorageService,
    OrderService, StoreService, ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
