import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  template: `
    <div class="tab-pane fade in" [class.show]="active" [hidden]="!active">
      <ng-content></ng-content>
    </div>
  `
})
export class TabComponent {
  @Input()
  title = '';
  @Input()
  active = false;
}
