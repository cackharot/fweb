import { Component, OnInit, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ViewChild, ElementRef, Renderer } from '@angular/core';
import { LocalStorage, SessionStorage } from 'ng2-webstorage';

import { OrderService } from 'services/order.service';

import { Order, DeliveryDetails, LineItem } from 'model/order';

import { AppConfig } from 'AppConfig';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() order: Order;

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

  setPaymentType(payment_type: string) {
    this.order.payment_type = payment_type;
  }
}
