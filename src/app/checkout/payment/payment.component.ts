import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ViewChild, ElementRef, Renderer } from '@angular/core';
import { LocalStorage, SessionStorage } from 'ng2-webstorage';

import { OrderService } from 'services/order.service';

import { Order, DeliveryDetails, LineItem } from 'model/order';

import { AppConfig } from 'AppConfig';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {

  constructor(
    private router: Router,
    private renderer: Renderer,
    private orderService: OrderService) {
    this.router.events.subscribe(x => {
      window.scroll(0, 0);
    });
  }

  ngOnInit() {
  }
}
