import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LocalStorage, SessionStorage } from 'ng2-webstorage';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ProductSearchModel, ProductService } from 'services/product.service';
import { OrderService } from 'services/order.service';
import { Restaurant } from 'model/restaurant';

import { Product, Category } from 'model/product';

import { StoreSearchModel, StoreSearchResponse, StoreService } from 'services/store.service';
import { FilterModel } from 'model/base';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  isRequesting: boolean = false;
  storeSearchData: StoreSearchModel = new StoreSearchModel();
  storeSearchResponse: StoreSearchResponse = new StoreSearchResponse();
  products: Product[];
  errorMsg: string;
  filter: Subject<FilterModel> = new Subject<FilterModel>();
  sub: Subscription;

  constructor(
    protected router: Router,
    protected storeService: StoreService,
    protected productService: ProductService,
    protected orderService: OrderService,
    protected route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.filter
      .delay(50)
      .debounce(() => Observable.interval(750))
      .subscribe(x => this.doSearch(x));
    this.route.params
      .switchMap((params: Params) => {
        return Promise.resolve(new FilterModel(params['q']));
      }).subscribe(x => this.filter.next(x));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  doSearch(filter: FilterModel): Promise<StoreSearchResponse> {
    this.storeSearchData.searchText = filter.searchText;
    this.storeSearchData.cuisines = [];
    for (const x in this.storeSearchData) {
      if (filter.features.hasOwnProperty(x)) {
        this.storeSearchData[x] = filter.features[x];
      }
    }

    for (const x in filter.cuisines) {
      if (filter.cuisines.hasOwnProperty(x) && filter.cuisines[x] === true) {
        this.storeSearchData.cuisines.push(x);
      }
    }
    this.isRequesting = true;
    console.log('searching for', this.storeSearchData);
    return this.searchRestaurants();
  }

  searchRestaurants(searchUrl: string = null) {
    const res = this.storeService.search(searchUrl, this.storeSearchData);
    res.then(x => {
      this.errorMsg = null;
      this.storeSearchResponse = x;
      this.isRequesting = false;
    }).catch(errMsg => {
      this.errorMsg = errMsg;
      this.storeSearchResponse = new StoreSearchResponse();
      this.isRequesting = false;
    });
    return res;
  }
}
