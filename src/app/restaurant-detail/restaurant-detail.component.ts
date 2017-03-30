import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  categories: Category[];
  products: Product[];
  searchText: string = '';
  onlyVeg: boolean = false;
  isRequesting: boolean = false;
  showList: boolean = true;
  errorMsg: any;
  show_timing_chart: boolean = false;

  constructor(
    private router: Router,
    private zone: NgZone,
    private storeService: StoreService,
    private productService: ProductService,
    private orderService: OrderService,
    private route: ActivatedRoute) {
    this.router.events.subscribe(x => {
      window.scroll(0, 0);
    });
    const mql = window.matchMedia('screen and (max-width: 40em)');
    this.showList = mql.matches;
    mql.addListener(x => {
      zone.run(() => {
        this.showList = x.matches;
      });
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.storeId = id;
    this.isRequesting = true;
    this.storeService.get(id).then(x => {
      this.restaurant = x;
      this.isRequesting = false;
      this.getProducts();
    }).catch(errorMsg => {
      this.errorMsg = errorMsg;
      this.isRequesting = false;
    });
  }

  getProducts() {
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
        this.isRequesting = false;
      }
    }).catch(errorMsg => {
      this.errorMsg = errorMsg;
      this.isRequesting = false;
    });
  }

  addToCart(item: Product) {
    this.orderService.addItem(item);
  }

  goBack(id: string) {
    this.router.navigate([id]);
  }

  filter() {
    this.getProducts();
    return false;
  }
}
