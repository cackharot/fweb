import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { StoreService } from 'services/store.service';
import { ProductService } from 'services/product.service';
import { OrderService } from 'services/order.service';
import { Restaurant } from 'model/restaurant';

import { Product, Category } from 'model/product';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
})
export class RestaurantDetailComponent implements OnInit {
  storeId: string;
  restaurant: Restaurant;
  isRequesting: boolean = false;
  errorMsg: any;
  storeRequest: Promise<Restaurant>;

  constructor(
    protected router: Router,
    protected zone: NgZone,
    protected storeService: StoreService,
    protected productService: ProductService,
    protected orderService: OrderService,
    protected route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => {
        this.storeId = params['id'];
        return this.loadStore(this.storeId);
      })
      .subscribe(x => this.restaurant = x);
  }

  loadStore(id: string = null): Promise<Restaurant> {
    if (this.isRequesting) {
      console.log('Already store request in progress');
      return this.storeRequest;
    }
    this.isRequesting = true;
    this.storeRequest = this.storeService.get(id || this.storeId).then(x => {
      this.restaurant = x;
      this.isRequesting = false;
      return x;
    }).catch(errorMsg => {
      this.errorMsg = errorMsg;
      this.isRequesting = false;
      return errorMsg;
    });
    return this.storeRequest;
  }
}
