import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

import { OrderService } from 'services/order.service';

import { Product } from 'model/product';

import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
})
export class ProductGridComponent extends ProductListComponent {

  constructor(protected router: Router, protected orderService: OrderService) {
    super(router, orderService);
  }
}
