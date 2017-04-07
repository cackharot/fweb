import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { Order } from 'model/order';
import { OrderService } from 'services/order.service';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
})
export class OrderSuccessComponent implements OnInit {
  order: Order;
  isRequesting: boolean = false;
  error: any = null;

  constructor(
    private router: Router,
    private orderService: OrderService) {
    this.router.events.subscribe(x => {
      window.scroll(0, 0);
    });
  }

  ngOnInit() {
    this.isRequesting = true;
    this.orderService.reloadOrder()
      .then(data => {
        this.isRequesting = false;
        this.order = data;
        if (this.order === null || this.order.order_no === null || this.order.order_no.length === 0) {
          console.error('Invalid order');
          console.error(this.order);
          this.router.navigate(['home']);
        }
        if (this.order.otp_status !== 'VERIFIED') {
          console.error('Invalid order state!');
          this.router.navigate(['home']);
        }
      })
      .catch(e => {
        this.isRequesting = false;
        this.error = e;
      });
  }

  estimated_delivery() {
    const st = moment.utc(this.order.created_at.getValue()).add(40, 'm');
    const ed = moment.utc(this.order.created_at.getValue()).add(55, 'm');
    return `${st.format('hh:mm A')} - ${ed.format('hh:mm A')}`;
  }
}
