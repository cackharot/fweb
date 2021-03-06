import { ObjectId, Date } from './base';
import * as moment from 'moment';

import { AppConfig } from '../AppConfig';
import { Product } from './product';

export class StoreTiming {
  day: string;
  time: string;
  fmt_time: string;

  static of(data) {
    if (data && data.constructor.name !== StoreTiming.name) {
      return new StoreTiming(data);
    }
    return data;
  }

  constructor(data: any = {}) {
    Object.assign(this, data);
    this.day = this.day;
    this.time = this.time;
    this.fmt_time = this._formatTime();
  }

  getDay() {
    return this.day;
  }

  getTimes() {
    const tstr = this.time.split(',');
    const res = tstr.map(x => {
      const t = x.split('-');
      return { 'open_time': Number.parseFloat(t[0]), 'close_time': Number.parseFloat(t[1]) };
    });
    return res;
  }

  getFormattedTime() {
    return this.fmt_time;
  }

  _formatTime() {
    const tstr = this.time.split(',');
    const formatted_time_array = tstr.map(x => {
      const t = x.split('-');
      return `${this._doFmt(Number.parseFloat(t[0]))} to ${this._doFmt(Number.parseFloat(t[1]))}`;
    });
    return formatted_time_array.join(', ');
  }

  isOpen() {
    const hr = moment().hour() + (moment().minute() / 60);
    const t = this.getTimes();
    for (let i = 0; i < t.length; ++i) {
      const x = t[i];
      if (hr >= x.open_time && hr <= x.close_time) {
        return true;
      }
    }
    return false;
  }

  _doFmt(time_val: number): string {
    if (time_val < 12) {
      return time_val.toFixed(0) + ' AM';
    } else if (time_val === 12) {
      return time_val.toFixed(0) + ' NOON';
    } else if (time_val === 24) {
      return '00 AM';
    } else {
      return (time_val - 12).toFixed(0) + ' PM';
    }
  }
}

export class Restaurant {
  _id: ObjectId = new ObjectId();
  cuisines: string[];
  deliver_time: number;
  phone: string;
  open_time: number;
  close_time: number;
  rating: number = 0.0;
  holidays: string[] = [];
  timings_table: StoreTiming[];
  is_closed: boolean = false;
  tenant_id: ObjectId = new ObjectId();
  created_at: Date;
  food_type: string[];
  address: string;
  name: string;
  status: boolean;
  image_url: string = null;
  day_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  products: Product[] = [];

  static of(data) {
    if (data && data.constructor.name !== Restaurant.name) {
      return new Restaurant(data);
    }
    return data;
  }

  constructor(data: any = {}) {
    Object.assign(this, data);
    this._id = ObjectId.of(this._id);
    this.products = [];
    if (data.timings_table && data.timings_table.length > 0) {
      this.timings_table = data.timings_table.map(x => StoreTiming.of(x));
    }
  }

  getId() {
    return this._id.$oid;
  }

  getTenantId() {
    return this.tenant_id.$oid;
  }

  getCreatedAt() {
    return this.created_at.$date;
  }

  isOpen() {
    return !this.is_closed && this.getTodayStoreTimings().isOpen();
  }

  isClosed() {
    return !this.isOpen();
  }

  isHoliday() {
    const weekday = this.getTodayDayname();
    return this.holidays.some(x => x.toLocaleLowerCase().localeCompare(weekday) === 0);
  }

  getRating() {
    return this.rating === 0 ? '--' : this.rating.toFixed(1);
  }

  getImage() {
    if (!this.image_url) {
      return null;
    }
    return AppConfig.getRestaurantImage(this.image_url);
  }

  getTodayDayname() {
    return this.day_names[moment().weekday()];
  }

  hasTimingTable(): boolean {
    return this.timings_table && this.timings_table.length > 0;
  }

  getTodayStoreTimings(): StoreTiming {
    const day = this.getTodayDayname();
    if (this.hasTimingTable()) {
      return this.timings_table.filter(x => x.day.toLocaleLowerCase() === day.toLocaleLowerCase())[0];
    }
    return new StoreTiming({ 'day': day, 'time': this.open_time + '-' + this.close_time });
  }

  getFormattedCuisines(): string {
    const cstr = this.cuisines.join(', ');
    return cstr;
  }

  getFormattedDeliveryTime() {
    return `${this.deliver_time} - ${this.deliver_time + 10}`;
  }

  isVeg() {
    return this.food_type.indexOf('Veg');
  }

  isNew() {
    try {
      const sdt = moment(this.created_at.$date);
      const cmpdt = moment().subtract(90, 'days');
      return sdt.isAfter(cmpdt);
    } catch (e) {
      console.log(e);
    }
    return false;
  }
}

export class RestaurantReview {
  _id: ObjectId;
  store_id: ObjectId;
  review_text: string;
  good_food: number;
  on_time_delivery: number;
  accurate_order: number;
  created_at: Date;
  user: User;

  static of(data) {
    if (data && data.constructor.name !== RestaurantReview.name) {
      return new RestaurantReview(data);
    }
    return data;
  }

  constructor(data: any = {}) {
    Object.assign(this, data);
    this._id = ObjectId.of(this._id);
    this.user = User.of(this.user);
    this.created_at = Date.of(this.created_at);
  }

  get_moment_ago() {
    return moment(this.created_at.getValue()).format('dddd, MMMM Do YYYY');
  }

  get_stars() {
    return this.range(1, this.avg_rating(), 1);
  }

  avg_rating() {
    const ratings = [this.on_time_delivery, this.accurate_order, this.good_food];
    return (ratings.reduce((a, b) => a + b, 1) / ratings.length);
  }

  has_half_rating() {
    return this.avg_rating() % 1 !== 0;
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

export class User {
  name: string;
  picture: string;
  email: string;

  static of(data) {
    if (data && data.constructor.name !== User.name) {
      return new User(data);
    }
    return data;
  }

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
