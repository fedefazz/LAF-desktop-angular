import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { OrigenScrapService } from '../services/origen-scrap.service';
import { OrigenScrapDto, MaquinaDto, TipoMaterialDto } from '../models/origen-scrap.model';
import { OrigenScrapDialogComponent } from '../origen-scrap-dialog/origen-scrap-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-origen-scrap-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule
  ],
  template: `
    <div style="padding: 24px">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px">
        <h1 style="margin: 0; color: #1976d2">Origen Scrap</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Nuevo Origen
        </button>
      </div>

      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 16px">
        <mat-label>Buscar</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input matInput [(ngModel)]="searchText" (ngModelChange)="applyFilter()" placeholder="Buscar por descripción...">
      </mat-form-field>

      <div *ngIf="loading" style="text-align: center; padding: 40px">
        <mat-spinner diameter="40" style="margin: auto"></mat-spinner>
      </div>

      <table *ngIf="!loading" mat-table [dataSource]="filtered" style="width: 100%">

        <ng-container matColumnDef="IDOrigen">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let row">{{ row.IDOrigen }}</td>
        </ng-container>

        <ng-container matColumnDef="Descripcion">
          <th mat-header-cell *matHeaderCellDef>Descripción</th>
          <td mat-cell *matCellDef="let row"><strong>{{ row.Descripcion.trim() }}</strong></td>
        </ng-container>

        <ng-container matColumnDef="Maquina">
          <th mat-header-cell *matHeaderCellDef>Máquina</th>
          <td mat-cell *matCellDef="let row">{{ getMaquinaNombre(row.idmaquina) }}</td>
        </ng-container>

        <ng-container matColumnDef="Materiales">
          <th mat-header-cell *matHeaderCellDef>Tipos de Material</th>
          <td mat-cell *matCellDef="let row">
            <span *ngIf="!row.PSSTiposMaterial?.length" style="color: #999">—</span>
            <mat-chip-set *ngIf="row.PSSTiposMaterial?.length">
              <mat-chip *ngFor="let t of row.PSSTiposMaterial" style="font-size: 12px">
                {{ t.Descripcion.trim() }}
              </mat-chip>
            </mat-chip-set>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let row">
            <button mat-icon-button color="primary" matTooltip="Editar" (click)="openDialog(row)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" matTooltip="Eliminar" (click)="delete(row)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    </div>
  `
})
export class OrigenScrapListComponent implements OnInit {
  private service = inject(OrigenScrapService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  columns = ['IDOrigen', 'Descripcion', 'Maquina', 'Materiales', 'actions'];
  origenes: OrigenScrapDto[] = [];
  filtered: OrigenScrapDto[] = [];
  maquinas: MaquinaDto[] = [];
  tiposMaterial: TipoMaterialDto[] = [];
  searchText = '';
  loading = true;

  ngOnInit(): void {
    forkJoin({
      origenes: this.service.getOrigenes(),
      maquinas: this.service.getMaquinas(),
      tipos: this.service.getTiposMaterial()
    }).subscribe({
      next: ({ origenes, maquinas, tipos }) => {
        this.origenes = origenes;
        this.maquinas = maquinas;
        this.tiposMaterial = tipos;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar datos', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const q = this.searchText.trim().toLowerCase();
    this.filtered = q
      ? this.origenes.filter(o => o.Descripcion.trim().toLowerCase().includes(q))
      : [...this.origenes];
  }

  getMaquinaNombre(id?: number): string {
    if (!id) return '—';
    return this.maquinas.find(m => m.IDMaq === id)?.Descripcion.trim() ?? '—';
  }

  openDialog(origen?: OrigenScrapDto): void {
    const ref = this.dialog.open(OrigenScrapDialogComponent, {
      width: '550px',
      data: {
        origen,
        isEdit: !!origen,
        maquinas: this.maquinas,
        tiposMaterial: this.tiposMaterial
      }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      if (origen) {
        this.service.updateOrigen(origen.IDOrigen, { IDOrigen: origen.IDOrigen, ...result }).subscribe({
          next: () => {
            this.snackBar.open('Origen actualizado', 'Cerrar', { duration: 3000 });
            this.load();
          },
          error: () => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 })
        });
      } else {
        this.service.createOrigen(result).subscribe({
          next: () => {
            this.snackBar.open('Origen creado', 'Cerrar', { duration: 3000 });
            this.load();
          },
          error: () => this.snackBar.open('Error al crear', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }

  delete(origen: OrigenScrapDto): void {
    if (!confirm(`¿Eliminar "${origen.Descripcion.trim()}"?`)) return;
    this.service.deleteOrigen(origen.IDOrigen).subscribe({
      next: () => {
        this.snackBar.open('Origen eliminado', 'Cerrar', { duration: 3000 });
        this.load();
      },
      error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }

  private load(): void {
    this.loading = true;
    this.service.getOrigenes().subscribe({
      next: o => { this.origenes = o; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
