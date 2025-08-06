import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MaterialTypeService } from '../../core/services/material-type.service';
import { MaterialType, MaterialCategory, MaterialUnit } from '../../core/models/laf-business.model';

@Component({
  selector: 'app-material-type-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule,
    MatBadgeModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="material-type-management-container">
      <div class="header-section">
        <h1>Gestión de Tipos de Material</h1>
        <p>Catálogo de materiales para producción Bolsapel</p>
      </div>

      <!-- Summary Cards -->
      <div class="summary-grid">
        <mat-card class="summary-card papers">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon color="primary">description</mat-icon>
              <div class="summary-info">
                <span class="summary-value">{{ paperMaterialsCount() }}</span>
                <span class="summary-label">Papeles</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card plastic">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon color="accent">polymer</mat-icon>
              <div class="summary-info">
                <span class="summary-value">{{ plasticMaterialsCount() }}</span>
                <span class="summary-label">Plásticos</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card adhesives">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon color="warn">water_drop</mat-icon>
              <div class="summary-info">
                <span class="summary-value">{{ adhesiveMaterialsCount() }}</span>
                <span class="summary-label">Adhesivos</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card total">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon color="primary">inventory_2</mat-icon>
              <div class="summary-info">
                <span class="summary-value">{{ totalMaterialsCount() }}</span>
                <span class="summary-label">Total Materiales</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Search and Filter Section -->
      <mat-card class="search-section">
        <mat-card-content>
          <div class="search-controls">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar materiales</mat-label>
              <input matInput 
                     [(ngModel)]="searchTerm" 
                     (ngModelChange)="onSearchChange()"
                     placeholder="Nombre, código o descripción...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Filtrar por categoría</mat-label>
              <mat-select [(ngModel)]="selectedCategory" (ngModelChange)="onFilterChange()">
                <mat-option value="">Todas las categorías</mat-option>
                <mat-option *ngFor="let category of availableCategories" [value]="category">
                  {{ getCategoryLabel(category) }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-tab-group class="materials-tabs">
        <!-- All Materials Tab -->
        <mat-tab label="Todos los Materiales">
          <div class="tab-content">
            <div class="materials-grid">
              <mat-card *ngFor="let material of filteredMaterials(); trackBy: trackByMaterialId" 
                        class="material-card">
                <mat-card-header>
                  <div mat-card-avatar class="material-avatar" [class]="'category-' + material.category">
                    <mat-icon>{{ getCategoryIcon(material.category) }}</mat-icon>
                  </div>
                  <mat-card-title>{{ material.name }}</mat-card-title>
                  <mat-card-subtitle>{{ material.code }}</mat-card-subtitle>
                </mat-card-header>

                <mat-card-content>
                  <div class="material-info">
                    <div class="category-section">
                      <mat-chip [color]="getCategoryColor(material.category)">
                        {{ getCategoryLabel(material.category) }}
                      </mat-chip>
                    </div>

                    <mat-divider></mat-divider>

                    <div class="details-section">
                      <div class="detail-item">
                        <mat-icon>straighten</mat-icon>
                        <span>{{ material.specifications.dimensions }}</span>
                      </div>
                      
                      <div class="detail-item">
                        <mat-icon>scale</mat-icon>
                        <span>{{ material.specifications.weight }}</span>
                      </div>
                      
                      <div class="detail-item">
                        <mat-icon>palette</mat-icon>
                        <span>{{ material.color || 'No especificado' }}</span>
                      </div>
                      
                      <div class="detail-item">
                        <mat-icon>business</mat-icon>
                        <span>{{ material.specifications.supplier }}</span>
                      </div>
                    </div>

                    <mat-divider></mat-divider>

                    <div class="cost-section">
                      <div class="cost-info">
                        <span class="cost-label">Costo por {{ getUnitLabel(material.unit) }}:</span>
                        <span class="cost-value">\${{ material.costPerUnit.toFixed(2) }}</span>
                      </div>
                      
                      <div class="stock-info" [class.low-stock]="material.specifications.minimumStock > 100">
                        <span class="stock-label">Stock Mínimo:</span>
                        <span class="stock-value">{{ material.specifications.minimumStock }} {{ getUnitLabel(material.unit) }}</span>
                      </div>
                    </div>

                    <div class="description-section" *ngIf="material.description">
                      <p class="description-text">{{ material.description }}</p>
                    </div>
                  </div>
                </mat-card-content>

                <mat-card-actions>
                  <button mat-button color="primary">
                    <mat-icon>visibility</mat-icon>
                    Ver Detalles
                  </button>
                  <button mat-button color="accent">
                    <mat-icon>edit</mat-icon>
                    Editar
                  </button>
                  <button mat-button>
                    <mat-icon>inventory</mat-icon>
                    Stock
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- By Category Tab -->
        <mat-tab label="Por Categoría">
          <div class="tab-content">
            <div *ngFor="let category of categorizedMaterials(); trackBy: trackByCategory" class="category-section">
              <h3>
                <mat-icon>{{ getCategoryIcon(category.name) }}</mat-icon>
                {{ getCategoryLabel(category.name) }} ({{ category.materials.length }})
              </h3>
              
              <div class="materials-grid">
                <mat-card *ngFor="let material of category.materials; trackBy: trackByMaterialId" 
                          class="material-card compact">
                  <mat-card-header>
                    <div mat-card-avatar class="material-avatar" [class]="'category-' + material.category">
                      <mat-icon>{{ getCategoryIcon(material.category) }}</mat-icon>
                    </div>
                    <mat-card-title>{{ material.name }}</mat-card-title>
                    <mat-card-subtitle>{{ material.code }}</mat-card-subtitle>
                  </mat-card-header>

                  <mat-card-content>
                    <div class="compact-details">
                      <div class="detail-item">
                        <span class="detail-label">Proveedor:</span>
                        <span>{{ material.specifications.supplier }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Costo:</span>
                        <span>\${{ material.costPerUnit.toFixed(2) }}/{{ getUnitLabel(material.unit) }}</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Specifications Tab -->
        <mat-tab label="Especificaciones Técnicas">
          <div class="tab-content">
            <div class="specifications-table-container">
              <table mat-table [dataSource]="materialTypeService.allMaterialTypes()" class="specifications-table">
                <!-- Code Column -->
                <ng-container matColumnDef="code">
                  <th mat-header-cell *matHeaderCellDef>Código</th>
                  <td mat-cell *matCellDef="let material">{{ material.code }}</td>
                </ng-container>

                <!-- Name Column -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Nombre</th>
                  <td mat-cell *matCellDef="let material">{{ material.name }}</td>
                </ng-container>

                <!-- Category Column -->
                <ng-container matColumnDef="category">
                  <th mat-header-cell *matHeaderCellDef>Categoría</th>
                  <td mat-cell *matCellDef="let material">
                    <mat-chip [color]="getCategoryColor(material.category)">
                      {{ getCategoryLabel(material.category) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Dimensions Column -->
                <ng-container matColumnDef="dimensions">
                  <th mat-header-cell *matHeaderCellDef>Dimensiones</th>
                  <td mat-cell *matCellDef="let material">{{ material.specifications.dimensions }}</td>
                </ng-container>

                <!-- Weight Column -->
                <ng-container matColumnDef="weight">
                  <th mat-header-cell *matHeaderCellDef>Peso</th>
                  <td mat-cell *matCellDef="let material">{{ material.specifications.weight }}</td>
                </ng-container>

                <!-- Cost Column -->
                <ng-container matColumnDef="cost">
                  <th mat-header-cell *matHeaderCellDef>Costo</th>
                  <td mat-cell *matCellDef="let material">
                    \${{ material.costPerUnit.toFixed(2) }}/{{ getUnitLabel(material.unit) }}
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let material">
                    <button mat-icon-button color="primary">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button color="accent">
                      <mat-icon>edit</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .material-type-management-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-section {
      margin-bottom: 32px;
      text-align: center;
    }

    .header-section h1 {
      font-size: 2.5rem;
      font-weight: 300;
      color: var(--mat-sys-primary);
      margin-bottom: 8px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .summary-card {
      border-radius: 12px;
      transition: transform 0.2s ease;
    }

    .summary-card:hover {
      transform: translateY(-2px);
    }

    .summary-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .summary-content mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .summary-info {
      display: flex;
      flex-direction: column;
    }

    .summary-value {
      font-size: 2rem;
      font-weight: 300;
      line-height: 1;
    }

    .summary-label {
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .search-section {
      margin-bottom: 24px;
      border-radius: 12px;
    }

    .search-controls {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .search-field {
      flex: 1;
    }

    .filter-field {
      min-width: 200px;
    }

    .materials-tabs {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .tab-content {
      padding: 24px;
    }

    .materials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .material-card {
      border-radius: 12px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .material-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .material-card.compact {
      min-height: auto;
    }

    .material-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 40px;
      height: 40px;
    }

    .material-avatar.category-PAPER {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-primary);
    }

    .material-avatar.category-PLASTIC {
      background: var(--mat-sys-secondary-container);
      color: var(--mat-sys-secondary);
    }

    .material-avatar.category-ADHESIVE {
      background: var(--mat-sys-tertiary-container);
      color: var(--mat-sys-tertiary);
    }

    .material-avatar.category-INK {
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-error);
    }

    .material-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-section {
      display: flex;
      justify-content: center;
    }

    .details-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
    }

    .detail-item mat-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .cost-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .cost-info, .stock-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cost-label, .stock-label {
      font-size: 0.85rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .cost-value {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--mat-sys-primary);
    }

    .stock-value {
      font-size: 0.85rem;
      font-weight: 500;
    }

    .stock-info.low-stock .stock-value {
      color: var(--mat-sys-error);
    }

    .description-section {
      margin-top: 8px;
    }

    .description-text {
      font-size: 0.85rem;
      color: var(--mat-sys-on-surface-variant);
      margin: 0;
      font-style: italic;
    }

    .category-section {
      margin-bottom: 32px;
    }

    .category-section h3 {
      color: var(--mat-sys-primary);
      margin-bottom: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .compact-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .compact-details .detail-item {
      display: flex;
      justify-content: space-between;
    }

    .detail-label {
      font-weight: 500;
      color: var(--mat-sys-on-surface-variant);
    }

    .specifications-table-container {
      overflow-x: auto;
    }

    .specifications-table {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .materials-grid {
        grid-template-columns: 1fr;
      }
      
      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .search-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-field {
        min-width: auto;
      }
    }

    @media (max-width: 480px) {
      .summary-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MaterialTypeManagementComponent {
  materialTypeService = inject(MaterialTypeService);

  // Search and filter
  searchTerm = signal('');
  selectedCategory = signal<MaterialCategory | ''>('');

  // Table configuration
  displayedColumns: string[] = ['code', 'name', 'category', 'dimensions', 'weight', 'cost', 'actions'];
  
  // Available categories for filter
  availableCategories: MaterialCategory[] = [
    MaterialCategory.PAPER, 
    MaterialCategory.PLASTIC_FILM, 
    MaterialCategory.ADHESIVE, 
    MaterialCategory.INK
  ];

  // Computed properties for summary
  paperMaterialsCount = computed(() => 
    this.materialTypeService.allMaterialTypes().filter(m => m.category === MaterialCategory.PAPER).length
  );
  
  plasticMaterialsCount = computed(() => 
    this.materialTypeService.allMaterialTypes().filter(m => m.category === MaterialCategory.PLASTIC_FILM).length
  );
  
  adhesiveMaterialsCount = computed(() => 
    this.materialTypeService.allMaterialTypes().filter(m => m.category === MaterialCategory.ADHESIVE).length
  );
  
  totalMaterialsCount = computed(() => this.materialTypeService.allMaterialTypes().length);

  // Filtered materials based on search and category
  filteredMaterials = computed(() => {
    let materials = this.materialTypeService.allMaterialTypes();
    
    // Apply category filter
    if (this.selectedCategory()) {
      materials = materials.filter(m => m.category === this.selectedCategory());
    }
    
    // Apply search filter
    if (this.searchTerm()) {
      materials = this.materialTypeService.searchMaterialTypes(this.searchTerm());
      // If category filter is also applied, combine both
      if (this.selectedCategory()) {
        materials = materials.filter(m => m.category === this.selectedCategory());
      }
    }
    
    return materials;
  });

  // Materials grouped by category
  categorizedMaterials = computed(() => {
    const materialsByCategory = this.materialTypeService.materialTypesByCategory();
    return Object.entries(materialsByCategory).map(([category, materials]) => ({
      name: category as MaterialCategory,
      materials
    }));
  });

  // Track by functions
  trackByMaterialId(index: number, material: MaterialType): string {
    return material.id;
  }

  trackByCategory(index: number, category: { name: MaterialCategory; materials: MaterialType[] }): string {
    return category.name;
  }

  // Event handlers
  onSearchChange(): void {
    // Search is reactive through computed property
  }

  onFilterChange(): void {
    // Filter is reactive through computed property
  }

  // Utility methods
  getCategoryIcon(category: MaterialCategory): string {
    const icons: Record<MaterialCategory, string> = {
      [MaterialCategory.PAPER]: 'description',
      [MaterialCategory.PLASTIC_FILM]: 'polymer',
      [MaterialCategory.CARDBOARD]: 'inventory_2',
      [MaterialCategory.ADHESIVE]: 'water_drop',
      [MaterialCategory.INK]: 'palette',
      [MaterialCategory.SOLVENT]: 'science',
      [MaterialCategory.OTHER]: 'category'
    };
    return icons[category] || 'category';
  }

  getCategoryLabel(category: MaterialCategory): string {
    const labels: Record<MaterialCategory, string> = {
      [MaterialCategory.PAPER]: 'Papel',
      [MaterialCategory.PLASTIC_FILM]: 'Film Plástico',
      [MaterialCategory.CARDBOARD]: 'Cartón',
      [MaterialCategory.ADHESIVE]: 'Adhesivo',
      [MaterialCategory.INK]: 'Tinta',
      [MaterialCategory.SOLVENT]: 'Solvente',
      [MaterialCategory.OTHER]: 'Otro'
    };
    return labels[category] || category;
  }

  getCategoryColor(category: MaterialCategory): string {
    const colors: Record<MaterialCategory, string> = {
      [MaterialCategory.PAPER]: 'primary',
      [MaterialCategory.PLASTIC_FILM]: 'accent',
      [MaterialCategory.CARDBOARD]: 'primary',
      [MaterialCategory.ADHESIVE]: 'warn',
      [MaterialCategory.INK]: '',
      [MaterialCategory.SOLVENT]: 'accent',
      [MaterialCategory.OTHER]: ''
    };
    return colors[category] || '';
  }

  getUnitLabel(unit: MaterialUnit): string {
    const labels: Record<MaterialUnit, string> = {
      [MaterialUnit.KG]: 'kg',
      [MaterialUnit.M2]: 'm²',
      [MaterialUnit.LINEAR_M]: 'm',
      [MaterialUnit.UNITS]: 'unidades',
      [MaterialUnit.LITERS]: 'litros'
    };
    return labels[unit] || unit;
  }
}
