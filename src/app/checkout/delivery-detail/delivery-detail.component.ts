import { Component, Input, Output, OnInit } from '@angular/core';

import { Order, DeliveryDetails, LineItem } from 'model/order';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
})
export class DeliveryDetailComponent implements OnInit {
  @Input()
  order: Order;

  constructor() {
  }

  ngOnInit() {
  }
}
