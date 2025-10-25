import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../core/services/order.service';
import { IOrder } from '../../core/interfaces/order.interface';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
})
export class Orders implements OnInit {
  orders: IOrder[] = [];
  loading = false;
  error = '';
  selectedOrder: IOrder | null = null;

  @ViewChild('orderDetailsModal') orderDetailsModal!: TemplateRef<any>;

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /**  Load all orders */
  loadOrders(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.orders || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || '❌ Failed to load orders';
        this.loading = false;
        this.showSnackBar(this.error);
        this.cdr.detectChanges();
      },
    });
  }

  /**  Filter orders by status */
  filterOrders(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    const value = select?.value || '';

    if (!value) {
      this.loadOrders();
      return;
    }

    this.orders = this.orders.filter(
      (o) => o.status?.toLowerCase() === value.toLowerCase()
    );
    this.cdr.detectChanges();
  }

  /** Update order status */
updateStatus(orderId: string, currentStatus?: string): void {
  let newStatus = '';

  switch (currentStatus) {
    case 'pending':
      newStatus = 'prepared';
      break;
    case 'prepared':
      newStatus = 'shipped';
      break;
    default:
      this.showSnackBar('⚠️ Cannot update this order further');
      return;
  }

  this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
    next: () => {
      this.showSnackBar(`✅ Order updated to "${newStatus}"`);
      this.loadOrders();
    },
    error: (err) => {
      const msg = err.error?.message || 'Failed to update order';
      this.showSnackBar(msg);
      this.cdr.detectChanges();
    },
  });
}


  /** Cancel order */
  cancelOrder(orderId: string): void {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    this.orderService.cancelOrderByAdmin(orderId).subscribe({
      next: () => {
        this.showSnackBar(' Order canceled by admin');
        this.loadOrders();
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to cancel order';
        this.showSnackBar(msg);
        this.cdr.detectChanges();
      },
    });
  }

  /**  Open order details modal */
  viewOrderDetails(order: IOrder): void {
    this.selectedOrder = order;
    this.dialog.open(this.orderDetailsModal, {
      width: '600px',
      disableClose: false,
      panelClass: 'custom-dialog-container',
    });
    this.cdr.detectChanges();
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
