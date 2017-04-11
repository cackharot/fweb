import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionStorage } from 'ng2-webstorage';

import { OrderService } from 'services/order.service';

import { DateTimePipe } from '../pipes/datetime.pipe';

import { Order } from 'model/order';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html'
})
export class TrackOrderComponent implements OnInit, OnDestroy {
  @SessionStorage() orderNo: string;
  order: Order;
  isRequesting: boolean = false;
  submitted: boolean = false;
  errorMsg: string;
  private sub: any;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute) {
    this.router.events.subscribe(x => {
      window.scroll(0, 0);
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.orderNo = (params['order_no'] || this.orderNo).trim();
      this.searchOrder();
    });
    this.searchOrder();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  searchOrder() {
    if (this.orderNo === null || this.orderNo.length === 0) {
      this.order = null;
      return;
    }

    this.isRequesting = true;
    this.submitted = true;
    this.orderService.loadOrder(this.orderNo)
      .then(x => {
        this.order = x;
        this.isRequesting = false;
      })
      .catch(errorMsg => {
        this.errorMsg = errorMsg;
        this.isRequesting = false;
      });
  }

  noOp() {
    return false;
  }
}
