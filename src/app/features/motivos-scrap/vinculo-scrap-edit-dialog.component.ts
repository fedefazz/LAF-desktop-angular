import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

export interface VinculoScrapDialogData {
  maquinas?: any[];
  origenes?: any[];
  tiposMaterial?: any[];
  recursos?: any[];
  vinculo?: any;
  isEdit?: boolean;
}

@Component({
  selector: 'app-vinculo-scrap-edit-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
  template: `
    <div class="vinculo-edit-dialog">
      <div class="dialog-header">
        <div class="title-content">
          <mat-icon class="title-icon">link</mat-icon>
          <h2>{{ data?.isEdit ? 'Editar vínculo' : 'Agregar vínculo' }}</h2>
        </div>
        <button mat-icon-button (click)="onCancel()" class="close-button" type="button" aria-label="Cerrar">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="dialog-content">
        <form [formGroup]="form" class="vinculo-form" (ngSubmit)="onSave()">
          <div class="form-row two-columns">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Máquina</mat-label>
              <mat-select formControlName="Id_Maquina" required>
                <mat-option *ngFor="let m of data.maquinas" [value]="m.IDMaq">{{ m.Descripcion }}</mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('Id_Maquina')?.hasError('required')">Campo obligatorio</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Origen</mat-label>
              <mat-select formControlName="Id_Origen" required>
                <mat-option *ngFor="let o of data.origenes" [value]="o.IDOrigen">{{ o.Descripcion }}</mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('Id_Origen')?.hasError('required')">Campo obligatorio</mat-error>
            </mat-form-field>
          </div>
          <div class="form-row two-columns">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Tipo Material</mat-label>
              <mat-select formControlName="Id_TipoMaterial" required>
                <mat-option *ngFor="let t of data.tiposMaterial" [value]="t.IDTipoMat">{{ t.Descripcion }}</mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('Id_TipoMaterial')?.hasError('required')">Campo obligatorio</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Recurso</mat-label>
              <mat-select formControlName="Id_Recurso" required>
                <mat-option *ngFor="let r of data.recursos" [value]="r.Id">{{ r.Descripcion }}</mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('Id_Recurso')?.hasError('required')">Campo obligatorio</mat-error>
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-button type="button" (click)="onCancel()" class="cancel-button">
              <mat-icon>cancel</mat-icon>
              Cancelar
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid" class="save-button">
              <mat-icon>save</mat-icon>
              {{ data?.isEdit ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .vinculo-edit-dialog {
      min-width: 600px;
      max-width: 900px;
      width: 100%;
      background: #fff;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.24);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
    }
    .title-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .title-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    h2 {
      margin: 0;
      font-weight: 400;
      font-size: 1.2rem;
    }
    .close-button {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .close-button:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }
    .dialog-content {
      padding: 24px;
      overflow: visible;
      flex: 1;
    }
    .vinculo-form .form-row {
      display: grid;
      gap: 20px;
      margin-bottom: 20px;
      align-items: start;
    }
    .vinculo-form .form-row.two-columns {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 900px) {
      .vinculo-form .form-row.two-columns {
        grid-template-columns: 1fr;
      }
    }
    .vinculo-form .form-field {
      min-width: 0;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
      padding: 16px 0 16px 0;
      background-color: #f8f9fa;
      border-top: 1px solid #e0e0e0;
    }
    .cancel-button, .save-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 110px;
      height: 40px;
      font-size: 15px;
      border-radius: 8px;
    }
    .cancel-button {
      color: #666;
      background: #fff;
      border: 1px solid #e0e0e0;
    }
    .cancel-button:hover {
      background-color: #f5f5f5;
    }
    .save-button {
      background-color: #1976d2;
      color: white;
    }
    .save-button:hover:not(:disabled) {
      background-color: #1565c0;
    }
    .save-button:disabled {
      background-color: #ccc;
      color: #666;
    }
    @media (max-width: 768px) {
      .vinculo-edit-dialog {
        min-width: 0;
        width: 98vw;
        max-width: 100vw;
      }
      .dialog-header {
        padding: 12px 8px 6px 12px;
      }
      .dialog-content {
        padding: 12px 8px 0 8px;
      }
      .dialog-actions {
        flex-direction: column;
        align-items: stretch;
        padding: 12px 8px 12px 8px;
      }
      .cancel-button, .save-button {
        width: 100%;
        min-width: unset;
        margin-bottom: 8px;
      }
    }
  `]
})
export class VinculoScrapEditDialogComponent {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<VinculoScrapEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VinculoScrapDialogData,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      Id_Maquina: [data?.vinculo?.Id_MaquinaImpute || null, Validators.required],
      Id_Origen: [data?.vinculo?.Id_Origen || null, Validators.required],
      Id_TipoMaterial: [data?.vinculo?.Id_TipoMaterial || null, Validators.required],
      Id_Recurso: [data?.vinculo?.Id_Recurso || null, Validators.required]
    });
  }
  onCancel() { this.dialogRef.close(); }
  onSave() {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    
    // Crear el objeto de resultado que coincida con VinculoDto
    const result = {
      Id_MaquinaImpute: formValue.Id_Maquina,
      Id_Origen: formValue.Id_Origen,
      Id_TipoMaterial: formValue.Id_TipoMaterial,
      Id_Recurso: formValue.Id_Recurso
    };
    
    // Si es edición, incluir el ID del vínculo existente
    if (this.data?.isEdit && this.data?.vinculo) {
      const vinculoAny = this.data.vinculo as any;
      if (vinculoAny.id) {
        (result as any).id = vinculoAny.id;
      } else if (vinculoAny.Id_Vinculo) {
        (result as any).Id_Vinculo = vinculoAny.Id_Vinculo;
      } else if (this.data.vinculo._tempId) {
        (result as any)._tempId = this.data.vinculo._tempId;
      }
    }
    
    this.dialogRef.close(result);
  }
}
