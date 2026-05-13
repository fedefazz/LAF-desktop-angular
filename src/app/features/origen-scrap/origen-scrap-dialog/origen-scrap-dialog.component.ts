import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrigenScrapDto, MaquinaDto, TipoMaterialDto } from '../models/origen-scrap.model';

export interface OrigenScrapDialogData {
  origen?: OrigenScrapDto;
  isEdit?: boolean;
  maquinas: MaquinaDto[];
  tiposMaterial: TipoMaterialDto[];
}

@Component({
  selector: 'app-origen-scrap-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Editar Origen Scrap' : 'Nuevo Origen Scrap' }}</h2>

    <mat-dialog-content style="min-width: 450px; padding-top: 12px">
      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>Descripción</mat-label>
        <input matInput [(ngModel)]="descripcion" maxlength="100">
      </mat-form-field>

      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>Máquina</mat-label>
        <mat-select [(ngModel)]="idmaquina">
          <mat-option [value]="null">-- Sin máquina --</mat-option>
          <mat-option *ngFor="let m of data.maquinas" [value]="m.IDMaq">
            {{ m.Descripcion.trim() }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>Tipos de Material</mat-label>
        <mat-select [(ngModel)]="tiposSeleccionados" multiple>
          <mat-option *ngFor="let t of data.tiposMaterial" [value]="t.IDTipoMat">
            {{ t.Descripcion.trim() }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="primary"
              (click)="onSave()"
              [disabled]="!descripcion || descripcion.trim().length === 0">
        {{ data.isEdit ? 'Guardar' : 'Crear' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class OrigenScrapDialogComponent {
  descripcion: string;
  idmaquina: number | null;
  tiposSeleccionados: number[];

  constructor(
    public dialogRef: MatDialogRef<OrigenScrapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrigenScrapDialogData
  ) {
    this.descripcion = (data.origen?.Descripcion ?? '').trim();
    this.idmaquina = data.origen?.idmaquina ?? null;
    this.tiposSeleccionados = (data.origen?.PSSTiposMaterial ?? []).map(t => t.IDTipoMat);
  }

  onSave(): void {
    this.dialogRef.close({
      Descripcion: this.descripcion.trim(),
      idmaquina: this.idmaquina,
      PSSTiposMaterial: this.tiposSeleccionados.map(id => ({ IDTipoMat: id }))
    });
  }
}
