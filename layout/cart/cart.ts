import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, MatFormField, MatLabel, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cart: any = null;
  loading = false;
  selectedAddressLabel: string = ''; // store user-selected address

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.cartService.getUserCart().subscribe({
      next: res => { this.cart = res.cart; this.loading = false; this.cdr.detectChanges(); },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  updateQuantity(productId: string, qty: number) {
    if (qty < 1) return;
    this.cartService.updateItemQuantity(productId, qty).subscribe({
      next: res => { this.cart = res.cart; this.cdr.detectChanges(); },
      error: err => console.error(err)
    });
  }

  removeItem(productId: string) {
    this.cartService.removeItem(productId).subscribe({
      next: res => { 
        this.cart = res.cart; 
        this.snackBar.open('✅ Item removed', 'Close', { duration: 2500 }); 
        this.cdr.detectChanges(); 
      },
      error: err => console.error(err)
    });
  }

  /** Create order and navigate */
  proceedToCheckout() {
    if (!this.selectedAddressLabel) {
      this.snackBar.open(' Please select an address', 'Close', { duration: 2500 });
      return;
    }

    this.orderService.createOrder(this.selectedAddressLabel).subscribe({
      next: res => {
        this.snackBar.open(' Order placed successfully!', 'Close', { duration: 2500 });
        this.router.navigate(['/orders']);
      },
      error: err => {
        console.error(err);
        const message = err.error?.message || 'Failed to place order';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
    });
  }
}
