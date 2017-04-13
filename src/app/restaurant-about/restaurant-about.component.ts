import { Component, ViewChild, Input, NgZone, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { StoreService } from 'services/store.service';
import { ProductService } from 'services/product.service';
import { OrderService } from 'services/order.service';

import { Restaurant } from 'model/restaurant';

import { MapsAPILoader, SebmGoogleMap } from 'angular2-google-maps/core';

@Component({
  selector: 'app-restaurant-about',
  templateUrl: './restaurant-about.component.html',
  styleUrls: ['./restaurant-about.component.scss']
})
export class RestaurantAboutComponent implements OnInit {
  restaurant: Restaurant;
  @ViewChild('gmap') gmap: SebmGoogleMap;
  zoom = 17;
  shop_lat: number = 11.2;
  shop_lng: number = 79.9;
  geocoder: google.maps.Geocoder;
  isRequesting = false;
  errorMsg: any;

  constructor(
    protected router: Router,
    protected zone: NgZone,
    protected storeService: StoreService,
    protected productService: ProductService,
    protected orderService: OrderService,
    protected mapLoad: MapsAPILoader,
    protected route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.parent.params
      .switchMap((params: Params) => {
        const id = params['id'];
        this.isRequesting = true;
        return this.storeService.get(id);
      })
      .subscribe(x => {
        this.restaurant = x;
        this.loadMaps(x);
      }, errorMsg => {
        this.errorMsg = errorMsg;
        this.isRequesting = false;
        return errorMsg;
      }, () => {
        this.isRequesting = false;
      });
  }

  loadMaps(restaurant: Restaurant) {
    this.mapLoad.load().then(() => {
      try {
        this.geocoder = new google.maps.Geocoder();
        this.geocodeAddress(restaurant);
      } catch (e) {
        console.log(e);
      }
    });
  }

  geocodeAddress(restaurant) {
    const address = `${restaurant.name}, ${restaurant.address}`;
    this.geocoder.geocode({ 'address': address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log(address, results, this.gmap);
        const loc = results[0].geometry.location;
        this.shop_lat = loc.lat();
        this.shop_lng = loc.lng();
        this.gmap.triggerResize().then(() => {
          console.log(this.shop_lat, this.shop_lng);
        });
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  mapClicked($event: MouseEvent) {
    console.log($event);
    // this.markers.push({
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng
    // });
  }
}
