import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/interfaces/category.interface';
import { CategoryFormDialog } from './category-form-dialog/category-form-dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
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
})
export class Categories implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  loading = true;
  searchTerm = '';
  selectedStatus = '';

  constructor(
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.filteredCategories = this.categories;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
      },
    });
  }

  applyFilters(): void {
    this.filteredCategories = this.categories.filter((cat) => {
      const matchesSearch =
        this.searchTerm === '' ||
        cat.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus =
        this.selectedStatus === '' ||
        (this.selectedStatus === 'active' && cat.isActive) ||
        (this.selectedStatus === 'inactive' && !cat.isActive);
      return matchesSearch && matchesStatus;
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryFormDialog, {
      width: '500px',
      data: { mode: 'create' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.fetchCategories();
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryFormDialog, {
      width: '500px',
      data: { mode: 'edit', category },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.fetchCategories();
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', { duration: 2000 });
          this.fetchCategories();
        },
        error: () => {
          this.snackBar.open('Failed to delete category', 'Close', { duration: 2000 });
        },
      });
    }
  }

  toggleActive(category: Category): void {
    this.categoryService.toggleCategoryActive(category._id!).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', { duration: 2000 });
        this.fetchCategories();
      },
      error: () => {
        this.snackBar.open('Error toggling active status', 'Close', { duration: 2000 });
      },
    });
  }
}
