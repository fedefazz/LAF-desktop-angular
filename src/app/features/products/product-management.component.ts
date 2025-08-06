import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductService } from '../../core/services/product-api.service';
import { Product, ProductStatus } from '../../core/models/laf-business.model';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    FormsModule,
    RouterModule
  ],
  template: `
    <div class="product-management">
      <!-- Header Section -->
      <div class="header-section">
        <div class="title-section">
          <h1>
            <mat-icon>inventory</mat-icon>
            Gestión de Productos
          </h1>
          <p>Administra las órdenes de producción y productos del sistema</p>
        </div>
        
        <div class="actions-section">
          <button mat-raised-button color="primary" (click)="createProduct()">
            <mat-icon>add</mat-icon>
            Nuevo Producto
          </button>
          <button mat-button (click)="refreshData()">
            <mat-icon>refresh</mat-icon>
            Actualizar
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-section">
        <mat-card class="stat-card stat-total">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>inventory</mat-icon>
              </div>
              <div class="stat-details">
                <div class="stat-number">{{ productStats().total }}</div>
                <div class="stat-label">Total Productos</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card stat-open">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>play_circle</mat-icon>
              </div>
              <div class="stat-details">
                <div class="stat-number">{{ productStats().open }}</div>
                <div class="stat-label">Abiertos</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card stat-standby">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>pause_circle</mat-icon>
              </div>
              <div class="stat-details">
                <div class="stat-number">{{ productStats().standby }}</div>
                <div class="stat-label">Stand By</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card stat-closed">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>check_circle</mat-icon>
              </div>
              <div class="stat-details">
                <div class="stat-number">{{ productStats().closed }}</div>
                <div class="stat-label">Cerrados</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card stat-rush">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>flash_on</mat-icon>
              </div>
              <div class="stat-details">
                <div class="stat-number">{{ productStats().rushOrders }}</div>
                <div class="stat-label">Rush Orders</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Filters Section -->
      <mat-card class="filters-section">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline">
              <mat-label>Buscar</mat-label>
              <input matInput 
                     [(ngModel)]="searchQuery" 
                     (ngModelChange)="onSearchChange()"
                     placeholder="Buscar por código, nombre, cliente...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select [(ngModel)]="selectedStatus" (ngModelChange)="onFilterChange()">
                <mat-option value="">Todos</mat-option>
                <mat-option value="{{ ProductStatus.OPEN }}">Abierto</mat-option>
                <mat-option value="{{ ProductStatus.STANDBY }}">Stand By</mat-option>
                <mat-option value="{{ ProductStatus.CLOSED }}">Cerrado</mat-option>
                <mat-option value="{{ ProductStatus.CANCELLED }}">Cancelado</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha Desde</mat-label>
              <input matInput 
                     [matDatepicker]="fromPicker" 
                     [(ngModel)]="dateFrom"
                     (ngModelChange)="onFilterChange()">
              <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
              <mat-datepicker #fromPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha Hasta</mat-label>
              <input matInput 
                     [matDatepicker]="toPicker" 
                     [(ngModel)]="dateTo"
                     (ngModelChange)="onFilterChange()">
              <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
              <mat-datepicker #toPicker></mat-datepicker>
            </mat-form-field>

            <button mat-button (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Limpiar
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Products Table -->
      <mat-card class="table-section">
        <mat-card-content>
          @if (loading()) {
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Cargando productos...</p>
            </div>
          } @else {
            <div class="table-container">
              <table mat-table [dataSource]="filteredProducts()" class="products-table" matSort>
                
                <!-- Code Column -->
                <ng-container matColumnDef="code">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
                  <td mat-cell *matCellDef="let product">
                    <strong>{{ product.code }}</strong>
                  </td>
                </ng-container>

                <!-- Name Column -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Producto</th>
                  <td mat-cell *matCellDef="let product">
                    <div class="product-info">
                      <div class="product-name">{{ product.name }}</div>
                      <div class="product-customer">{{ product.customerName }}</div>
                    </div>
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let product">
                    <mat-chip-set>
                      <mat-chip [class]="'status-' + getStatusClass(product.status)">
                        {{ product.status }}
                      </mat-chip>
                      @if (product.rushOrder) {
                        <mat-chip class="rush-order">
                          <mat-icon>flash_on</mat-icon>
                          Rush
                        </mat-chip>
                      }
                    </mat-chip-set>
                  </td>
                </ng-container>

                <!-- Dates Column -->
                <ng-container matColumnDef="dates">
                  <th mat-header-cell *matHeaderCellDef>Fechas</th>
                  <td mat-cell *matCellDef="let product">
                    <div class="dates-info">
                      <div class="date-row">
                        <span class="date-label">Creación:</span>
                        <span class="date-value">{{ product.creationDate | date:'dd/MM/yyyy' }}</span>
                      </div>
                      <div class="date-row">
                        <span class="date-label">Deseada:</span>
                        <span class="date-value">{{ product.desiredDate | date:'dd/MM/yyyy' }}</span>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <!-- Progress Column -->
                <ng-container matColumnDef="progress">
                  <th mat-header-cell *matHeaderCellDef>Progreso</th>
                  <td mat-cell *matCellDef="let product">
                    <div class="progress-info">
                      <div class="progress-text">{{ product.days }} días</div>
                      @if (product.standByDays > 0) {
                        <div class="standby-text">{{ product.standByDays }} días StandBy</div>
                      }
                    </div>
                  </td>
                </ng-container>

                <!-- Commercial Column -->
                <ng-container matColumnDef="commercial">
                  <th mat-header-cell *matHeaderCellDef>Responsable</th>
                  <td mat-cell *matCellDef="let product">
                    {{ product.commercialResponsible }}
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let product">
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewProduct(product)">
                        <mat-icon>visibility</mat-icon>
                        Ver Detalles
                      </button>
                      <button mat-menu-item (click)="editProduct(product)">
                        <mat-icon>edit</mat-icon>
                        Editar
                      </button>
                      <button mat-menu-item (click)="changeStatus(product)">
                        <mat-icon>swap_horiz</mat-icon>
                        Cambiar Estado
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteProduct(product)" class="delete-action">
                        <mat-icon>delete</mat-icon>
                        Eliminar
                      </button>
                    </mat-menu>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                    class="product-row"
                    (click)="viewProduct(row)"></tr>
              </table>

              @if (filteredProducts().length === 0) {
                <div class="no-data">
                  <mat-icon>inventory_2</mat-icon>
                  <h3>No se encontraron productos</h3>
                  <p>Intenta ajustar los filtros o crear un nuevo producto</p>
                </div>
              }
            </div>

            <mat-paginator 
              [pageSizeOptions]="[5, 10, 25, 50]"
              [pageSize]="10"
              showFirstLastButtons>
            </mat-paginator>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  protected readonly ProductStatus = ProductStatus;
  
  // Inject service
  private productService = inject(ProductService);
  
  // Signals
  products = this.productService.products;
  loading = this.productService.loading;
  productStats = this.productService.stats;

  // Filters
  searchQuery = signal('');
  selectedStatus = signal('');
  dateFrom = signal<Date | null>(null);
  dateTo = signal<Date | null>(null);

  // Computed filtered products
  filteredProducts = computed(() => {
    let products = this.products();
    const query = this.searchQuery().toLowerCase();
    const status = this.selectedStatus();
    const from = this.dateFrom();
    const to = this.dateTo();

    if (query) {
      products = products.filter(p => 
        p.code.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.customerName.toLowerCase().includes(query) ||
        p.commercialResponsible.toLowerCase().includes(query)
      );
    }

    if (status) {
      products = products.filter(p => p.status === status);
    }

    if (from) {
      products = products.filter(p => new Date(p.creationDate) >= from);
    }

    if (to) {
      products = products.filter(p => new Date(p.creationDate) <= to);
    }

    return products;
  });

  displayedColumns: string[] = [
    'code', 'name', 'status', 'dates', 'progress', 'commercial', 'actions'
  ];

  constructor() {}

  ngOnInit(): void {
    this.productService.refreshProducts();
  }

  onSearchChange(): void {
    // Search is handled reactively by computed signal
  }

  onFilterChange(): void {
    // Filters are handled reactively by computed signal
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedStatus.set('');
    this.dateFrom.set(null);
    this.dateTo.set(null);
  }

  refreshData(): void {
    this.productService.refreshProducts();
  }

  createProduct(): void {
    // TODO: Navigate to create product form
    console.log('Create product');
  }

  viewProduct(product: Product): void {
    // TODO: Navigate to product details
    console.log('View product:', product);
  }

  editProduct(product: Product): void {
    // TODO: Navigate to edit product form
    console.log('Edit product:', product);
  }

  changeStatus(product: Product): void {
    // TODO: Open status change dialog
    console.log('Change status:', product);
  }

  deleteProduct(product: Product): void {
    // TODO: Open confirmation dialog
    console.log('Delete product:', product);
  }

  getStatusClass(status: ProductStatus): string {
    switch (status) {
      case ProductStatus.OPEN: return 'open';
      case ProductStatus.STANDBY: return 'standby';
      case ProductStatus.CLOSED: return 'closed';
      case ProductStatus.CANCELLED: return 'cancelled';
      default: return 'default';
    }
  }
}
