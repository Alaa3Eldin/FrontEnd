import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/interfaces/product.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ProductFormDialog } from './product-form-dialog/product-form-dialog';
import { FormsModule } from '@angular/forms';
import { ProductDetails } from './product-details/product-details';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  searchTerm = '';
  selectedCategory = '';
  selectedBrand = '';
get uniqueCategories(): string[] {
  const categories = this.products
    .map(p => typeof p.category === 'string' ? p.category : p.category?.name)
    .filter((c): c is string => !!c);
  return Array
    .from(new Set(categories))
    .sort();
}


  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        this.filteredProducts = this.products;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load products', 'Close', { duration: 3000 });
      },
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch =
        this.searchTerm === '' ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory =
        this.selectedCategory === '' || product.category.name === this.selectedCategory;
      const matchesBrand = this.selectedBrand === '' || product.brand === this.selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', { duration: 2000 });
          this.fetchProducts();
        },
        error: () => {
          this.snackBar.open('Failed to delete product', 'Close', { duration: 2000 });
        },
      });
    }
  }

  toggleFeatured(product: Product): void {
    this.productService.toggleFeatured(product._id!).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', { duration: 2000 });
        this.fetchProducts();
      },
      error: () => {
        this.snackBar.open('Error toggling featured status', 'Close', { duration: 2000 });
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductFormDialog, {
      width: '500px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.fetchProducts();
    });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductFormDialog, {
      width: '500px',
      data: { mode: 'edit', product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.fetchProducts();
    });
  }

  openProductDetails(product: Product): void {
  const dialogRef = this.dialog.open(ProductDetails, {
    width: '600px',
    data: { product },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) this.fetchProducts();
  });
}
}
