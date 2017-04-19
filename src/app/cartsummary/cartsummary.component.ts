import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrderService } from 'services/order.service';

import { Order } from 'model/order';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cartsummary.component.html',
})
export class CartSummaryComponent implements OnInit {
  currentOrder: Order;
  totalQuantity: number;
  totalAmount: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService) { }

  ngOnInit() {
    this.currentOrder = this.orderService.getOrder();
    this.orderService.itemAdded$.subscribe((x) => {
      this.update();
    });
    this.orderService.orderUpdated$.subscribe((x) => {
      this.update();
    });
    this.orderService.orderReseted$.subscribe((x) => {
      this.currentOrder = x;
      this.update();
    });
    this.update();
  }

  canShow(): boolean {
    const currentPath = this.router.url;
    const count = ['/checkout', '/otp', '/order_success', '/track']
      .filter(x => currentPath.startsWith(x.toLowerCase())).length;
    return count === 0;
  }

  update() {
    if (this.currentOrder === null) {
      this.totalAmount = this.totalQuantity = 0;
      return;
    }
    this.totalQuantity = this.currentOrder.getTotalQuantity();
    this.totalAmount = this.currentOrder.getTotalAmount();
  }

  navigateToCheckout(event: any) {
    this.router.navigate(['checkout']);
  }
}
