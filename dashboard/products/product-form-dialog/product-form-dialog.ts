import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/interfaces/product.interface';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/interfaces/category.interface';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './product-form-dialog.html',
  styleUrls: ['./product-form-dialog.css'],
})
export class ProductFormDialog implements OnInit {
  form: FormGroup;
  selectedFiles: File[] = []; // ✅ multiple files
  previewUrl: string[] = []; // ✅ multiple preview URLs
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'create' | 'edit'; product?: Product },
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
    const product = data.product || ({} as Product);

    this.form = this.fb.group({
      name: [product.name || '', Validators.required],
      brand: [product.brand || '', Validators.required],
      category: [
        typeof product.category === 'object'
          ? product.category?._id
          : product.category || '',
        Validators.required,
      ],
      price: [product.price || '', Validators.required],
      stock: [product.stock || 0, Validators.required],
      description: [product.description || ''],
      isFeatured: [product.isFeatured || false],
    });

    // ✅ Load existing images if editing
    if (product.images?.length) {
      this.previewUrl = product.images.map(
        (img) => 'http://localhost:3000' + img
      );
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data || res;

        if (this.data.mode === 'edit' && this.data.product?.category) {
          const currentCatId =
            typeof this.data.product.category === 'object'
              ? this.data.product.category._id
              : this.data.product.category;
          if (currentCatId) this.form.patchValue({ category: currentCatId });
        }
      },
      error: () =>
        this.snackBar.open('Error loading categories', 'Close', {
          duration: 2000,
        }),
    });
  }

  /** ✅ Handle multiple image selection */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFiles = Array.from(input.files);
    this.previewUrl = [];

    for (const file of this.selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  /** ✅ Handle form submission with multiple images */
  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (key === 'category' && typeof value === 'object') {
        formData.append(key, (value as Category)._id!);
      } else {
        formData.append(key, value as any);
      }
    });

    // ✅ Append all selected images
    this.selectedFiles.forEach((file) => formData.append('images', file));

    const request =
      this.data.mode === 'edit' && this.data.product?._id
        ? this.productService.updateProduct(this.data.product._id, formData)
        : this.productService.createProduct(formData);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          `Product ${
            this.data.mode === 'edit' ? 'updated' : 'created'
          } successfully!`,
          'Close',
          { duration: 2000 }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(
          err.error?.message || 'Error saving product',
          'Close',
          { duration: 2000 }
        );
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
