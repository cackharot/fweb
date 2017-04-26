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
  selector: 'app-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
})
export class RestaurantMenuComponent implements OnInit {
  storeId: string;
  categories: Category[];
  products: Product[];
  searchText: string = '';
  onlyVeg: boolean = false;
  isRequesting: boolean = false;
  errorMsg: any;

  constructor(
    private router: Router,
    private zone: NgZone,
    private storeService: StoreService,
    private productService: ProductService,
    private orderService: OrderService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.parent.params
      .switchMap((params: Params) => {
        this.storeId = params['id'];
        this.getProducts();
        return Promise.resolve(true);
      }).subscribe(x => {
      });
  }

  getProducts() {
    this.isRequesting = true;
    this.productService.search(this.storeId, this.searchText).then(items => {
      this.products = items;
      this.categories = [];
      if (this.onlyVeg) {
        this.products = this.products.filter(x => x.isVeg());
      }
      for (let i = 0; i < this.products.length; ++i) {
        const item = this.products[i];
        const category = this.categories.find(c => c.name === item.category);
        if (category === undefined) {
          const c = new Category({ name: item.category });
          c.addProduct(item);
          this.categories.push(c);
        } else {
          category.addProduct(item);
        }
      }
      this.isRequesting = false;
    }).catch(errorMsg => {
      this.errorMsg = errorMsg;
      this.isRequesting = false;
    });
  }

  addToCart(item: Product) {
    this.orderService.addItem(item);
  }

  filter() {
    this.getProducts();
    return false;
  }
}
