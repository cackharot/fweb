import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ViewChild, ElementRef, Renderer } from '@angular/core';
import { LocalStorage, SessionStorage } from 'ng2-webstorage';

import { OrderService } from 'services/order.service';

import { Order, DeliveryDetails, LineItem } from 'model/order';

import { AppConfig } from 'AppConfig';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  @ViewChild('payubutton') onlinePaymentForm: ElementRef;
  @ViewChild('ordernotxt') orderNoTxt: ElementRef;
  payment_url: string = AppConfig.ONLINE_PAYMENT_POST_URL;
  order: Order;
  step = 'review';
  coupon_code = '';
  orderSuccess = false;
  isRequesting = false;
  @SessionStorage() availablePincodes: any[] = [];
  error: any = null;

  constructor(
    private router: Router,
    private renderer: Renderer,
    private orderService: OrderService) {
    this.router.events.subscribe(x => {
      window.scroll(0, 0);
    });
  }

  ngOnInit() {
    this.order = this.orderService.getOrder();
    if (this.order == null) {
      this.order = this.orderService.newOrder();
    }
    this.orderSuccess = this.order.isConfirmed();
    // this.fetchAvailablePincodes();
  }

  ngAfterViewInit() {
    this.navOrder();
  }

  // private fetchAvailablePincodes() {
  //   if (this.availablePincodes.length > 0) {
  //     return;
  //   }
  //   this.orderService.fetchAvailablePincodes()
  //     .then(x => {
  //       this.availablePincodes = x;
  //     }).catch(e => { console.log(e); });
  // }

  resetOrder() {
    this.orderService.resetOrder();
    this.router.navigate(['home']);
  }

  navOrder() {
    if (!this.order.isOrderSubmitted()) {
      return;
    }

    if (this.order.isOtpSent() && this.order.isValid()) {
      this.router.navigate(['/otp']);
    } else if (this.order.isOnlinePaymentMode() && !this.order.isPaymentValid()) {
      this.orderNoTxt.nativeElement.value = this.order.order_no;
      this.renderer.invokeElementMethod(
        this.onlinePaymentForm.nativeElement,
        'dispatchEvent',
        [new MouseEvent('click', { bubbles: true })]
      );
      return;
    } else if (this.order.isConfirmed()) {
      this.router.navigate(['/order_success']);
    }
  }

  confirmOrder() {
    if (this.order.items.length > 0) {
      this.isRequesting = true;
      this.orderService.confirmOrder()
        .then(updatedOrder => {
          this.order = updatedOrder;
          this.orderSuccess = true;
          this.error = null;
          this.navOrder();
          this.isRequesting = false;
        }, errorMsg => {
          this.orderSuccess = false;
          this.error = errorMsg;
          this.isRequesting = false;
        });
    } else {
      this.error = 'Invalid order';
    }
  }

  removeItem(item: LineItem) {
    this.orderService.removeItem(item);
  }

  changeQuantity(item: LineItem, value: number) {
    this.orderService.updateQuantity(item, value);
  }

  isEmpty() {
    return this.order && this.order.items.length === 0;
  }

  goBack(id: string) {
    this.router.navigate([id]);
  }

  nextStep(stepName: string) {
    if (!this.order.isValid()) {
      return;
    }
    this.step = stepName;
  }
}
