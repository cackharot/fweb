import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

import { StoreService, StoreSearchModel, StoreReviewSearchResponse } from 'services/store.service';
import { User, Restaurant, RestaurantReview } from 'model/restaurant';

@Component({
  selector: 'app-restaurant-review',
  templateUrl: './restaurant-review.component.html',
})
export class RestaurantReviewComponent implements OnInit {
  restaurant: Restaurant;
  isRequesting = false;
  submitting = false;
  errorMsg: any;
  model: RestaurantReview;
  responseData: StoreReviewSearchResponse = new StoreReviewSearchResponse();
  search_model = new StoreSearchModel();

  constructor(
    private router: Router,
    private oauthService: OAuthService,
    protected route: ActivatedRoute,
    private storeService: StoreService) {
    this.init();
    this.search_model.page_no = 1;
    this.search_model.page_size = 10;
  }

  load_reviews(searchUrl: string = null) {
    this.isRequesting = true;
    this.storeService.search_reviews(this.restaurant._id, searchUrl, this.search_model)
      .then(x => {
        this.isRequesting = false;
        this.responseData = x;
        this.errorMsg = null;
      })
      .catch(errorMsg => {
        this.isRequesting = false;
        this.errorMsg = errorMsg;
      });
  }

  doPaginate(url: string) {
    this.load_reviews(url);
    return false;
  }

  init() {
    this.model = new RestaurantReview();
    this.model.accurate_order = 0;
    this.model.good_food = 0;
    this.model.on_time_delivery = 0;
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this.model.user = User.of({
        name: claims.given_name,
        email: claims.email,
        picture: claims.picture
      });
    } else {
      this.model.user = new User();
    }
  }

  addReview() {
    this.submitting = true;
    this.storeService.save_review(this.restaurant._id, this.model)
      .then(x => {
        if (this.responseData) {
          this.responseData.items.splice(0, 0, x);
        }
        this.init();
        this.submitting = false;
        this.errorMsg = null;
      })
      .catch(errorMsg => {
        this.errorMsg = errorMsg;
        this.submitting = false;
      });
    return false;
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
        this.errorMsg = null;
        this.load_reviews();
      }, errorMsg => {
        this.errorMsg = errorMsg;
        this.isRequesting = false;
        return errorMsg;
      }, () => {
        this.isRequesting = false;
      });
  }

  valid_review() {
    return this.model.review_text && this.model.review_text.length > 3;
  }

  public isSignedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  get_avg_stars() {
    return this.range(1, this.avg_rating(), 1);
  }

  total_ratings() {
    return this.responseData.items.length;
  }

  avg_rating() {
    const ratings = this.responseData.items.map(x => x.avg_rating());
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length);
  }

  has_half_rating() {
    return this.avg_rating() % 1 !== 0;
  }

  get_rating_percent(attr) {
    const ratings = this.responseData.items.map(x => x[attr]);
    const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length);
    return ((avg / 5.0) * 100).toFixed(0);
  }

  range(min, max, step = 1) {
    step = step || 1;
    const input = [];
    for (let i = min; i <= max; i += step) {
      input.push(i);
    }
    return input;
  };
}
