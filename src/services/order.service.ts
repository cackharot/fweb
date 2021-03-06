import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Headers, URLSearchParams, Http } from '@angular/http';
import { LocalStorage, SessionStorage } from 'ng2-webstorage';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { Angulartics2 } from 'angulartics2';
import * as _ from 'lodash';

import { ObjectId } from 'model/base';
import { Product, PriceDetail } from 'model/product';
import { Restaurant } from 'model/restaurant';
import { Order, PincodeDetail, LineItem, DeliveryDetails, CouponResult } from 'model/order';
import { AppConfig } from 'AppConfig';

import { OAuthService } from 'angular-oauth2-oidc';

export class MyOrderSearchModel {
  page_no: number = 1;
  page_size: number = 10;

  toUrlSearchParams(): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();
    params.set('page_no', this.page_no.toString());
    params.set('page_size', this.page_size.toString());
    return params;
  }
}

export class MyOrderSearchResult extends MyOrderSearchModel {
  items: Order[];
  total: number;
  next: string;
  previous: string;

  static of(data) {
    if (data === null || data.constructor.name === MyOrderSearchResult.name) {
      return data;
    }
    return new MyOrderSearchResult(data);
  }

  constructor(data = {}) {
    super();
    Object.assign(this, data);
    this.items = this.items.map(x => Order.of(x));
  }
}

@Injectable()
export class OrderService {
  @LocalStorage('order_service_current_order') private currentOrder: Order;
  private itemAddedSource = new Subject<LineItem>();
  private deliveryUpdatedSource = new Subject<DeliveryDetails>();
  private orderConfirmedSource = new Subject<Order>();
  private orderResetedSource = new Subject<Order>();
  private orderUpdatedSource = new Subject<Order>();
  private orderUrl: string = AppConfig.ORDER_URL;

  itemAdded$ = this.itemAddedSource.asObservable();
  orderUpdated$ = this.orderUpdatedSource.asObservable();
  deliveryUpdated$ = this.deliveryUpdatedSource.asObservable();
  orderConfirmed$ = this.orderConfirmedSource.asObservable();
  orderReseted$ = this.orderResetedSource.asObservable();

  constructor(private http: Http,
    private authService: OAuthService,
    private angulartics2: Angulartics2,
    private localSt: LocalStorageService) {
    this.currentOrder = Order.of(this.currentOrder || {});
    this.orderUpdated$.subscribe((x) => {
      this.currentOrder.removeCouponCode();
      this.currentOrder = this.currentOrder;
    });
    this.itemAdded$.subscribe((x) => {
      this.currentOrder.removeCouponCode();
      this.currentOrder = this.currentOrder;
    });
    this.deliveryUpdated$.subscribe((x) => {
      this.currentOrder = this.currentOrder;
    });
  }

  private addLineItem(item: LineItem) {
    this.currentOrder.addItem(item);
    this.itemAddedSource.next(item);
  }

  addItem(item: Product) {
    if (!item.isAvailable()) {
      console.log('Attempt to add not available item' + item);
      return;
    }
    if (item.store.products.length > 0) {
      item.store = new Restaurant(item.store);
    }
    const lineItem = new LineItem({
      product_id: item._id,
      name: item.name,
      store_id: item.store_id,
      store: item.store,
      description: item.description,
      category: item.category,
      vegetarian: item.food_type[0] === 'veg',
      quantity: 1.0,
      price: item.sell_price,
      discount: item.discount,
      price_detail: item.selectedPriceDetail
    });
    this.addLineItem(lineItem);
    this.angulartics2.eventTrack.next({ action: 'additem', properties: { category: 'cart', label: item.name }});
  }

  removeItem(item: LineItem) {
    this.currentOrder.remove(item);
    this.orderUpdatedSource.next(this.currentOrder);
    this.angulartics2.eventTrack.next({ action: 'removeitem', properties: { category: 'cart', label: item.name }});
  }

  updateQuantity(item: LineItem, value: number) {
    if (!item) {
      console.error('requested item to update quantity not found');
      return;
    }
    item.quantity = item.quantity + value;
    if (item.quantity <= 0) {
      this.removeItem(item);
      return;
    }
    this.orderUpdatedSource.next(this.currentOrder);
  }

  updateItemQuantity(product_id: ObjectId, value: number, price_detail: PriceDetail) {
    const item = this.currentOrder.getItemsByProductId(product_id, price_detail);
    this.updateQuantity(item, value);
  }

  updateItemPriceDetail(product_id: ObjectId, value: PriceDetail) {
    const item = this.currentOrder.getItemsByProductId(product_id);
    if (item) {
      item.price_detail = value;
      this.orderUpdatedSource.next(this.currentOrder);
    }
  }

  updateDeliveryDetails(deliveryDetails: DeliveryDetails) {
    this.currentOrder.delivery_details = deliveryDetails;
    this.deliveryUpdatedSource.next(deliveryDetails);
  }

  getOrder() {
    return this.currentOrder;
  }

  newOrder() {
    this.currentOrder = new Order();
    this.orderUpdatedSource.next(this.currentOrder);
    return this.getOrder();
  }

