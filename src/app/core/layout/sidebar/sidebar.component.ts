import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { NavigationService } from '../../services';
import { NavigationItem } from '../../models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDividerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly router = inject(Router);

  // Signals
  readonly expandedItems = signal<Set<string>>(new Set());

  // Computed properties
  readonly isOpen = this.navigationService.isSidebarOpen;
  readonly menuItems = this.navigationService.filteredMenuItems;
  readonly currentRoute = this.navigationService.activeRoute;

  // Methods
  navigateToItem(item: NavigationItem): void {
    if (item.children && item.children.length > 0) {
      this.toggleExpansion(item.id);
    } else if (item.route) {
      this.navigationService.navigateTo(item.route);
    }
  }

  toggleExpansion(itemId: string): void {
    this.expandedItems.update(expanded => {
      const newExpanded = new Set(expanded);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      return newExpanded;
    });
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems().has(itemId);
  }

  isItemActive(item: NavigationItem): boolean {
    const currentRoute = this.currentRoute();
    
    if (item.route) {
      return currentRoute === item.route || currentRoute.startsWith(item.route + '/');
    }
    
    // Check if any child is active
    if (item.children) {
      return item.children.some(child => 
        child.route && (currentRoute === child.route || currentRoute.startsWith(child.route + '/'))
      );
    }
    
    return false;
  }

  closeSidebar(): void {
    this.navigationService.closeSidebar();
  }
}
