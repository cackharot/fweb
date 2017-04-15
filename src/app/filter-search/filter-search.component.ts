import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FilterModel } from 'model/base';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { OptionModel } from '../../model/base';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.css']
})
export class FilterSearchComponent implements OnInit, OnDestroy {
  @Input()
  filterSubject: Subject<FilterModel>;
  model: FilterModel = new FilterModel();
  sub: Subscription;
  availableCuisines: OptionModel[] = [];

  constructor() { }

  ngOnInit() {
    this.sub = this.filterSubject.subscribe(x => this.model = x);
    this.availableCuisines = [
      new OptionModel('South Indian'),
      new OptionModel('Multicuisine'),
      new OptionModel('Sandwiches'),
      new OptionModel('Briyani'),
      new OptionModel('Italian'),
      new OptionModel('Pizza'),
      new OptionModel('Deserts')
    ];
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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

  updateOptions(id: string, event: any) {
    this.model.others[id] = event.target.checked;
    this.onChanged();
  }
}
