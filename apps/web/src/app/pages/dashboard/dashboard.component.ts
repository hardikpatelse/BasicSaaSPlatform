import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Welcome to your dashboard</p>
      </div>
      
      <!-- TODO: Implement dashboard content -->
      <div class="bg-white shadow rounded-lg p-6">
        <p class="text-gray-500">Dashboard content coming soon...</p>
      </div>
    </div>
  `
})
export class DashboardComponent {
}