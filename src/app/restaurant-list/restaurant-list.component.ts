import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit {

  @SessionStorage()
  searchData: StoreSearchModel = new StoreSearchModel();
  responseData: StoreSearchResponse = new StoreSearchResponse();
  // searchCtrl: Control = new Control('');
  searchCtrl = '';
  isRequesting: boolean = false;
  restaurants: Restaurant[];
  errorMsg: string;


  constructor(
    private orderService: OrderService,
    private storeService: StoreService) {
    this.searchData.page_size = 10;
  }

  ngOnInit() {
    // this.searchCtrl.valueChanges
    //   .debounceTime(600)
    //   .distinctUntilChanged()
    //   .subscribe(term => {
    //     this.searchData.searchText = term ? term.trim() : '';
    //     this.search();
    //   });
    this.search();
  }

  search(searchUrl: string = null) {
    this.isRequesting = true;
    let res: Promise<StoreSearchResponse>;
    if (searchUrl) {
      res = this.storeService.search(searchUrl, this.searchData);
    } else {
      res = this.storeService.search(searchUrl, this.searchData)
    }
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
}
