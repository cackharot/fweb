import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
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
  @Output() onerror = new EventEmitter<string>();
  error: string = null;
  coupon_code: string = null;

  constructor(
    private router: Router,
    private renderer: Renderer,
    private orderService: OrderService) {
  }

  ngOnInit() {
    // this.fetchAvailablePincodes();
    this.onerror.subscribe(msg => {
      this.error = msg;
    });
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
        console.log(x);
        this.order = x;
      }, err => {
        console.error(err);
        this.onerror.emit(err || 'Invalid coupon code!');
      });
  }

  removeCoupon() {
    this.onerror.emit(null);
    this.order.coupon_code = '';
    this.order.coupon_discount = 0;
  }
}
