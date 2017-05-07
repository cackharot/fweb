import { Component, OnInit } from '@angular/core';

import { Restaurant } from 'model/restaurant';

import { OrderService } from 'services/order.service';
import { StoreSearchModel, StoreSearchResponse, StoreService } from 'services/store.service';

@Component({
  selector: 'app-featured-restaurants',
  templateUrl: './popular-restaurant.component.html',
  styleUrls: ['./popular-restaurant.component.scss']
})
export class PopularRestaurantComponent implements OnInit {
  items: Restaurant[] = [];
  isRequesting: boolean = false;
  errorMsg: string;

  constructor(
    private orderService: OrderService,
    private storeService: StoreService) {

  }

  ngOnInit() {
    this.searchPopularStores();
  }


  searchPopularStores() {
    if (this.items.length > 0) {
      return;
    }
    this.isRequesting = true;
    this.storeService.getPopularStores()
      .then(x => {
        this.errorMsg = null;
        this.items = x;
        this.isRequesting = false;
      })
      .catch(errMsg => {
        this.errorMsg = errMsg;
        this.isRequesting = false;
      });
  }
}
