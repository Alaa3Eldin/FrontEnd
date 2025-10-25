import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../core/interfaces/product.interface';
import { ProductService } from '../../../core/services/product.service';
import { ProductFormDialog } from '../product-form-dialog/product-form-dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf, NgFor, CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
  imports: [
    CommonModule,
    NgClass,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    CurrencyPipe,
  ],
})
export class ProductDetails {
  product: Product;
  currentImageIndex = 0;
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductDetails>,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.product = data.product;
  }

  deleteProduct(): void {
    if (confirm('Delete this product?')) {
      this.productService.deleteProduct(this.product._id!).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully', 'Close', { duration: 2000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Failed to delete product', 'Close', { duration: 2000 });
        },
      });
    }
  }

  toggleFeatured(): void {
    this.productService.toggleFeatured(this.product._id!).subscribe({
      next: () => {
        this.snackBar.open('Featured status updated', 'Close', { duration: 2000 });
        this.dialogRef.close(true);
      },
    });
  }

  editProduct(): void {
    const dialogRef = this.dialog.open(ProductFormDialog, {
      width: '500px',
      data: { mode: 'edit', product: this.product },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.dialogRef.close(true);
    });
  }

  nextImage(): void {
    if (this.product.images?.length! > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images!.length;
    }
  }

  prevImage(): void {
    if (this.product.images?.length! > 1) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.product.images!.length) % this.product.images!.length;
    }
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }
}
