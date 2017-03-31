import { Component, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ViewChild, ElementRef, Renderer } from '@angular/core';
import { LocalStorage, SessionStorage } from 'ng2-webstorage';

import { OrderService } from 'services/order.service';

import { Order, DeliveryDetails, LineItem } from 'model/order';

import { AppConfig } from 'AppConfig';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
})
export class ReviewComponent implements OnInit {
  @Input()
  order: Order;
  @Output()
  error = '';
  coupon_code: string = '';

  constructor(
    private router: Router,
    private renderer: Renderer,
    private orderService: OrderService) {
  }

  ngOnInit() {
    // this.fetchAvailablePincodes();
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

  applyCoupon() {
    this.orderService.applyCoupon(this.order, this.coupon_code)
      .then(x => {
        if (x && x.coupon_code) {
          this.order.updateCouponCode(x.coupon_code, x.amount);
          this.error = null;
        } else {
          this.error = 'Invalid coupon code!';
        }
      }, err => {
        console.error(err);
        this.error = err || 'Invalid coupon code!';
      });
  }

  removeCoupon() {
    this.error = null;
    this.order.coupon_code = '';
    this.order.coupon_discount = 0;
  }
}
