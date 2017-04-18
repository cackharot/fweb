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
  isRequesting: boolean = true;
  storeSearchData: StoreSearchModel = new StoreSearchModel();
  storeSearchResponse: StoreSearchResponse = new StoreSearchResponse();
  productSearchData = new ProductSearchModel();
  products: Product[];
  errorMsg: string;
  filter: Subject<FilterModel> = new Subject<FilterModel>();
  sub: Subscription;
  searchSub: Subscription;

  constructor(
    protected router: Router,
    protected storeService: StoreService,
    protected productService: ProductService,
    protected orderService: OrderService,
    protected route: ActivatedRoute) {
    this.storeSearchData.page_size = 10;
    this.productSearchData.pageSize = 10;
  }

  ngOnInit() {
    this.sub = this.filter
      .delay(50)
      .debounce(() => Observable.interval(750))
      .subscribe(x => {
        if (this.searchSub && !this.searchSub.closed) {
          this.searchSub.unsubscribe();
        }
        this.isRequesting = true;
        this.searchSub = this.doSearch(x).subscribe(
          res => {
            console.log(res);
            this.storeSearchResponse = res[0];
            this.products = res[1];
            this.addProductsResultToStore();
          }, err => {
            console.log(err);
            this.errorMsg = err;
          }, () => {
            this.isRequesting = false;
          });
      });
    this.route.params
      .switchMap((params: Params) => {
        return Promise.resolve(new FilterModel(params['q']));
      }).subscribe(x => this.filter.next(x));
  }

  ngOnDestroy() {
    if (this.sub && !this.sub.closed) {
      this.sub.unsubscribe();
    }
    if (this.searchSub && !this.searchSub.closed) {
      this.searchSub.unsubscribe();
    }
  }

  doSearch(filter: FilterModel): Observable<[StoreSearchResponse, Product[]]> {
    this.storeSearchData.searchText = filter.searchText;
    this.productSearchData.searchText = filter.searchText;
    this.applyFilterData(filter);

    const res = Observable.forkJoin(
      this.storeService.search(null, this.storeSearchData),
      this.productService.searchAll(this.productSearchData));
    return res;
  }

  applyFilterData(filter: FilterModel) {
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
  }

  searchRestaurants(searchUrl: string = null): Promise<StoreSearchResponse> {
    // console.log('searching store for', this.storeSearchData);
    return this.storeService.search(searchUrl, this.storeSearchData);
  }

  searchProducts(): Promise<Product[]> {
    // console.log('searching dishes for', this.productSearchData);
    return this.productService.searchAll(this.productSearchData);
  }

  addProductsResultToStore() {
    this.products.forEach(x => {
      const stores = this.storeSearchResponse.items;
      const exStore = stores.filter(r => x.store_id.$oid === r._id.$oid);
      console.log(exStore);
      if (exStore.length === 0) {
        x.store.products.push(x);
        stores.push(x.store);
      } else {
        exStore[0].products.push(x);
      }
    });
  }
}
