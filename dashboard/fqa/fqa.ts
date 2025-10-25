import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FqaService } from '../../core/services/fqa.service';
import { IFqa } from '../../core/interfaces/fqa.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fqa-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './fqa.html',
  styleUrls: ['./fqa.css'],
})
export class Fqa implements OnInit {
  faqs: IFqa[] = [];
  loading = false;
  editingFaq: IFqa | null = null;
  faqForm!: FormGroup;
  displayedColumns: string[] = ['index', 'question', 'answer', 'status', 'createdAt', 'actions'];

  constructor(
    private fqaService: FqaService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFaqs();
  }

  /** Initialize form */
  initForm(): void {
    this.faqForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
  }

  /** Load all FAQs */
  loadFaqs(): void {
    this.loading = true;
    this.fqaService.getAllFAQs().subscribe({
      next: (res) => {
        this.faqs = res.faqs || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showMessage('Failed to load FAQs');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  /** Create or update FAQ */
  onSubmit(): void {
    if (this.faqForm.invalid) return;
    const data = this.faqForm.value;

    if (this.editingFaq) {
      this.fqaService.updateFAQ(this.editingFaq._id!, data).subscribe({
        next: () => {
          this.showMessage(' FAQ updated successfully');
          this.editingFaq = null;
          this.faqForm.reset();
          this.loadFaqs();
          this.cdr.detectChanges(); 
        },
        error: () => {
          this.showMessage(' Failed to update FAQ');
          this.cdr.detectChanges();
        },
      });
    } else {
      this.fqaService.createFAQ(data).subscribe({
        next: () => {
          this.showMessage(' FAQ added successfully');
          this.faqForm.reset();
          this.loadFaqs();
          this.cdr.detectChanges();
        },
        error: () => {
          this.showMessage(' Failed to add FAQ');
          this.cdr.detectChanges();
        },
      });
    }
  }

  /** Edit FAQ */
  editFaq(faq: IFqa): void {
    this.editingFaq = faq;
    this.faqForm.patchValue(faq);
    this.showMessage('✏️ Editing FAQ');
    this.cdr.detectChanges();
  }

  /** Cancel editing */
  cancelEdit(): void {
    this.editingFaq = null;
    this.faqForm.reset();
    this.cdr.detectChanges();
  }

  /** Delete FAQ */
  deleteFaq(id: string): void {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      this.fqaService.deleteFAQ(id).subscribe({
        next: () => {
          this.showMessage('🗑️ FAQ deleted');
          this.loadFaqs();
          this.cdr.detectChanges();
        },
        error: () => {
          this.showMessage('❌ Failed to delete FAQ');
          this.cdr.detectChanges();
        },
      });
    }
  }

  /** Toggle active/inactive status */
  toggleStatus(id: string): void {
    this.fqaService.toggleFAQStatus(id).subscribe({
      next: () => {
        this.showMessage('🔁 Status updated');
        this.loadFaqs();
        this.cdr.detectChanges();
      },
      error: () => {
        this.showMessage('❌ Failed to change status');
        this.cdr.detectChanges();
      },
    });
  }

  /** Snackbar Message */
  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
