import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Restaurant } from 'model/restaurant';
import { StoreSearchModel, StoreSearchResponse, StoreService } from 'services/store.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  @Input() responseData: StoreSearchResponse = new StoreSearchResponse();
  @Input() isRequesting: boolean = false;
  @Output() onPaginate = new EventEmitter<string>();

  constructor(
    private router: Router,
    private storeService: StoreService) {
    this.router.events.subscribe(x => {
      window.scroll(0, 0);
    });
  }

  ngOnInit() {
  }

  isEmpty() {
    const items = this.responseData.items;
    return !items || items.length === 0;
  }

  onSelect(restaurant: Restaurant) {
    this.router.navigate(['/restaurant', restaurant._id.$oid]);
  }
}
