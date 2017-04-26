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
  reviewResponse: StoreReviewSearchResponse = new StoreReviewSearchResponse();

  constructor(
    private router: Router,
    private oauthService: OAuthService,
    protected route: ActivatedRoute,
    private storeService: StoreService) {
    this.init();
  }

  load_reviews() {
    this.isRequesting = true;
    const search_model = new StoreSearchModel();
    this.storeService.search_reviews(this.restaurant._id, null, search_model)
      .then(x => {
        this.isRequesting = false;
        this.reviewResponse = x;
        this.errorMsg = null;
      })
      .catch(errorMsg => {
        this.isRequesting = false;
        this.errorMsg = errorMsg;
      });
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
        if (this.reviewResponse) {
          this.reviewResponse.items.push(this.model);
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
    return this.reviewResponse.items.length;
  }

  avg_rating() {
    const ratings = this.reviewResponse.items.map(x => x.avg_rating());
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length);
  }

  has_half_rating() {
    return this.avg_rating() % 1 !== 0;
  }

  get_rating_percent(attr) {
    const ratings = this.reviewResponse.items.map(x => x[attr]);
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
