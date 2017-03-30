import { Injectable } from '@angular/core';
import { URLSearchParams, Http } from '@angular/http';

import { Product } from '../model/product';
import { AppConfig } from '../AppConfig';

import 'rxjs/add/operator/toPromise';

export class ProductSearchModel {
  searchText: string;
  onlyVeg: boolean = false;
  category: string;
  sortBy: string = 'Rating';
  sortDirection: string = 'ASC';
  pageNo: number = 1;
  pageSize: number = 100;

  constructor(
    searchText: string = null,
    onlyVeg: boolean = false,
    category: string = '',
    pageNo: number = 1,
    pageSize: number = 100) {
    this.searchText = searchText;
    this.category = category;
    this.onlyVeg = onlyVeg;
    this.pageNo = pageNo;
    this.pageSize = pageSize;
  }
}

@Injectable()
export class ProductService {
  private productsUrl = AppConfig.PRODUCTS_URL;
  private productUrl = AppConfig.PRODUCT_URL;
  private popularDishesUrl = AppConfig.POPULAR_DISHES_URL;

  constructor(private http: Http) { }

  searchAll(data: ProductSearchModel): Promise<Product[]> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('filter_text', data.searchText);
    params.set('only_veg', data.onlyVeg.toString());
    params.set('sort_by', data.sortBy);
    params.set('sort_direction', data.sortDirection);
    params.set('page_no', data.pageNo.toString());
    params.set('page_size', data.pageSize.toString());

    return this.http.get(
      `${this.productsUrl}/-1`,
      {
        search: params
      })
      .toPromise()
      .then(response => {
        const items = response.json().items;
        const products = items.map(x => Product.of(x));
        return products;
      })
      .catch(this.handleError);
  }

  search(store_id, searchText = ''): Promise<Product[]> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('page_no', '1');
    params.set('page_size', '200');
    params.set('filter_text', searchText);

    return this.http.get(`${this.productsUrl}/${store_id}`, { search: params })
      .toPromise()
      .then(response => {
        const items = response.json().items;
        const products = items.map(x => Product.of(x));
        return products;
      })
      .catch(this.handleError);
  }

  getPopularDishes(): Promise<Product[]> {
    return this.http.get(`${this.popularDishesUrl}/-1`)
      .toPromise()
      .then(response => {
        const items = response.json().items;
        let products: Product[] = items.map(x => Product.of(x));
        products = products.sort((a, b) => { return a.no > b.no ? 1 : 0; });
        return products;
      })
      .catch(this.handleError);
  }

  get(store_id, id): Promise<Product> {
    return this.http.get(`${this.productUrl}/${store_id}/${id}`)
      .toPromise()
      .then(response => Product.of(response.json()))
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
