import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';


const AppRoutes = RouterModule.forRoot([
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'restaurants',
    component: RestaurantListComponent
  }
]);

export { AppRoutes };
