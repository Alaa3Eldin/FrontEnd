import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestimonialService } from '../../core/services/testimonial.service';
import { ITestimonial } from '../../core/interfaces/testimonial.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-testimonial-dashboard',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.css'],
})
export class Testimonials implements OnInit {
  testimonials: ITestimonial[] = [];
  loading = false;

  constructor(
    private testimonialService: TestimonialService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTestimonials();
  }

  /** Load all testimonials */
  loadTestimonials(): void {
    this.loading = true;
    this.testimonialService.getAllTestimonials().subscribe({
      next: (res) => {
        this.testimonials = res.testimonials || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showSnackBar('Failed to load testimonials');
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  approveTestimonial(id: string): void {
    this.testimonialService.approveTestimonial(id).subscribe({
      next: (res) => {
        this.showSnackBar(res.message || 'Testimonial approved');
        this.loadTestimonials();
      },
      error: (err) => {
        this.showSnackBar('Failed to approve testimonial');
        console.error(err);
      },
    });
  }

  /** Toggle featured */
  toggleFeatured(id: string): void {
    this.testimonialService.toggleFeatured(id).subscribe({
      next: (res) => {
        this.showSnackBar(res.message || 'Updated featured status');
        this.loadTestimonials();
      },
      error: (err) => {
        this.showSnackBar('Failed to toggle featured');
        console.error(err);
      },
    });
  }

  /** Delete testimonial */
  deleteTestimonial(id: string): void {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      this.testimonialService.deleteTestimonial(id).subscribe({
        next: (res) => {
          this.showSnackBar(res.message || 'Testimonial deleted');
          this.loadTestimonials();
        },
        error: (err) => {
          this.showSnackBar('Failed to delete testimonial');
          console.error(err);
        },
      });
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
