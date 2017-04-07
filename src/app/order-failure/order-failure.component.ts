import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OrderService } from 'services/order.service';
import { Order } from 'model/order';

@Component({
  selector: 'app-order-failure',
  templateUrl: './order-failure.component.html',
})
export class OrderFailureComponent implements OnInit {
  private order: Order;
  isRequesting: boolean = false;
  errorMsg: string = null;

  constructor(private router: Router, private orderService: OrderService) {
    this.router.events.subscribe(x => {
      window.scroll(0, 0);
    });
  }

  ngOnInit() {
    this.loadOrder();
  }

  loadOrder() {
    this.isRequesting = true;
    this.orderService.reloadOrder()
      .then(x => {
        this.order = x;
        if (x === undefined || x.order_no.length === 0) {
          this.router.navigate(['/home']);
          return;
        }
        if (x.payment_status === 'success') {
          console.error('Oops! This should not happen');
          this.router.navigate(['/order_success']);
        }
        this.isRequesting = false;
      })
      .catch(e => {
        if (e !== 'Invalid order') {
          this.errorMsg = e;
        }
        this.isRequesting = false;
      });
  }
}
