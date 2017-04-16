import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
// import { CheckoutComponent } from './checkout/checkout.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { OrderFailureComponent } from './order-failure/order-failure.component';
// import { OtpComponent } from './otp/otp.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';
import { RestaurantMenuComponent } from './restaurant-menu/restaurant-menu.component';
import { RestaurantAboutComponent } from './restaurant-about/restaurant-about.component';
import { RestaurantReviewComponent } from './restaurant-review/restaurant-review.component';
import { TrackOrderComponent } from './track-order/track-order.component';
// import { MyOrderComponent } from './my-order/my-order.component';
// import { FaqComponent } from './faq/faq.component';
// import { TermsOfUseComponent } from './terms/terms.component';
// import { ContactUsComponent } from './contactus/contactus.component';
// import { AboutUsComponent } from './aboutus/aboutus.component';
import { SearchComponent } from './search/search.component';
import { SigninComponent } from './signin/signin.component';

const AppRoutes = RouterModule.forRoot([
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'restaurants', component: RestaurantListComponent },
  {
    path: 'restaurants/:id', component: RestaurantDetailComponent,
    children: [
      // { path: '', redirectTo: 'menu', pathMatch: 'full' },
      { path: '', component: RestaurantMenuComponent },
      { path: 'menu', component: RestaurantMenuComponent },
      { path: 'about', component: RestaurantAboutComponent },
      { path: 'review', component: RestaurantReviewComponent },
    ]
  },
  { path: 'order_success', component: OrderSuccessComponent },
  { path: 'order_failure', component: OrderFailureComponent },
  { path: 'track', component: TrackOrderComponent },
  { path: 'track/:order_no', component: TrackOrderComponent },
  { path: 'search/:q', component: SearchComponent },
  { path: 'signin', component: SigninComponent },
  // { path: 'my_orders', component: MyOrderComponent },

  // { path: 'faq', component: FaqComponent },
  // { path: 'terms_of_use', component: TermsOfUseComponent },
  // { path: 'contact_us', component: ContactUsComponent },
  // { path: 'about_us', component: AboutUsComponent }
]);

export { AppRoutes };
