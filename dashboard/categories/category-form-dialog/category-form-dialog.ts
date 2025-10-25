import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../core/services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  templateUrl: './category-form-dialog.html',
  styleUrls: ['./category-form-dialog.css'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class CategoryFormDialog {
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CategoryFormDialog>,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      image: [null],
    });

    if (data.mode === 'edit' && data.category) {
      this.form.patchValue({
        name: data.category.name,
        description: data.category.description,
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.form.patchValue({ image: file });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as any);
    });

    const request =
      this.data.mode === 'create'
        ? this.categoryService.createCategory(formData)
        : this.categoryService.updateCategory(this.data.category._id, formData);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.data.mode === 'create' ? 'Category created!' : 'Category updated!',
          'Close',
          { duration: 2000 }
        );
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error saving category', 'Close', { duration: 2000 });
      },
    });
  }
}
