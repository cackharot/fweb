import { Injectable } from '@angular/core';
import { Headers, URLSearchParams, Http, Response } from '@angular/http';
import { OAuthService } from 'angular-oauth2-oidc';

import { AppConfig } from '../AppConfig';

import 'rxjs/add/operator/toPromise';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { RestaurantReview, Restaurant } from 'model/restaurant';
import { ObjectId } from 'model/base';

export class StoreSearchModel {
  searchText: string;
  onlyVeg: boolean = false;
  onlyOpen: boolean = false;
  onlyNew: boolean = false;
  userPincode: number;
  userLocation: string;
  sort_by: string = 'Rating';
  sort_direction: string = 'ASC';
  page_no: number = 1;
  page_size: number = 100;
  store_ids: string[];
  cuisines: string[];

  constructor(
    searchText: string = '',
    onlyVeg: boolean = false,
    onlyOpen: boolean = false,
    userLocation: string = '',
    userPincode: string = '',
    page_no: number = 1,
    page_size: number = 100) {
    this.searchText = searchText;
    this.onlyVeg = onlyVeg;
    this.onlyOpen = onlyOpen;
    this.userLocation = userLocation;
    this.userPincode = +userPincode;
    this.page_no = page_no;
    this.page_size = page_size;
    this.store_ids = [];
    this.cuisines = [];
  }
}

export class StoreSearchResponse extends StoreSearchModel {
  items: Restaurant[] = [];
  total: number;
  previous: string;
  next: string;

  static of(data): StoreSearchResponse {
    if (data === null || data.constructor.name === StoreSearchResponse.name) {
      return data;
    }
    return new StoreSearchResponse(data);
  }

  constructor(data = {}) {
    super();
    Object.assign(this, data);
    if (this.items && this.items.length > 0) {
      this.items = this.items.map(x => Restaurant.of(x));
    }
  }
}

export class StoreReviewSearchResponse extends StoreSearchModel {
  items: RestaurantReview[] = [];
  total: number;
  previous: string;
  next: string;

  static of(data): StoreReviewSearchResponse {
    if (data === null || data.constructor.name === StoreSearchResponse.name) {
      return data;
    }
    return new StoreReviewSearchResponse(data);
  }

  constructor(data = {}) {
    super();
    Object.assign(this, data);
    if (this.items && this.items.length > 0) {
      this.items = this.items.map(x => RestaurantReview.of(x));
    }
  }
}

@Injectable()
export class StoreService {
  private storesUrl = AppConfig.STORES_URL;
  private storeUrl = AppConfig.STORE_URL;
  private storeReviewUrl = AppConfig.STORE_REVIEW_URL;

  constructor(private http: Http, private authService: OAuthService, ) { }

  search(searchUrl: string, data: StoreSearchModel): Promise<StoreSearchResponse> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('filter_text', data.searchText);
    params.set('store_ids', data.store_ids.join(','));
    params.set('cuisines', data.cuisines.join(','));
    params.set('only_veg', data.onlyVeg.toString());
    params.set('only_open', data.onlyOpen.toString());
    params.set('only_new', data.onlyNew.toString());
    params.set('user_location', data.userLocation);
    params.set('user_pincode', data.userPincode.toString());
    params.set('sort_by', data.sort_by);
    params.set('sort_direction', data.sort_direction);
    params.set('page_no', data.page_no.toString());
    params.set('page_size', data.page_size.toString());

    if (!searchUrl || searchUrl.length === 0) {
      searchUrl = this.storesUrl;
    }

    if (!searchUrl.startsWith('http')) {
      searchUrl = AppConfig.getBaseHost() + searchUrl;
    }

    return this.http.get(searchUrl, { search: params })
      .toPromise()
      .then(response => {
        const storeResponse = response.json();
        const result = StoreSearchResponse.of(storeResponse);
        return result;
      })
      .catch(this.handleError);
  }

  get(id): Promise<Restaurant> {
    return this.http.get(`${this.storeUrl}/${id}`)
      .toPromise()
      .then(response => Restaurant.of(response.json()))
      .catch(this.handleError);
  }

  getPopularStores(): Promise<Restaurant[]> {
    return this.http.get(AppConfig.POPULAR_STORES_URL + '/-1')
      .toPromise()
      .then(response => {
        const data = response.json();
        return data.items.map(x => Restaurant.of(x));
      })
      .catch(this.handleError);
  }

  getCuisines(): Promise<string[]> {
    return this.http.get(`${this.storesUrl}/cuisines`)
      .toPromise()
      .then(response => {
        const data: string[] = response.json().data;
        return data;
      })
      .catch(this.handleError);
  }

  search_reviews(store_id: ObjectId, searchUrl: string, data: StoreSearchModel): Promise<StoreReviewSearchResponse> {
    const params: URLSearchParams = new URLSearchParams();
    // params.set('sort_by', data.sort_by);
    // params.set('sort_direction', data.sort_direction);

    if (!searchUrl || searchUrl.length === 0) {
      searchUrl = `${this.storeUrl}/${store_id.str()}/review`;
      params.set('page_no', data.page_no.toString());
      params.set('page_size', data.page_size.toString());
    }

    if (!searchUrl.startsWith('http')) {
      searchUrl = AppConfig.getBaseHost() + searchUrl;
    }

    return this.http.get(searchUrl, { search: params })
      .toPromise()
      .then(response => {
        return StoreReviewSearchResponse.of(response.json());
      })
      .catch(this.handleError);
  }


  save_review(store_id: ObjectId, review: RestaurantReview): Promise<RestaurantReview> {
    const headers = {
      headers: this.authHeaders()
    };
    review.store_id = store_id;
    return this.http.post(`${this.storeUrl}/${store_id.str()}/review`, review, headers)
      .toPromise()
      .then(response => {
        return RestaurantReview.of(response.json().data);
      })
      .catch(this.handleError);
  }

  private authHeaders(): Headers {
    const authHeaders = new Headers();
    if (this.authService.hasValidIdToken()) {
      authHeaders.set('Authorization', 'Bearer ' + this.authService.getIdToken());
    }
    return authHeaders;
  }

  private handleError(error: Response): Promise<any> {
    console.error('An error occurred', error.json());
    const res = error.json().message || error;
    return Promise.reject(res);
  }
}
