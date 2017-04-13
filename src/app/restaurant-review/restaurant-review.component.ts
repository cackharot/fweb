import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { StoreService } from 'services/store.service';
import { Restaurant } from 'model/restaurant';

@Component({
  selector: 'app-restaurant-review',
  templateUrl: './restaurant-review.component.html',
})
export class RestaurantReviewComponent implements OnInit {
  restaurant: Restaurant;
  isRequesting = false;
  errorMsg: any;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private storeService: StoreService) {
  }

  ngOnInit() {
    this.route.parent.params
      .switchMap((params: Params) => {
        const id = params['id'];
        this.isRequesting = true;
        return this.storeService.get(id);
      })
      .subscribe(x => {
        this.restaurant = x;
      }, errorMsg => {
        this.errorMsg = errorMsg;
        this.isRequesting = false;
        return errorMsg;
      }, () => {
        this.isRequesting = false;
      });
  }
}
