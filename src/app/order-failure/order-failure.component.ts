import { Component, OnInit } from '@angular/core';
import { LocalStorage, SessionStorage } from 'ng2-webstorage';
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
  @SessionStorage('failure_order_no')
  order_no: string;

  constructor(private router: Router, private orderService: OrderService) {
    this.router.events.subscribe(x => {
      window.scroll(0, 0);
    });
  }

  ngOnInit() {
    if (this.isInValidOrderNo()) {
      this.order = this.orderService.getOrder();
      this.order_no = this.order.order_no;
    }

    if (this.isInValidOrderNo()) {
      console.error('Invalid order');
      console.error(this.order);
      this.errorMsg = 'Something is not right';
      return;
    }
    this.loadOrder();
  }

  isInValidOrderNo() {
    return this.order_no === null || this.order_no === '' || this.order_no.length === 0;
  }

  loadOrder() {
    this.isRequesting = true;
    this.orderService.reloadOrder(this.order_no)
      .then(x => {
        this.order = x;
        if (x === undefined || x.order_no.length === 0) {
          this.router.navigate(['home']);
          return;
        }
        if (x.payment_status === 'success') {
          console.error('Oops! This should not happen');
          this.router.navigate(['order_success']);
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
