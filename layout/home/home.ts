import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { TestimonialService } from '../../core/services/testimonial.service';
import { FqaService } from '../../core/services/fqa.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  testimonials: any[] = [];
  faqs: any[] = [];

  loadingProducts = false;
  loadingCategories = false;
  loadingTestimonials = false;
  loadingFaqs = false;

  errorProducts = '';
  errorCategories = '';
  errorTestimonials = '';
  errorFaqs = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private testimonialService: TestimonialService,
    private fqaService: FqaService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadTestimonials();
    this.loadFaqs();
  }

  /** Load categories */
  loadCategories(): void {
    this.loadingCategories = true;
    this.cdr.detectChanges();
    this.categoryService.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || [];
        this.loadingCategories = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorCategories = 'Failed to load categories';
        this.loadingCategories = false;
        this.cdr.detectChanges();
      },
    });
  }

  /** Load products */
  loadProducts(): void {
    this.loadingProducts = true;
    this.cdr.detectChanges();
    this.productService.getFeaturedProducts().subscribe({
      next: (res: any) => {
        this.products = res.data || [];
        this.products.forEach((p) => (p.currentImageIndex = 0));
        this.loadingProducts = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorProducts = 'Failed to load products';
        this.loadingProducts = false;
        this.cdr.detectChanges();
      },
    });
  }

  /** Filter by category */
  filterByCategory(categoryId: string): void {
    this.loadingProducts = true;
    this.cdr.detectChanges();
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (res: any) => {
        this.products = res.data || [];
        this.loadingProducts = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorProducts = 'Failed to filter by category';
        this.loadingProducts = false;
        this.cdr.detectChanges();
      },
    });
  }

  /** Add to cart */
  addToCart(productId: string, quantity: number = 1): void {
    this.cartService.addToCart(productId, quantity).subscribe({
      next: (res: any) => {
        this.snackBar.open(res.message || '✅ Added to cart!', 'Close', {
          duration: 2500,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      },
      error: (err) => {
        const message = err.error?.message || '❌ Failed to add item to the cart';
        this.snackBar.open(message, 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      },
    });
  }

  /** Product image carousel */
  nextImage(product: any): void {
    if (product.images?.length > 1) {
      product.currentImageIndex =
        (product.currentImageIndex + 1) % product.images.length;
      this.cdr.detectChanges();
    }
  }

  prevImage(product: any): void {
    if (product.images?.length > 1) {
      product.currentImageIndex =
        (product.currentImageIndex - 1 + product.images.length) %
        product.images.length;
      this.cdr.detectChanges();
    }
  }

  /** Load testimonials */
  loadTestimonials(): void {
    this.loadingTestimonials = true;
    this.cdr.detectChanges();
    this.testimonialService.getFeaturedTestimonials().subscribe({
      next: (res: any) => {
        this.testimonials = res.testimonials || [];
        this.loadingTestimonials = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorTestimonials = 'Failed to load testimonials';
        this.loadingTestimonials = false;
        this.cdr.detectChanges();
      },
    });
  }

  /** Load FAQs */
  loadFaqs(): void {
    this.loadingFaqs = true;
    this.cdr.detectChanges();
    this.fqaService.getActiveFAQs().subscribe({
      next: (res: any) => {
        this.faqs = res.faqs || [];
        this.loadingFaqs = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorFaqs = 'Failed to load FAQs';
        this.loadingFaqs = false;
        this.cdr.detectChanges();
      },
    });
  }
}
