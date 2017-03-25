import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';


const AppRoutes = RouterModule.forRoot([
  {
    path: 'home',
    component: HomeComponent
  }
]);

export { AppRoutes };
