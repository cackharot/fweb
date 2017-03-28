import {
  Component,
  ContentChildren, QueryList,
  forwardRef, AfterContentInit
} from '@angular/core';

import { TabComponent } from './tab';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs-wrapper">
      <ul class="nav classic-tabs tabs-cyan" role="tablist">
        <li class="nav-item" *ngFor="let tab of tabs">
          <a class="nav-link waves-light" [class.active]="tab.active" (click)="selectTab(tab, $event)">{{tab.title}}</a>
        </li>
      </ul>
    </div>
    <div class="tab-content card">
      <ng-content></ng-content>
    </div>
  `
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(forwardRef(() => TabComponent)) tabs: QueryList<TabComponent>;

  // contentChildren are set
  ngAfterContentInit() {
    const that = this;
    this.tabs.changes.subscribe(x => {
      window.setTimeout(
        function () {
          if (that.tabs.length > 0) {
            that.initTabs();
          }
        },
        200);
    });
  }

  initTabs() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first, null);
    }
  }

  selectTab(tab: TabComponent, event: any) {
    if (event) {
      event.preventDefault();
    }
    if (tab === undefined || tab.active === true) {
      return;
    }
    this.tabs.toArray().forEach((x) => {
      x.active = false;
    });
    tab.active = true;
  }
}
