import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a routerLink="/" class="flex-shrink-0 flex items-center">
              <span class="text-2xl font-bold text-indigo-600">SaaSPlatform</span>
            </a>
            
            <div class="hidden md:ml-8 md:flex md:space-x-8">
              <a routerLink="/" routerLinkActive="text-indigo-600" [routerLinkActiveOptions]="{exact: true}" 
                 class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a routerLink="/pricing" routerLinkActive="text-indigo-600" 
                 class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Pricing
              </a>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div *ngIf="!(currentUser$ | async); else loggedInMenu">
              <a routerLink="/auth/login" 
                 class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Sign In
              </a>
              <a routerLink="/auth/signup" 
                 class="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium ml-2">
                Get Started
              </a>
            </div>
            
            <ng-template #loggedInMenu>
              <div class="hidden md:flex md:items-center md:space-x-4">
                <a routerLink="/dashboard" routerLinkActive="text-indigo-600" 
                   class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </a>
                <a routerLink="/account" routerLinkActive="text-indigo-600" 
                   class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Account
                </a>
                <a *ngIf="(currentUser$ | async)?.role === 'admin'" 
                   routerLink="/admin" routerLinkActive="text-indigo-600" 
                   class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Admin
                </a>
                <button (click)="signOut()" 
                        class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Sign Out
                </button>
              </div>
              
              <!-- Mobile menu button -->
              <div class="md:hidden">
                <button (click)="mobileMenuOpen = !mobileMenuOpen" 
                        class="text-gray-500 hover:text-gray-900 p-2">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </ng-template>
          </div>
        </div>
        
        <!-- Mobile menu -->
        <div *ngIf="mobileMenuOpen && (currentUser$ | async)" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <a routerLink="/dashboard" 
               class="text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </a>
            <a routerLink="/account" 
               class="text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Account
            </a>
            <a *ngIf="(currentUser$ | async)?.role === 'admin'" 
               routerLink="/admin" 
               class="text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Admin
            </a>
            <button (click)="signOut()" 
                    class="text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  
  currentUser$ = this.supabaseService.currentUser$;
  mobileMenuOpen = false;

  async signOut() {
    await this.supabaseService.signOut();
    this.router.navigate(['/']);
    this.mobileMenuOpen = false;
  }
}