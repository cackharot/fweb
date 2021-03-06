import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Angulartics2Module } from 'angulartics2';

import { SpinnerComponent } from '../spinner/spinner.component';

import { ReviewComponent } from './review/review.component';
import { CheckoutComponent } from './checkout.component';
import { DeliveryDetailComponent } from './delivery-detail/delivery-detail.component';
import { PaymentComponent } from './payment/payment.component';
import { OtpComponent } from './otp/otp.component';

import { YourOrderComponent } from '../your-order/your-order.component';

import { StoreService } from 'services/store.service';
import { ProductService } from 'services/product.service';
import { OrderService } from 'services/order.service';

const checkouRoutes: Routes = [
  { path: 'checkout', component: CheckoutComponent },
  { path: 'checkout/delivery-details', component: DeliveryDetailComponent },
  { path: 'checkout/payment', component: PaymentComponent },
  { path: 'otp', component: OtpComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot(checkouRoutes),
    Angulartics2Module.forChild()
  ],
  declarations: [
    SpinnerComponent,
    CheckoutComponent,
    ReviewComponent,
    DeliveryDetailComponent,
    PaymentComponent,
    YourOrderComponent,
    OtpComponent
  ],
  providers: [StoreService, OrderService, ProductService],
  exports: [SpinnerComponent, YourOrderComponent]
})
export class CheckoutModule { }
