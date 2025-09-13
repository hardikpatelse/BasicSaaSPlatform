import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p class="text-gray-600">Manage users and system settings</p>
      </div>
      
      <!-- TODO: Implement admin panel -->
      <div class="bg-white shadow rounded-lg p-6">
        <p class="text-gray-500">Admin panel coming soon...</p>
      </div>
    </div>
  `
})
export class AdminComponent {
}