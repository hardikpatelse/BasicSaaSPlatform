import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-gray-50 py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that's right for your business. Start with a free trial and upgrade anytime.
          </p>
          
          <!-- Billing Toggle - TODO: Implement yearly billing -->
          <div class="flex items-center justify-center space-x-3">
            <span class="text-gray-500">Monthly</span>
            <button class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors cursor-not-allowed" 
                    disabled title="Yearly billing coming soon">
              <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform translate-x-1"></span>
            </button>
            <span class="text-gray-400">Yearly (Coming Soon)</span>
          </div>
        </div>

        <!-- Pricing Cards -->
        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Starter Plan -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p class="text-gray-600 mb-4">Perfect for getting started</p>
              <div class="flex items-center justify-center">
                <span class="text-4xl font-bold text-gray-900">$9</span>
                <span class="text-gray-600 ml-2">/month</span>
              </div>
            </div>
            
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-gray-700">Up to 5 projects</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-gray-700">10GB storage</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-gray-700">Email support</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-gray-700">Basic analytics</span>
              </li>
            </ul>
            
            <button (click)="selectPlan('starter')" 
                    class="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-3 px-6 rounded-lg font-semibold transition-colors">
              Get Started
            </button>
          </div>

          <!-- Pro Plan -->
          <div class="bg-white rounded-2xl shadow-lg border-2 border-indigo-600 p-8 relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p class="text-gray-600 mb-4">For growing businesses</p>
              <div class="flex items-center justify-center">
                <span class="text-4xl font-bold text-gray-900">$29</span>
                <span class="text-gray-600 ml-2">/month</span>
              </div>
            </div>
            
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-gray-700">Unlimited projects</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-gray-700">100GB storage</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-gray-700">Priority support</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-gray-700">Advanced analytics</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-gray-700">API access</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-gray-700">Team collaboration</span>
              </li>
            </ul>
            
            <button (click)="selectPlan('pro')" 
                    class="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-3 px-6 rounded-lg font-semibold transition-colors">
              Get Started
            </button>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="mt-24">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div class="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p class="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Do you offer yearly billing?
              </h3>
              <p class="text-gray-600">
                Yearly billing is coming soon! We're working on implementing this feature with attractive discounts for annual plans.
              </p>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p class="text-gray-600">
                Yes, all plans come with a 14-day free trial. No credit card required to get started.
              </p>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p class="text-gray-600">
                We accept all major credit cards and debit cards through our secure Stripe integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PricingComponent {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  async selectPlan(planType: 'starter' | 'pro') {
    const user = this.supabaseService.currentUser;
    
    if (!user) {
      // Redirect to signup with plan parameter
      this.router.navigate(['/auth/signup'], { 
        queryParams: { plan: planType } 
      });
      return;
    }

    // TODO: Implement Stripe checkout flow
    // For now, redirect to dashboard
    this.router.navigate(['/dashboard']);
  }
}