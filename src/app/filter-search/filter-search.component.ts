import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { FilterModel } from 'model/base';
import { OptionModel } from 'model/base';
import { StoreService } from 'services/store.service';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.css']
})
export class FilterSearchComponent implements OnInit, OnDestroy {
  @Input()
  filterSubject: Subject<FilterModel>;
  @Input() searchPlaceholder = 'Enter dish or restaurant name...';
  model: FilterModel = new FilterModel();
  sub: Subscription;
  availableCuisines: OptionModel[] = [];
  cus_collapse = false;
  fet_collapse = false;

  constructor(private storeService: StoreService) { }

  ngOnInit() {
    this.sub = this.filterSubject.subscribe(x => this.model = x);
    this.getCuisines();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getCuisines() {
    this.storeService.getCuisines().then(x => {
      for (let i = 0; i < x.length; ++i) {
        this.availableCuisines.push(new OptionModel(x[i]));
      }
    }).catch(err => {
      console.log(err);
      // this.errorMsg = err;
    });
  }

  search() {
    this.onChanged();
  }

  onChanged() {
    this.filterSubject.next(this.model);
  }

  clearFilter() {
    this.model = new FilterModel();
    this.onChanged();
    return false;
  }

  isChecked(key: string, id: string) {
    return this.model[key][id] === true;
  }

  updateOptions(key: string, id: string, event: any) {
    this.model[key][id] = event.target.checked;
    this.onChanged();
  }
}