  confirmOrder() {
    // console.log(this.currentOrder);
    return this.http.post(
      `${this.orderUrl}/-1`,
      this.currentOrder,
      {
        headers: this.authHeaders()
      })
      .toPromise()
      .then(response => {
        const orderJson = response.json();
        // console.log(orderJson);
        const updatedOrder = Order.of(orderJson.data);
        const stores = this.currentOrder.getStores();
        updatedOrder.items.forEach(item => {
          item.store = stores.find(x => _.isEqual(x._id, item.store_id));
        });

        this.currentOrder = updatedOrder;
        this.orderConfirmedSource.next(this.currentOrder);
        return updatedOrder;
      })
      .catch(this.handleError);
  }

  resetOrder() {
    console.log('Resetting current order');
    this.currentOrder = null;
    this.orderResetedSource.next(this.currentOrder);
    console.log(this.currentOrder);
  }

  cancelOrder() {
    this.resetOrder();
  }

  verifyOtp(otp: string, new_number: string) {
    const data = { 'cmd': 'VERIFY_OTP', 'otp': otp, 'order_id': this.currentOrder._id, 'number': new_number };
    return this.http.put(
      `${this.orderUrl}/-1`,
      data,
      {
        headers: this.authHeaders()
      })
      .toPromise()
      .then(response => {
        const res = response.json();
        // console.log(res);
        return res;
      })
      .catch(this.handleError);
  }

  resendOtp(new_number: string) {
    const data = { 'cmd': 'RESEND_OTP', 'order_id': this.currentOrder._id, 'number': new_number };
    return this.http.put(
      `${this.orderUrl}/-1`, data,
      {
        headers: this.authHeaders()
      })
      .toPromise()
      .then(response => {
        const res = response.json();
        // console.log(res);
        return res;
      })
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    if (error.json === undefined) {
      return Promise.reject(error);
    }
    return Promise.reject(error.json().message);
  }

  loadOrder(orderNo: string): Promise<Order> {
    return this.http.get(
      `${AppConfig.TRACK_URL}/${orderNo}`,
      {
        headers: this.authHeaders()
      })
      .toPromise()
      .then(response => {
        const data = response.json();
        const order = Order.of(data);
        if (!order.order_no || order.order_no.length === 0) {
          return null;
        }
        return order;
      })
      .catch(this.handleError);
  }

  reloadOrder(order_no: string): Promise<Order> {
    if (order_no === undefined || order_no.length === 0) {
      return Promise.reject<Order>('Invalid order');
    }
    return this.http.get(
      `${AppConfig.TRACK_URL}/${order_no}`,
      {
        headers: this.authHeaders()
      })
      .toPromise()
      .then(response => {
        const data = response.json();
        const order = Order.of(data);
        if (!order.order_no || order.order_no.length === 0) {
          return null;
        }
        return order;
      })
      .catch(this.handleError);
  }

  fetchAvailablePincodes() {
    return this.http.get(
      `${AppConfig.PINCODE_URL}`,
      {
        headers: this.authHeaders()
      })
      .toPromise()
      .then(response => {
        const data = response.json();
        const items = data.map(x => PincodeDetail.of(x));
        return items;
      })
      .catch(this.handleError);
  }

  public getMyOrders(searchUrl: string, searchData: MyOrderSearchModel): Promise<MyOrderSearchResult> {
    const headers = {
      headers: this.authHeaders()
    };
    if (searchUrl === null || searchUrl.length === 0) {
      searchUrl = AppConfig.MY_ORDERS_URL;
      headers['search'] = searchData.toUrlSearchParams();
    } else {
      searchUrl = AppConfig.getBaseHost() + searchUrl;
    }

    return this.http.get(searchUrl, headers)
      .toPromise()
      .then(response => {
        const data = response.json();
        const result = MyOrderSearchResult.of(data);
        return result;
      })
      .catch(this.handleError);
  }

  public applyCoupon(tempOrder: Order, couponCode: string): Promise<Order> {
    const headers = {
      headers: this.authHeaders()
    };
    const url = AppConfig.VALIDATE_COUPON_URL;
    const order = Object.assign({}, tempOrder);
    order.coupon_code = couponCode;
    return this.http.post(url, order, headers)
      .toPromise()
      .then(response => {
        const data = response.json();
        const result = CouponResult.of(data);
        if (result && result.coupon_code) {
          this.currentOrder.updateCouponCode(result.coupon_code, result.amount);
          this.currentOrder = this.currentOrder;
        } else {
          throw Error('Invalid coupon code');
        }
        return this.currentOrder;
      })
      .catch(this.handleError);
  }

  removeCoupon() {
    this.currentOrder.coupon_code = '';
    this.currentOrder.coupon_discount = 0;
    this.orderUpdatedSource.next(this.currentOrder);
  }

  private authHeaders(): Headers {
    const authHeaders = new Headers();
    if (this.authService.hasValidIdToken()) {
      authHeaders.set('Authorization', 'Bearer ' + this.authService.getIdToken());
    }
    return authHeaders;
  }
}
