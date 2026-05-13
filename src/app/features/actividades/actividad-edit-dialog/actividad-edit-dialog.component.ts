import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActividadDto } from '../models/actividad.model';

export interface ActividadEditDialogData {
  actividad?: ActividadDto;
  isCreate?: boolean;
  isEdit?: boolean;
}

@Component({
  selector: 'app-actividad-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.isCreate ? 'Nueva Actividad' : 'Editar Actividad' }}</h2>
    
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>Descripción</mat-label>
        <input matInput 
               [(ngModel)]="descripcion" 
               maxlength="100">
      </mat-form-field>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button 
              color="primary" 
              (click)="onSave()"
              [disabled]="!descripcion || descripcion.trim().length === 0">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class ActividadEditDialogComponent {
  descripcion: string;

  constructor(
    public dialogRef: MatDialogRef<ActividadEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActividadEditDialogData
  ) {
    this.descripcion = (data.actividad?.Descripcion ?? '').trim();
  }

  onSave(): void {
    this.dialogRef.close({ Descripcion: this.descripcion.trim() });
  }
}
