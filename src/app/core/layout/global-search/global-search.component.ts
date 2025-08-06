import { Component, inject, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { SearchService, SearchResult } from '../../services/search.service';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <div class="search-container" [class.open]="searchService.isOpen()">
      <!-- Search Input -->
      <div class="search-input-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input 
            matInput 
            #searchInput
            placeholder="Buscar usuarios, scrap, reportes..."
            [(ngModel)]="searchTerm"
            (input)="onSearchChange()"
            (keydown.escape)="closeSearch()"
            (keydown.enter)="selectFirstResult()"
          >
          <button mat-icon-button matSuffix (click)="closeSearch()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
      </div>

      <!-- Search Results -->
      <div class="search-results" *ngIf="searchService.searchResults().length > 0">
        <div class="results-header">
          <span class="results-count">
            {{ searchService.searchResults().length }} resultado(s) encontrado(s)
          </span>
        </div>
        
        <mat-list class="results-list">
          <mat-list-item 
            *ngFor="let result of searchService.searchResults(); trackBy: trackByResultId"
            (click)="selectResult(result)"
            class="result-item"
          >
            <mat-icon matListItemIcon [color]="searchService.getTypeColor(result.type)">
              {{ result.icon }}
            </mat-icon>
            
            <div matListItemTitle class="result-title">
              {{ result.title }}
            </div>
            
            <div matListItemLine class="result-description">
              {{ result.description }}
            </div>
            
            <mat-chip 
              matListItemMeta 
              [color]="searchService.getTypeColor(result.type)"
              class="result-type"
            >
              {{ searchService.getTypeLabel(result.type) }}
            </mat-chip>
          </mat-list-item>
        </mat-list>
      </div>

      <!-- No Results -->
      <div class="no-results" *ngIf="searchTerm && searchService.searchResults().length === 0">
        <mat-icon>search_off</mat-icon>
        <p>No se encontraron resultados para "{{ searchTerm }}"</p>
        <small>Intenta con términos diferentes o verifica la ortografía</small>
      </div>

      <!-- Search Tips -->
      <div class="search-tips" *ngIf="!searchTerm">
        <div class="tip-section">
          <h4>Consejos de búsqueda:</h4>
          <ul>
            <li>Busca por nombre de usuario o área</li>
            <li>Usa números de bobina o lote para scrap</li>
            <li>Escribe "reporte" para encontrar informes</li>
            <li>Usa "config" para configuraciones</li>
          </ul>
        </div>
        
        <div class="shortcut-info">
          <mat-chip color="accent">Ctrl + K</mat-chip>
          <span>para abrir búsqueda rápida</span>
        </div>
      </div>
    </div>

    <!-- Search Overlay -->
    <div 
      class="search-overlay" 
      *ngIf="searchService.isOpen()"
      (click)="closeSearch()"
    ></div>
  `,
  styles: [`
    .search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      backdrop-filter: blur(2px);
    }

    .search-container {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) scale(0.9);
      width: 90%;
      max-width: 600px;
      background: var(--mat-sys-surface);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease-out;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .search-container.open {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) scale(1);
    }

    .search-input-container {
      padding: 16px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    .search-field {
      width: 100%;
    }

    .search-field mat-form-field {
      font-size: 16px;
    }

    .search-results {
      flex: 1;
      overflow-y: auto;
      max-height: 400px;
    }

    .results-header {
      padding: 12px 16px 8px;
      background: var(--mat-sys-surface-variant);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    .results-count {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      font-weight: 500;
    }

    .results-list {
      padding: 0;
    }

    .result-item {
      cursor: pointer;
      transition: background-color 0.2s;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    .result-item:hover {
      background: var(--mat-sys-surface-variant);
    }

    .result-item:last-child {
      border-bottom: none;
    }

    .result-title {
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .result-description {
      color: var(--mat-sys-on-surface-variant);
      font-size: 14px;
    }

    .result-type {
      font-size: 11px;
      height: 20px;
      line-height: 20px;
    }

    .no-results {
      padding: 40px;
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
    }

    .no-results mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .search-tips {
      padding: 20px;
      background: var(--mat-sys-surface-variant);
    }

    .tip-section h4 {
      margin: 0 0 12px 0;
      color: var(--mat-sys-on-surface);
      font-size: 14px;
      font-weight: 500;
    }

    .tip-section ul {
      margin: 0;
      padding-left: 16px;
      color: var(--mat-sys-on-surface-variant);
      font-size: 13px;
    }

    .tip-section li {
      margin-bottom: 4px;
    }

    .shortcut-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
    }

    @media (max-width: 768px) {
      .search-container {
        width: 95%;
        top: 10px;
        max-height: 90vh;
      }
    }
  `]
})
export class GlobalSearchComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  
  searchService = inject(SearchService);
  router = inject(Router);
  
  searchTerm = '';

  ngAfterViewInit() {
    // Auto-focus cuando se abre
    if (this.searchService.isOpen()) {
      setTimeout(() => this.searchInput?.nativeElement.focus(), 100);
    }
  }

  onSearchChange() {
    this.searchService.setSearchTerm(this.searchTerm);
  }

  selectResult(result: SearchResult) {
    if (result.route) {
      this.router.navigate([result.route]);
    }
    this.closeSearch();
  }

  selectFirstResult() {
    const firstResult = this.searchService.searchResults()[0];
    if (firstResult) {
      this.selectResult(firstResult);
    }
  }

  closeSearch() {
    this.searchService.closeSearch();
    this.searchTerm = '';
  }

  trackByResultId(index: number, result: SearchResult): string {
    return result.id;
  }
}
