import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { LocalStorage, SessionStorage } from 'ng2-webstorage';
import { Router } from '@angular/router';

import { Order, DeliveryDetails, LineItem } from 'model/order';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
})
export class DeliveryDetailComponent implements OnInit, OnDestroy {
  @Input()
  order: Order;
  @Output()
  nextStepSource: EventEmitter<string> = new EventEmitter<string>();
  @LocalStorage() speedCheckout: boolean;
  editAddress = false;

  constructor(private router: Router) {
    this.router.events.subscribe(x => {
      window.scroll(0, 0);
    });
  }

  ngOnInit() {
    this.editAddress = !this.speedCheckout;
    this.restoreDeliveryDetails();
  }

  ngOnDestroy() {
    this.saveDeliveryDetails();
  }

  private saveDeliveryDetails() {
    if (this.speedCheckout === false) {
      localStorage.setItem('delivery_details', null);
      return;
    }
    try {
      const value = JSON.stringify(this.order.delivery_details);
      localStorage.setItem('delivery_details', value);
    } catch (e) {
      console.error(e);
    }
  }

  private restoreDeliveryDetails() {
    if (this.speedCheckout === false) {
      return;
    }
    try {
      const value = JSON.parse(localStorage.getItem('delivery_details'));
      if (value && value.name && value.name.length > 1) {
        this.order.delivery_details = DeliveryDetails.of(value);
        // console.log('updated order delivery details');
      }
    } catch (e) {
      console.error(e);
    }
  }
}
