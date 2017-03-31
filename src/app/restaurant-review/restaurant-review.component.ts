import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StoreService } from 'services/store.service';
import { Restaurant } from 'model/restaurant';

@Component({
  selector: 'app-restaurant-review',
  templateUrl: './restaurant-review.component.html',
})
export class RestaurantReviewComponent implements OnInit {
  @Input()
  restaurant: Restaurant;

  constructor(
    private router: Router,
    private storeService: StoreService) {
  }

  ngOnInit() {
    
  }
}
