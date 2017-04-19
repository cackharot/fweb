import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage, SessionStorage } from 'ng2-webstorage';
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
  @SessionStorage('success_order_no')
  order_no: string;

  constructor(
    private router: Router,
    private orderService: OrderService) {
    this.router.events.subscribe(x => {
      window.scroll(0, 0);
    });
  }

  ngOnInit() {
    this.order = this.orderService.getOrder();
    if (this.order != null && this.order.order_no && this.order.order_no.length > 0) {
      this.order_no = this.order.order_no;
    }

    if (this.isInValidOrderNo()) {
      console.error('Invalid order');
      console.error(this.order_no, this.order);
      this.error = 'Something is not right';
      return;
    }
    // console.log('ss', this.orderService.getOrder());
    this.orderService.resetOrder();
    this.isRequesting = true;
    this.orderService.reloadOrder(this.order_no)
      .then(data => {
        this.isRequesting = false;
        this.order = data;
        if (this.order === null || this.order.order_no === null || this.order.order_no.length === 0) {
          console.error('Invalid order');
          this.router.navigate(['home']);
          return;
        }
        if (this.order.otp_status !== 'VERIFIED') {
          console.error('Invalid order state!');
          this.router.navigate(['home']);
          return;
        }
      })
      .catch(e => {
        this.isRequesting = false;
        this.error = e;
      });
  }

  isInValidOrderNo() {
    return this.order_no === null || this.order_no === '' || this.order_no.length === 0;
  }

  estimated_delivery() {
    const st = moment.utc(this.order.created_at.getValue()).add(40, 'm');
    const ed = moment.utc(this.order.created_at.getValue()).add(55, 'm');
    return `${st.format('hh:mm A')} - ${ed.format('hh:mm A')}`;
  }
}
