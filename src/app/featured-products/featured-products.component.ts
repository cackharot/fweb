import { Component, OnInit } from '@angular/core';

import { Product } from 'model/product';

import { OrderService } from 'services/order.service';
import { StoreSearchModel, StoreSearchResponse, StoreService } from 'services/store.service';
import { ProductSearchModel, ProductService } from 'services/product.service';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css']
})
export class FeaturedProductsComponent implements OnInit {
  popular_dishes: Product[] = [];
  isRequesting: boolean = false;
  errorMsg: string;

  constructor(
    private orderService: OrderService,
    private productService: ProductService) {

  }

  ngOnInit() {
    this.searchPopularDishes();
  }

  addToCart(item: Product) {
    this.orderService.addItem(item);
  }

  searchPopularDishes() {
    if (this.popular_dishes.length > 0) {
      return;
    }
    this.isRequesting = true;
    this.productService.getPopularDishes()
      .then(x => {
        this.errorMsg = null;
        this.popular_dishes = x;
        this.isRequesting = false;
      })
      .catch(errMsg => {
        this.errorMsg = errMsg;
        this.isRequesting = false;
      });
  }
}
