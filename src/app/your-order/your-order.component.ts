import { Component, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrderService } from 'services/order.service';

import { Order, LineItem } from 'model/order';

@Component({
  selector: 'app-your-order',
  templateUrl: './your-order.component.html',
})
export class YourOrderComponent implements OnInit {
  order: Order;
  totalQuantity: number;
  totalAmount: number;
  @Input()
  showCheckoutButton = false;
  @Input()
  title = 'Your Order';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService) { }

  ngOnInit() {
    this.order = this.orderService.getOrder();
    this.update();
    this.orderService.itemAdded$.subscribe((x) => {
      this.update();
    });
    this.orderService.orderUpdated$.subscribe((x) => {
      this.update();
    });
    this.orderService.orderReseted$.subscribe((x) => {
      this.order = x;
      this.update();
    });
  }

  isEmptyOrder() {
    return this.order.getItems().length === 0;
  }

  removeItem(item: LineItem) {
    this.orderService.removeItem(item);
  }

  changeQuantity(item: LineItem, value: number) {
    this.orderService.updateQuantity(item, value);
  }

  update() {
    this.totalQuantity = this.order.getTotalQuantity();
    this.totalAmount = this.order.getTotalAmount();
  }

  navigateToCheckout(event: any) {
    this.router.navigate(['checkout']);
  }


  removeCoupon() {
    this.orderService.removeCoupon();
  }
}
