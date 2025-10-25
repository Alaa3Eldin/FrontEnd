import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = false;

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: res => { this.orders = res.orders; this.loading = false; this.cdr.detectChanges(); },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  cancelOrder(orderId: string) {
    this.orderService.cancelOrderByUser(orderId).subscribe({
      next: res => { this.loadOrders(); },
      error: err => console.error(err)
    });
  }
}
