import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OrderService } from 'services/order.service';

import { Product, PriceDetail } from 'model/product';

@Component({
  selector: 'app-price-table',
  templateUrl: './price-table.component.html',
})
export class PriceTableComponent implements OnInit {
  @Input() product: Product;
  selection: PriceDetail;
  @Output() selectedProduct = new EventEmitter<Product>();

  constructor(private router: Router, private orderService: OrderService) { }

  ngOnInit() {
    if (this.product.hasPriceTable()) {
      this.selection = this.product.price_table[0];
    }
  }

  onChange(item: PriceDetail) {
    this.product.selectedPriceDetail = item;
    this.selection = item;
    // this.orderService.updateItemPriceDetail(this.product._id, item);
  }
  getQuantity(item: Product, price_detail = null): number {
    const order = this.orderService.getOrder();
    return order.getItemQuantity(item._id, price_detail);
  }

  updateQuantity(item: Product, value: number, price_detail = null) {
    this.orderService.updateItemQuantity(item._id, value, price_detail);
  }

  isInCart(item: Product) {
    if (item.hasPriceTable()) {
      return item.price_table.filter(x => this.getQuantity(item, x) > 0).length > 0;
    }
    return this.getQuantity(item) > 0;
  }

  select(item: Product) {
    this.selectedProduct.emit(item);
  }
}
