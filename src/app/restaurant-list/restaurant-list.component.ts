import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Control } from '@angular/common';

import { SessionStorage } from 'ng2-webstorage';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { SpinnerComponent } from '../spinner/spinner.component';

import { OrderService } from 'services/order.service';
import { StoreSearchModel, StoreSearchResponse, StoreService } from 'services/store.service';

import { Product } from 'model/product';
import { Restaurant } from 'model/restaurant';
import { FilterModel } from 'model/base';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit, OnDestroy {
  @SessionStorage()
  storeSearchData: StoreSearchModel = new StoreSearchModel();
  responseData: StoreSearchResponse = new StoreSearchResponse();
  isRequesting: boolean = false;
  restaurants: Restaurant[];
  errorMsg: string;
  filter: Subject<FilterModel> = new Subject<FilterModel>();
  sub: Subscription;

  constructor(
    private orderService: OrderService,
    private storeService: StoreService) {
    this.storeSearchData.page_size = 10;
  }

  ngOnInit() {
    this.sub = this.filter
      .delay(50)
      .debounce(() => Observable.interval(750))
      .subscribe(x => {
        this.setSearchData(x);
        this.search();
      });
    this.search();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  setSearchData(filter: FilterModel) {
    this.storeSearchData.searchText = filter.searchText;
    this.storeSearchData.cuisines = [];
    for (const x in this.storeSearchData) {
      const fid = filter.others[x];
      if (filter.others.hasOwnProperty(x)) {
        this.storeSearchData[x] = fid;
      } else if (filter.others[x] === true) {
        this.storeSearchData.cuisines.push(fid);
      }
    }
  }

  search(searchUrl: string = null) {
    this.isRequesting = true;
    const res = this.storeService.search(searchUrl, this.storeSearchData);
    res.then(x => {
      this.errorMsg = null;
      this.responseData = x;
      this.restaurants = x.items;
      this.isRequesting = false;
    }).catch(errMsg => {
      this.errorMsg = errMsg;
      this.restaurants = [];
      this.responseData = new StoreSearchResponse();
      this.isRequesting = false;
    });
  }

  doPaginate(url: string) {
    this.search(url);
    return false;
  }
}
