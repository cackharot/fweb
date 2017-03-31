import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SpinnerComponent } from '../spinner/spinner.component';

import { ReviewComponent } from './review/review.component';
import { CheckoutComponent } from './checkout.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { PaymentComponent } from './payment/payment.component';

import { StoreService } from 'services/store.service';
import { ProductService } from 'services/product.service';
import { OrderService } from 'services/order.service';

const checkouRoutes: Routes = [
  { path: 'checkout', component: CheckoutComponent },
  { path: 'checkout/delivery-details', component: DeliveryDetailComponent },
  { path: 'checkout/payment', component: PaymentComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot(checkouRoutes)
  ],
  declarations: [
    SpinnerComponent,
    CheckoutComponent,
    ReviewComponent,
    DeliveryDetailComponent,
    PaymentComponent
  ],
  providers: [StoreService, OrderService, ProductService],
  exports: [SpinnerComponent]
})
export class CheckoutModule { }
