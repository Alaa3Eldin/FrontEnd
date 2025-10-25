import { Component, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router'; // ✅ Add these
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,          // ✅ Add
    RouterLinkActive,    // ✅ Add
    MatIconModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  _authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  isSidebarOpen = true;
  isMobile = false;

  constructor(private router: Router) {
    this.checkScreenWidth();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    const prevIsMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 900;
    this.isSidebarOpen = !this.isMobile;

    if (this.isMobile !== prevIsMobile) {
      this.cdr.detectChanges();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.cdr.detectChanges();
  }

  logout() {
    this.router.navigate(['/login']);
    this._authService.logout();
  }
}
