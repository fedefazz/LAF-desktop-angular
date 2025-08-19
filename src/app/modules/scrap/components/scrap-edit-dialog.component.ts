import { Component, OnInit, inject, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { ScrapService } from '../services/scrap.service';
import { ScrapDto, OperadoresDto, MaquinasDto, ActividadDto, OrigenesScrapDto, TiposMaterialDto } from '../models/scrap.model';

export interface ScrapEditDialogData {
  scrapId: number;
}

@Component({
  selector: 'app-scrap-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="scrap-edit-dialog">
      <div mat-dialog-title class="dialog-header">
        <div class="title-content">
          <mat-icon class="title-icon">edit</mat-icon>
          <h2>Editar Scrap #{{scrapData()?.IdRegScrap || data.scrapId}}</h2>
        </div>
        <button mat-icon-button mat-dialog-close class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        @if (loading()) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Cargando datos del scrap...</p>
          </div>
        } @else if (scrapForm) {
          <form [formGroup]="scrapForm" class="scrap-form">
            <!-- Primera fila: ID, Fecha, OP (3 columnas) -->
            <div class="form-row three-columns">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>ID</mat-label>
                <input matInput formControlName="IdRegScrap" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Fecha</mat-label>
                <input matInput formControlName="Fecha" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>OP</mat-label>
                <input matInput formControlName="NumOP" readonly>
              </mat-form-field>
            </div>

            <!-- Segunda fila: Máquina, Origen de Scrap, Tipo de Material (3 columnas) -->
            <div class="form-row three-columns">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Máquina</mat-label>
                <mat-select formControlName="PSSMaquinas" [compareWith]="compareMaquinas">
                  @for (maquina of maquinas(); track maquina.IDMaq) {
                    <mat-option [value]="maquina">{{maquina.Descripcion}}</mat-option>
                  }
                </mat-select>
                @if (scrapForm.get('PSSMaquinas')?.hasError('required')) {
                  <mat-error>La máquina es requerida</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Origen de Scrap</mat-label>
                <mat-select formControlName="PSSOrigenesScrap" [compareWith]="compareOrigenes">
                  @for (origen of origenes(); track origen.IDOrigen) {
                    <mat-option [value]="origen">{{origen.Descripcion}}</mat-option>
                  }
                </mat-select>
                @if (scrapForm.get('PSSOrigenesScrap')?.hasError('required')) {
                  <mat-error>El origen de scrap es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Tipo de Material</mat-label>
                <mat-select formControlName="PSSTiposMaterial" [compareWith]="compareTiposMaterial">
                  @for (tipo of tiposMaterial(); track tipo.IDTipoMat) {
                    <mat-option [value]="tipo">{{tipo.Descripcion}}</mat-option>
                  }
                </mat-select>
                @if (scrapForm.get('PSSTiposMaterial')?.hasError('required')) {
                  <mat-error>El tipo de material es requerido</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Tercera fila: Operador, Actividad, Peso (3 columnas) -->
            <div class="form-row three-columns">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Operador</mat-label>
                <mat-select formControlName="PSSOperadores" [compareWith]="compareOperadores">
                  @for (operador of operadores(); track operador.IdOperador) {
                    <mat-option [value]="operador">
                      {{operador.Apellido}}, {{operador.Nombre}}
                    </mat-option>
                  }
                </mat-select>
                @if (scrapForm.get('PSSOperadores')?.hasError('required')) {
                  <mat-error>El operador es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Actividad</mat-label>
                <mat-select formControlName="PSSActividades" [compareWith]="compareActividades">
                  @for (actividad of actividades(); track actividad.IdActividad) {
                    <mat-option [value]="actividad">{{actividad.Descripcion}}</mat-option>
                  }
                </mat-select>
                @if (scrapForm.get('PSSActividades')?.hasError('required')) {
                  <mat-error>La actividad es requerida</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Peso (kg)</mat-label>
                <input matInput type="number" formControlName="Peso" step="0.01" min="0">
                @if (scrapForm.get('Peso')?.hasError('required')) {
                  <mat-error>El peso es requerido</mat-error>
                }
                @if (scrapForm.get('Peso')?.hasError('min')) {
                  <mat-error>El peso debe ser mayor a 0</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Cuarta fila: Observaciones (ancho completo) -->
            <div class="form-row single-column">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Observaciones</mat-label>
                <textarea matInput formControlName="Observaciones" rows="4" maxlength="500"></textarea>
                <mat-hint>{{scrapForm.get('Observaciones')?.value?.length || 0}}/500</mat-hint>
              </mat-form-field>
            </div>
          </form>
        }
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button mat-dialog-close type="button" class="cancel-button">
          <mat-icon>cancel</mat-icon>
          Cancelar
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="save()" 
          [disabled]="!scrapForm.valid || saving()"
          class="save-button">
          @if (saving()) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            <mat-icon>save</mat-icon>
          }
          {{saving() ? 'Guardando...' : 'Guardar'}}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .scrap-edit-dialog {
      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, #1976d2, #1565c0);
        color: white;
        .title-content {
          display: flex;
          align-items: center;
          gap: 12px;
          .title-icon {
            font-size: 28px;
            width: 28px;
            height: 28px;
          }
          h2 {
            margin: 0;
            font-weight: 400;
            font-size: 1.5rem;
          }
        }
        .close-button {
          color: white;
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
      }
      .dialog-content {
        padding: 24px;
        overflow: visible;
        max-height: none;
        flex: 1;
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          gap: 20px;
          text-align: center;
          p {
            color: #666;
            margin: 0;
          }
        }
        .scrap-form {
          .form-row {
            display: grid;
            gap: 20px;
            margin-bottom: 20px;
            align-items: start;
            &.single-column {
              grid-template-columns: 1fr;
            }
            &.three-columns {
              grid-template-columns: repeat(3, 1fr);
            }
            @media (max-width: 1200px) {
              &.three-columns {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            @media (max-width: 768px) {
              &.three-columns {
                grid-template-columns: 1fr;
              }
            }
            .form-field {
              min-width: 0;
              &.full-width {
                grid-column: 1 / -1;
              }
            }
          }
          mat-form-field {
            .mat-mdc-text-field-wrapper {
              border-radius: 8px;
              min-height: 56px;
            }
            .mat-mdc-form-field-wrapper {
              min-height: 70px;
            }
            &.mat-form-field-appearance-outline {
              .mat-mdc-form-field-flex {
                min-height: 56px;
              }
            }
          }
        }
      }
      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 16px;
        padding: 24px;
        background-color: #f8f9fa;
        border-top: 1px solid #e0e0e0;
        .cancel-button, .save-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 140px;
          height: 48px;
          font-size: 16px;
          border-radius: 8px;
        }
        .cancel-button {
          color: #666;
          background: #fff;
          border: 1px solid #e0e0e0;
          &:hover {
            background-color: #f5f5f5;
          }
        }
        .save-button {
          background-color: #1976d2;
          color: white;
          &:hover:not(:disabled) {
            background-color: #1565c0;
          }
          &:disabled {
            background-color: #ccc;
            color: #666;
          }
          mat-spinner {
            margin-right: 8px;
          }
        }
      }
    }
    // Responsive
    @media (max-width: 768px) {
      .scrap-edit-dialog {
        .dialog-content .scrap-form .form-row {
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 16px;
          &.single-column {
            grid-template-columns: 1fr;
          }
          .form-field {
            min-width: unset;
          }
        }
        .dialog-actions {
          flex-direction: column;
          align-items: stretch;
          .cancel-button, .save-button {
            width: 100%;
            min-width: unset;
            margin-bottom: 8px;
          }
        }
      }
    }
  `]
})
export class ScrapEditDialogComponent implements OnInit {
  private scrapService = inject(ScrapService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ScrapEditDialogComponent>);

  // Signals
  loading = signal(true);
  saving = signal(false);
  scrapData = signal<ScrapDto | null>(null);
  operadores = signal<OperadoresDto[]>([]);
  actividades = signal<ActividadDto[]>([]);
  tiposMaterial = signal<TiposMaterialDto[]>([]);
  maquinas = signal<MaquinasDto[]>([]);
  origenes = signal<OrigenesScrapDto[]>([]);

  scrapForm!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ScrapEditDialogData) {}

  ngOnInit(): void {
    console.log('ScrapEditDialog ngOnInit iniciado');
    this.initializeForm();
    console.log('Formulario inicializado');
    // Cargar catálogos primero, luego los datos del scrap
    this.loadCatalogs().then(() => {
      console.log('Catálogos cargados, ahora cargando datos del scrap');
      this.loadScrapData();
    }).catch(error => {
      console.error('Error en loadCatalogs:', error);
    });
  }

  private initializeForm(): void {
    this.scrapForm = this.fb.group({
      IdRegScrap: [{value: '', disabled: true}],
      Fecha: [{value: '', disabled: true}],
      NumOP: [{value: '', disabled: true}],
      PSSMaquinas: [null, Validators.required],
      PSSOrigenesScrap: [null, Validators.required],
      PSSOperadores: [null, Validators.required],
      PSSTiposMaterial: [null, Validators.required],
      PSSActividades: [null, Validators.required],
      Peso: [0, [Validators.required, Validators.min(0.01)]],
      Observaciones: ['', Validators.maxLength(500)]
    });
  }

  private loadScrapData(): void {
    this.scrapService.getScrapById(this.data.scrapId).subscribe({
      next: (scrap) => {
        this.scrapData.set(scrap);
        this.populateForm(scrap);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading scrap data:', error);
        this.loading.set(false);
        this.snackBar.open('Error al cargar los datos del scrap. Verifique la conexión con el servidor.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snack']
        });
        this.dialogRef.close();
      }
    });
  }

  private loadCatalogs(): Promise<void> {
    return new Promise((resolve) => {
      // Cargar todos los catálogos en paralelo
      forkJoin({
        operadores: this.scrapService.getOperadores(),
        actividades: this.scrapService.getActividades(),
        tiposMaterial: this.scrapService.getTiposMaterial(),
        maquinas: this.scrapService.getMaquinas(),
        origenes: this.scrapService.getOrigenes()
      }).subscribe({
        next: ({ operadores, actividades, tiposMaterial, maquinas, origenes }: {
          operadores: OperadoresDto[],
          actividades: ActividadDto[],
          tiposMaterial: TiposMaterialDto[],
          maquinas: MaquinasDto[],
          origenes: OrigenesScrapDto[]
        }) => {
          console.log('Operadores cargados:', operadores);
          console.log('Actividades cargadas:', actividades);
          console.log('Tipos Material cargados:', tiposMaterial);
          console.log('Máquinas cargadas:', maquinas);
          console.log('Orígenes cargados:', origenes);
          
          this.operadores.set(operadores);
          this.actividades.set(actividades);
          this.tiposMaterial.set(tiposMaterial);
          this.maquinas.set(maquinas);
          this.origenes.set(origenes);
          resolve();
        },
        error: (error: any) => {
          console.error('Error loading catalog data:', error);
          this.loading.set(false);
          this.snackBar.open('Error al cargar los catálogos. Verifique la conexión con el servidor.', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snack']
          });
          // Cerrar el modal si no se pueden cargar los catálogos
          this.dialogRef.close();
        }
      });
    });
  }

  private populateForm(scrap: ScrapDto): void {
    console.log('Populando formulario con scrap:', scrap);
    // Primero establecemos los valores básicos
    this.scrapForm.patchValue({
      IdRegScrap: scrap.IdRegScrap,
      Fecha: this.formatDate(scrap.Fecha),
      NumOP: scrap.NumOP,
      Peso: scrap.Peso,
      Observaciones: scrap.Observaciones
    });

    console.log('Valores básicos establecidos, ahora mapeando catálogos...');
    // Mapear los objetos de catálogo (ya están cargados)
    this.mapCatalogValues(scrap);
    console.log('Formulario poblado completamente');
  }

  private mapCatalogValues(scrap: ScrapDto): void {
    console.log('Mapeando valores de catálogos...');
    console.log('Operadores disponibles:', this.operadores().length);
    console.log('Máquinas disponibles:', this.maquinas().length);
    console.log('Orígenes disponibles:', this.origenes().length);
    console.log('Tipos Material disponibles:', this.tiposMaterial().length);
    console.log('Actividades disponibles:', this.actividades().length);

    // Mapear operador
    if (scrap.PSSOperadores?.IdOperador) {
      console.log('Buscando operador con ID:', scrap.PSSOperadores.IdOperador);
      const operador = this.operadores().find(op => 
        op.IdOperador === scrap.PSSOperadores?.IdOperador
      );
      console.log('Operador encontrado:', operador);
      if (operador) {
        this.scrapForm.patchValue({ PSSOperadores: operador });
      }
    }

    // Mapear máquina
    if (scrap.PSSMaquinas?.IDMaq) {
      console.log('Buscando máquina con ID:', scrap.PSSMaquinas.IDMaq);
      const maquina = this.maquinas().find(maq => 
        maq.IDMaq === scrap.PSSMaquinas?.IDMaq
      );
      console.log('Máquina encontrada:', maquina);
      if (maquina) {
        this.scrapForm.patchValue({ PSSMaquinas: maquina });
      }
    }

    // Mapear origen de scrap
    if (scrap.PSSOrigenesScrap?.IDOrigen) {
      console.log('Buscando origen con ID:', scrap.PSSOrigenesScrap.IDOrigen);
      const origen = this.origenes().find(org => 
        org.IDOrigen === scrap.PSSOrigenesScrap?.IDOrigen
      );
      console.log('Origen encontrado:', origen);
      if (origen) {
        this.scrapForm.patchValue({ PSSOrigenesScrap: origen });
      }
    }

    // Mapear tipo de material
    if (scrap.PSSTiposMaterial?.IDTipoMat) {
      const tipoMaterial = this.tiposMaterial().find(tipo => 
        tipo.IDTipoMat === scrap.PSSTiposMaterial?.IDTipoMat
      );
      if (tipoMaterial) {
        this.scrapForm.patchValue({ PSSTiposMaterial: tipoMaterial });
        console.log('Tipo Material seleccionado:', tipoMaterial.Descripcion);
      }
    } else if (scrap.IdTipoMat) {
      const tipoMaterial = this.tiposMaterial().find(tipo => 
        tipo.IDTipoMat === scrap.IdTipoMat
      );
      if (tipoMaterial) {
        this.scrapForm.patchValue({ PSSTiposMaterial: tipoMaterial });
        console.log('Tipo Material seleccionado:', tipoMaterial.Descripcion);
      }
    }

    // Mapear actividad
    if (scrap.PSSActividades?.IdActividad) {
      console.log('Buscando actividad con ID:', scrap.PSSActividades.IdActividad);
      const actividad = this.actividades().find(act => 
        act.IdActividad === scrap.PSSActividades?.IdActividad
      );
      console.log('Actividad encontrada:', actividad);
      if (actividad) {
        this.scrapForm.patchValue({ PSSActividades: actividad });
      }
    }
  }

  private formatDate(date: Date | string): string {
    try {
      const d = new Date(date);
      return d.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  }

  save(): void {
    if (!this.scrapForm.valid || !this.scrapData()) {
      return;
    }

    this.saving.set(true);
    const formValue = this.scrapForm.getRawValue();

    // Enviar todos los campos requeridos por el backend, formato ISO para fecha
    const updateData: any = {
      IdRegScrap: this.scrapData()?.IdRegScrap,
      Fecha: this.scrapData()?.Fecha instanceof Date
        ? (this.scrapData()?.Fecha as Date).toISOString()
        : this.scrapData()?.Fecha,
      NumOP: this.scrapData()?.NumOP,
      IdMaq: formValue.PSSMaquinas?.IDMaq,
      IdOperador: formValue.PSSOperadores?.IdOperador,
      IdActividad: formValue.PSSActividades?.IdActividad,
      IdTipoMat: formValue.PSSTiposMaterial?.IDTipoMat,
      IdOrigenScrap: formValue.PSSOrigenesScrap?.IDOrigen,
      Peso: formValue.Peso,
      Observaciones: formValue.Observaciones,
      FechaRegistro: this.scrapData()?.FechaRegistro || new Date().toISOString(),
      Habilitado: true,
      IdMaqImputaScrap: this.scrapData()?.IdMaqImputaScrap || formValue.PSSMaquinas?.IDMaq,
      IdMaqImputaScrapName: this.scrapData()?.IdMaqImputaScrapName || '',
      // Catálogos como objetos, solo con los campos requeridos
      PSSActividades: formValue.PSSActividades ? {
        IdActividad: formValue.PSSActividades.IdActividad,
        Descripcion: formValue.PSSActividades.Descripcion,
        Habilitada: true
      } : null,
      PSSMaquinas: formValue.PSSMaquinas ? {
        IDMaq: formValue.PSSMaquinas.IDMaq,
        Descripcion: formValue.PSSMaquinas.Descripcion,
        Recurso: formValue.PSSMaquinas.Recurso,
        IDArea: formValue.PSSMaquinas.IDArea,
        Habilitado: true
      } : null,
      PSSOperadores: formValue.PSSOperadores ? {
        IdOperador: formValue.PSSOperadores.IdOperador,
        Nombre: formValue.PSSOperadores.Nombre,
        Apellido: formValue.PSSOperadores.Apellido,
        Habilitado: true,
        Legajo: formValue.PSSOperadores.Legajo
      } : null,
      PSSOrigenesScrap: formValue.PSSOrigenesScrap ? {
        IDOrigen: formValue.PSSOrigenesScrap.IDOrigen,
        Descripcion: formValue.PSSOrigenesScrap.Descripcion,
        Habilitado: true,
        idmaquina: formValue.PSSOrigenesScrap.idmaquina
      } : null,
      PSSTiposMaterial: formValue.PSSTiposMaterial ? {
        IDTipoMat: formValue.PSSTiposMaterial.IDTipoMat,
        Descripcion: formValue.PSSTiposMaterial.Descripcion,
        Habilitado: true
      } : null
    };

    this.scrapService.updateScrap(this.data.scrapId, updateData).subscribe({
      next: () => {
        // Tras el PUT, obtener el registro actualizado del backend
        this.scrapService.getScrapById(this.data.scrapId).subscribe({
          next: (freshScrap) => {
            this.saving.set(false);
            this.snackBar.open('Scrap actualizado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snack']
            });
            // Emitir el scrap actualizado para que el listado refresque
            this.dialogRef.close({ updated: true, scrap: freshScrap });
          },
          error: (error) => {
            this.saving.set(false);
            console.error('Error obteniendo scrap actualizado:', error);
            this.snackBar.open('Scrap actualizado pero no se pudo refrescar', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snack']
            });
            // Cerrar igual, pero con el objeto "viejo" (no ideal)
            this.dialogRef.close({ updated: true });
          }
        });
      },
      error: (error) => {
        this.saving.set(false);
        console.error('Error updating scrap:', error);
        this.snackBar.open('Error al actualizar el scrap', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snack']
        });
      }
    });
  }

  // Compare functions for mat-select
  compareOperadores(o1: OperadoresDto, o2: OperadoresDto): boolean {
    return o1 && o2 ? o1.IdOperador === o2.IdOperador : o1 === o2;
  }

  compareMaquinas(m1: MaquinasDto, m2: MaquinasDto): boolean {
    return m1 && m2 ? m1.IDMaq === m2.IDMaq : m1 === m2;
  }

  compareOrigenes(o1: OrigenesScrapDto, o2: OrigenesScrapDto): boolean {
    return o1 && o2 ? o1.IDOrigen === o2.IDOrigen : o1 === o2;
  }

  compareActividades(a1: ActividadDto, a2: ActividadDto): boolean {
    return a1 && a2 ? a1.IdActividad === a2.IdActividad : a1 === a2;
  }

  compareTiposMaterial(t1: TiposMaterialDto, t2: TiposMaterialDto): boolean {
    return t1 && t2 ? t1.IDTipoMat === t2.IDTipoMat : t1 === t2;
  }
}
