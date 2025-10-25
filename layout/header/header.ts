import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userName: string | null = null;
  cartCount = 0;
  menuOpen = false;
  userMenuOpen = false;

  constructor(private authService: AuthService, private cartService: CartService) { }

  ngOnInit() {
    this.authService.authName$.subscribe((name) => {
      this.isLoggedIn = !!name;
      this.userName = name;
    });

    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.cartCount = res.cart?.items?.length || 0;
      },
      error: () => (this.cartCount = 0),
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.userMenuOpen = false;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.userMenuOpen = false;
  }
}
