export class AppConfig {
  static getBaseUrl = function() {
    return AppConfig.getBaseHost() + '/api';
  };
  static getPaymentUrl() {
    return AppConfig.getBaseUrl() + '/payment/order';
  }

  static BASE_URL: string = AppConfig.getBaseUrl();
  static STORES_URL: string = AppConfig.BASE_URL + '/stores';
  static STORE_URL: string = AppConfig.BASE_URL + '/store';
  static PRODUCTS_URL: string = AppConfig.BASE_URL + '/products';
  static PRODUCT_URL: string = AppConfig.BASE_URL + '/product';
  static POPULAR_DISHES_URL: string = AppConfig.BASE_URL + '/popular_items';
  static POPULAR_STORES_URL: string = AppConfig.BASE_URL + '/popular_stores';
  static ORDER_URL: string = AppConfig.BASE_URL + '/order';
  static TRACK_URL: string = AppConfig.BASE_URL + '/track';
  static PINCODE_URL: string = AppConfig.BASE_URL + '/pincodes';
  static MY_ORDERS_URL: string = AppConfig.BASE_URL + '/my_orders';
  static VALIDATE_COUPON_URL: string = AppConfig.BASE_URL + '/validate/coupon';

  static ONLINE_PAYMENT_POST_URL: string = AppConfig.getPaymentUrl();


  static getBaseHost(): string {
    const host = window.location.hostname,
      port = window.location.port,
      scheme = window.location.protocol;
    if (AppConfig.isLocalEnv()) {
      return 'http://localhost:4000';
    } else {
      return scheme + '//' + host + ':' + port;
    }
  }

  static isLocalEnv(): boolean {
    return (window.location.host.match(/localhost/)) !== null;
  }

  static getProductImage(image_url: string): string {
    return AppConfig.getBaseHost() + '/static/images/products/' + image_url;
  }

  static getRestaurantImage(image_url: string): string {
    return AppConfig.getBaseHost() + '/static/images/stores/' + image_url;
  }
}
