import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MyOrderSearchModel, OrderService } from 'services/order.service';

import { Order } from 'model/order';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
})
export class MyOrderComponent implements OnInit {
  isRequesting: boolean = false;
  errorMsg: string;
  orders: Order[] = [];
  showMap: any = {};
  responseData: MyOrderSearchModel = new MyOrderSearchModel();

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute) {
    this.router.events.subscribe(x => {
      window.scroll(0, 0);
    });
  }

  ngOnInit() {
    this.search();
  }

  search(searchUrl: string = null) {
    this.isRequesting = true;
    const searchData = new MyOrderSearchModel();
    searchData.page_size = 5;
    this.orderService.getMyOrders(searchUrl, searchData)
      .then(x => {
        this.responseData = x;
        this.orders = x.items;
        this.isRequesting = false;
        this.errorMsg = null;
      })
      .catch(errorMsg => {
        this.errorMsg = errorMsg;
        this.isRequesting = false;
      });
  }

  toggleOrderDetails(order) {
    if (this.showMap[order.order_no] === undefined) {
      this.showMap[order.order_no] = true;
    } else {
      this.showMap[order.order_no] = !this.showMap[order.order_no];
    }
  }

  canShowOrderDetails(order: Order) {
    return this.showMap[order.order_no] === true;
  }
}
