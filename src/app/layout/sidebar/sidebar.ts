import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  companyLogoUrl = '';

  get companyName(): string {
    return localStorage.getItem('empresaRazonSocial') || 'PlanillaPro';
  }

  get companyInitials(): string {
    return this.companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}