import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MotivoScrapDto } from '../../modules/scrap/models/motivo-scrap.model';
import { VinculoScrapEditDialogComponent, VinculoScrapDialogData } from './vinculo-scrap-edit-dialog.component';
import { VinculoScrapService, VinculoDto } from '../../modules/scrap/services/vinculo-scrap.service';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { inject } from '@angular/core';

export interface MotivoScrapEditDialogData {
  motivo?: MotivoScrapDto;
  isCreate?: boolean;
  isEdit?: boolean;
}

@Component({
  selector: 'app-motivo-scrap-edit-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatTableModule, MatTooltipModule],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ 
            opacity: 0, 
            transform: 'translateY(-20px) scale(0.95)',
            backgroundColor: '#e8f5e8'
          }),
          stagger('50ms', [
            animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ 
                opacity: 1, 
                transform: 'translateY(0) scale(1)',
                backgroundColor: 'white'
              })
            )
          ])
        ], { optional: true }),
        query(':leave', [
          stagger('50ms', [
            animate('250ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ 
                opacity: 0, 
                transform: 'translateX(100px) scale(0.8)',
                backgroundColor: '#ffebee'
              })
            )
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeSlide', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-in')
      ]),
      transition('* => void', [
        animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ],
 

  template: `
    <div class="motivo-edit-dialog">
      <div class="dialog-header">
        <div class="title-content">
          <mat-icon class="title-icon">category</mat-icon>
          <h2>{{ data.motivo ? 'Editar motivo' : 'Crear motivo' }}</h2>
        </div>
        <button mat-icon-button (click)="onCancel()" class="close-button" type="button" aria-label="Cerrar">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="dialog-content">
        <form [formGroup]="form" class="motivo-form" (ngSubmit)="onSave()">
          <div class="form-row single-column">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Descripción</mat-label>
              <input matInput formControlName="Descripcion" maxlength="100" required>
              <mat-error *ngIf="form.get('Descripcion')?.hasError('required')">Campo obligatorio</mat-error>
            </mat-form-field>
          </div>
          <div class="form-row single-column">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>% Mejora</mat-label>
              <input matInput type="number" formControlName="PorcentajeSimulacionMejora" step="0.1">
              <mat-hint>Puede ser positivo o negativo</mat-hint>
            </mat-form-field>
          </div>
          <div class="form-row single-column">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Habilitado</mat-label>
              <mat-select formControlName="Habilitado">
                <mat-option [value]="true">Sí</mat-option>
                <mat-option [value]="false">No</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Vínculos asociados - Solo en edición -->
          <div class="vinculos-section" *ngIf="data.isEdit">
            <div class="vinculos-header">
              <span>Vínculos asociados</span>
              <button mat-mini-fab color="primary" (click)="onAddVinculo()" type="button" aria-label="Agregar vínculo">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            <mat-table *ngIf="vinculos?.length" [dataSource]="vinculos" class="vinculos-table" [@listAnimation]="vinculos.length">
              <ng-container matColumnDef="maquina">
                <mat-header-cell *matHeaderCellDef>Máquina</mat-header-cell>
                <mat-cell *matCellDef="let v">{{ getMaquinaDescripcion(v) }}</mat-cell>
              </ng-container>
              <ng-container matColumnDef="origen">
                <mat-header-cell *matHeaderCellDef>Origen</mat-header-cell>
                <mat-cell *matCellDef="let v">{{ getOrigenDescripcion(v) }}</mat-cell>
              </ng-container>
              <ng-container matColumnDef="tipoMaterial">
                <mat-header-cell *matHeaderCellDef>Tipo Material</mat-header-cell>
                <mat-cell *matCellDef="let v">{{ getTipoMaterialDescripcion(v) }}</mat-cell>
              </ng-container>
              <ng-container matColumnDef="recurso">
                <mat-header-cell *matHeaderCellDef>Recurso</mat-header-cell>
                <mat-cell *matCellDef="let v">{{ getRecursoDescripcion(v) }}</mat-cell>
              </ng-container>
              <ng-container matColumnDef="acciones">
                <mat-header-cell *matHeaderCellDef>Acciones</mat-header-cell>
                <mat-cell *matCellDef="let v" class="actions-cell">
                  <button mat-icon-button color="primary" (click)="onEditVinculoClick($event, v)" aria-label="Editar vínculo" matTooltip="Editar vínculo">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="onDeleteVinculoClick($event, v)" aria-label="Eliminar vínculo" matTooltip="Eliminar vínculo">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-cell>
              </ng-container>
              <mat-header-row *matHeaderRowDef="vinculosDisplayedColumns"></mat-header-row>
              <mat-row *matRowDef="let row; columns: vinculosDisplayedColumns;" [@fadeSlide]></mat-row>
            </mat-table>
            <div *ngIf="!vinculos?.length" class="vinculos-empty">No hay vínculos asociados.</div>
          </div>

          <div class="dialog-actions">
            <button mat-button type="button" (click)="onCancel()" class="cancel-button">
              <mat-icon>cancel</mat-icon>
              Cancelar
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid" class="save-button">
              <mat-icon>save</mat-icon>
              Guardar
            </button>
          </div>
        </form>
          </div>
    </div>
  `,
  styles: [`
    .motivo-edit-dialog {
      min-width: 800px;
      max-width: 1200px;
      width: 100%;
      height: 100%;
      background: #fff;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.24);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    /* Backdrop personalizado para modal de confirmación */
    :host ::ng-deep .confirm-backdrop {
      background-color: rgba(0, 0, 0, 0.6) !important;
      z-index: 9999 !important;
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
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    h2 {
      margin: 0;
      font-weight: 400;
      font-size: 1.5rem;
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
      overflow-y: auto;
      flex: 1;
      max-height: calc(100vh - 200px);
    }
    .motivo-form .form-row {
      display: grid;
      gap: 20px;
      margin-bottom: 20px;
      align-items: start;
    }
    .motivo-form .form-row.single-column {
      grid-template-columns: 1fr;
    }
    .motivo-form .form-row.two-columns {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 900px) {
      .motivo-form .form-row.two-columns {
        grid-template-columns: 1fr;
      }
    }
    .motivo-form .form-field {
      min-width: 0;
    }
    .motivo-form .form-field.full-width {
      grid-column: 1 / -1;
    }
    .motivo-form mat-form-field .mat-mdc-text-field-wrapper {
      min-height: 56px;
    }
    .motivo-form mat-form-field .mat-mdc-form-field-wrapper {
      min-height: 70px;
    }
    .motivo-form mat-form-field.mat-form-field-appearance-outline .mat-mdc-form-field-flex {
      min-height: 56px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
      flex-shrink: 0;
    }
    .cancel-button, .save-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 140px;
      height: 48px;
      font-size: 16px;
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
      .motivo-edit-dialog {
        min-width: 0;
        width: 95vw;
        max-width: 95vw;
        height: 95vh;
      }
      .dialog-header {
        padding: 14px 12px 8px 16px;
      }
      .dialog-content {
        padding: 16px 8px 0 8px;
      }
      .dialog-actions {
        flex-direction: column;
        align-items: stretch;
        padding: 16px 8px 16px 8px;
      }
      .cancel-button, .save-button {
        width: 100%;
        min-width: unset;
        margin-bottom: 8px;
      }
    }
    
    /* Estilos para las secciones de vínculos y objetivos */
    .vinculos-section {
      margin-top: 24px;
      padding: 20px;
      background: #ffffff;
      border: 2px solid #1976d2;
      max-height: 500px;
      overflow-y: auto;
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
    }
    
    .vinculos-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      font-weight: 600;
      font-size: 16px;
      color: #1976d2;
      padding-bottom: 8px;
      border-bottom: 2px solid #e3f2fd;
    }
    
    .vinculos-table {
      width: 100%;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      max-height: 350px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      margin: 0 auto; /* Centrar la tabla */
    }
    
    .vinculos-table .mat-mdc-header-row {
      background: linear-gradient(135deg, #1976d2, #1565c0) !important;
      color: white !important;
      font-weight: 600 !important;
    }
    
    .vinculos-table .mat-mdc-header-cell {
      background: transparent !important;
      color: white !important;
      font-weight: 600 !important;
      border-bottom: 1px solid rgba(255,255,255,0.2) !important;
      padding: 16px 8px !important;
      text-align: center !important;
    }
    
    .vinculos-table .mat-mdc-header-cell:last-child {
      text-align: center !important;
      width: 120px !important;
    }
    
    .vinculos-table .mat-mdc-row {
      border-bottom: 1px solid #e0e0e0 !important;
      transition: all 0.3s cubic-bezier(0.35, 0, 0.25, 1) !important;
      opacity: 1 !important;
      transform: translateX(0) scale(1) !important;
    }
    
    .vinculos-table .mat-mdc-row:hover {
      background-color: #f5f7fa !important;
      transform: translateX(2px) scale(1.02) !important;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15) !important;
    }
    
    .vinculos-table .mat-mdc-row:nth-child(even) {
      background-color: #fafbfc !important;
    }
    
    .vinculos-table .mat-mdc-cell {
      padding: 12px 8px !important;
      font-size: 14px !important;
      color: #333 !important;
      border-bottom: 1px solid #e0e0e0 !important;
      transition: all 0.2s ease !important;
      text-align: center !important;
    }
    
    /* Estilos específicos para la columna de acciones */
    .vinculos-table .actions-cell {
      text-align: center !important;
      width: 120px !important;
      padding: 8px !important;
    }
    
    .vinculos-table .actions-cell button {
      margin: 0 4px !important;
    }
    
    /* Estilos para el botón de editar */
    .vinculos-table button[mat-icon-button][color="primary"] {
      color: #1976d2 !important;
      background: rgba(25, 118, 210, 0.1) !important;
      transition: all 0.3s cubic-bezier(0.35, 0, 0.25, 1) !important;
      transform: scale(1) !important;
    }
    
    .vinculos-table button[mat-icon-button][color="primary"]:hover {
      background: rgba(25, 118, 210, 0.2) !important;
      transform: scale(1.1) !important;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3) !important;
    }
    
    /* Estilos para el botón de eliminar */
    .vinculos-table button[mat-icon-button][color="warn"] {
      color: #d32f2f !important;
      background: rgba(211, 47, 47, 0.1) !important;
      transition: all 0.3s cubic-bezier(0.35, 0, 0.25, 1) !important;
      transform: scale(1) !important;
    }
    
    .vinculos-table button[mat-icon-button][color="warn"]:hover {
      background: rgba(211, 47, 47, 0.2) !important;
      transform: scale(1.1) !important;
      box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3) !important;
    }
    
    .vinculos-table button[mat-icon-button]:active {
      transform: scale(0.95) !important;
    }
    
    /* Estilos generales para todos los botones de acciones */
    .vinculos-table button[mat-icon-button] {
      border-radius: 8px !important;
      font-size: 18px !important;
    }
    
    /* Animación para el botón de agregar vínculo */
    button[mat-mini-fab] {
      transition: all 0.3s cubic-bezier(0.35, 0, 0.25, 1) !important;
      transform: scale(1) !important;
    }
    
    button[mat-mini-fab]:hover {
      transform: scale(1.1) !important;
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4) !important;
    }
    
    button[mat-mini-fab]:active {
      transform: scale(0.95) !important;
    }
    
    /* Animación para filas recién agregadas */
    .vinculos-table .mat-mdc-row.new-row {
      background: linear-gradient(90deg, #e8f5e8, #f0f8f0, white) !important;
      animation: highlightNew 2s ease-out !important;
    }
    
    @keyframes highlightNew {
      0% { 
        background: #e8f5e8 !important; 
        transform: translateX(-20px) scale(0.95) !important;
        opacity: 0 !important;
      }
      50% { 
        background: #f0f8f0 !important; 
        transform: translateX(0) scale(1.02) !important;
        opacity: 1 !important;
      }
      100% { 
        background: white !important; 
        transform: translateX(0) scale(1) !important;
        opacity: 1 !important;
      }
    }
    
    .vinculos-empty {
      text-align: center;
      padding: 40px;
      color: #666;
      font-style: italic;
      font-size: 16px;
      background: #f8f9fa;
      border: 2px dashed #ddd;
      margin: 16px auto;
      max-width: 400px;
      border-radius: 8px;
    }
  `]
})
export class MotivoScrapEditDialogComponent {
  vinculos: VinculoDto[] = [];
  vinculosDisplayedColumns = ['maquina', 'origen', 'tipoMaterial', 'recurso', 'acciones'];
  form: FormGroup;
  
  private vinculoService = inject(VinculoScrapService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // Función para trackBy de la tabla
  trackByVinculo(index: number, item: VinculoDto): any {
    return item._tempId || `${item.Id_MaquinaImpute}-${item.Id_Origen}-${item.Id_TipoMaterial}-${item.Id_Recurso}`;
  }

  // Funciones helper para obtener las descripciones específicas
  getMaquinaDescripcion(vinculo: VinculoDto): string {
    if (!vinculo.maquinas?.length) return 'N/A';
    const maquina = vinculo.maquinas.find((m: any) => m.IDMaq === vinculo.Id_MaquinaImpute);
    return maquina?.Descripcion || 'No encontrada';
  }

  getOrigenDescripcion(vinculo: VinculoDto): string {
    if (!vinculo.origenes?.length) return 'N/A';
    const origen = vinculo.origenes.find((o: any) => o.IDOrigen === vinculo.Id_Origen);
    return origen?.Descripcion || 'No encontrado';
  }

  getTipoMaterialDescripcion(vinculo: VinculoDto): string {
    if (!vinculo.tiposMaterial?.length) return 'N/A';
    const tipoMaterial = vinculo.tiposMaterial.find((t: any) => t.IDTipoMat === vinculo.Id_TipoMaterial);
    return tipoMaterial?.Descripcion || 'No encontrado';
  }

  getRecursoDescripcion(vinculo: VinculoDto): string {
    if (!vinculo.recursos?.length) return 'N/A';
    const recurso = vinculo.recursos.find((r: any) => r.Id === vinculo.Id_Recurso);
    return recurso?.Descripcion || 'No encontrado';
  }

  ngOnInit() {
    if (this.data.isEdit) {
      this.loadVinculos();
    }
  }

  loadVinculos() {
    // Solo cargar vínculos si hay un motivo y está en modo edición
    if (this.data.motivo && this.data.isEdit) {
      const idMotivo = this.data.motivo.Id_Motivo;
      this.vinculoService.getVinculosWithCatalogos(idMotivo).subscribe({
        next: (vinculos: VinculoDto[]) => {
          console.log('Vínculos cargados:', vinculos);
          this.vinculos = vinculos.filter(v => v.Id_Motivo); // Solo los que tienen ID de motivo (vínculos reales)
        },
        error: (err: any) => {
          console.error('Error cargando vínculos:', err);
        }
      });
    }
  }

  constructor(
    public dialogRef: MatDialogRef<MotivoScrapEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MotivoScrapEditDialogData,
    private fb: FormBuilder
  ) {
    const motivo = data.motivo ? { ...data.motivo } : {
      Id_Motivo: 0,
      Descripcion: '',
      Habilitado: true,
      PorcentajeSimulacionMejora: 0,
      pSSMotivosScrapObjetivos: [],
      pSSMotivosScrapVinculos: []
    };
    this.form = this.fb.group({
      Descripcion: [motivo.Descripcion, Validators.required],
      PorcentajeSimulacionMejora: [motivo.PorcentajeSimulacionMejora],
      Habilitado: [motivo.Habilitado, Validators.required]
    });
  }

  async onAddVinculo() {
    // Solo permitir agregar vínculos en modo edición
    if (!this.data.isEdit) return;
    
    // Cargar catálogos reales para el modal de vínculo
    const idMotivo = this.data.motivo?.Id_Motivo || 0;
    this.vinculoService.getVinculosWithCatalogos(0).subscribe({
      next: (catalogos: VinculoDto[]) => {
        console.log('Catálogos cargados:', catalogos);
        // El primer elemento contiene los catálogos
        const catalogoData = catalogos[0];
        const maquinas = catalogoData.maquinas || [];
        const origenes = catalogoData.origenes || [];
        const tiposMaterial = catalogoData.tiposMaterial || [];
        const recursos = catalogoData.recursos || [];
        
        if (!maquinas.length || !origenes.length || !tiposMaterial.length || !recursos.length) {
          alert('Error: Uno o más catálogos están vacíos. Revisa la respuesta en la consola.');
        }
        
        const dialogRef = this.dialog.open(VinculoScrapEditDialogComponent, {
          width: '800px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          data: { maquinas, origenes, tiposMaterial, recursos } as VinculoScrapDialogData,
          disableClose: true,
          autoFocus: false,
          restoreFocus: false
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('Resultado del formulario de vínculo:', result);
            
            // Buscar los objetos completos en los catálogos
            const maquinaSeleccionada = maquinas.find((m: any) => m.IDMaq === result.Id_Maquina);
            const origenSeleccionado = origenes.find((o: any) => o.IDOrigen === result.Id_Origen);
            const tipoMaterialSeleccionado = tiposMaterial.find((t: any) => t.IDTipoMat === result.Id_TipoMaterial);
            const recursoSeleccionado = recursos.find((r: any) => r.Id === result.Id_Recurso);
            
            console.log('Objetos encontrados:', {
              maquina: maquinaSeleccionada,
              origen: origenSeleccionado,
              tipoMaterial: tipoMaterialSeleccionado,
              recurso: recursoSeleccionado
            });
            
            // Crear el nuevo vínculo con un ID único temporal
            const nuevoVinculo = {
              Id_MaquinaImpute: result.Id_Maquina,
              Id_Origen: result.Id_Origen,
              Id_TipoMaterial: result.Id_TipoMaterial,
              Id_Recurso: result.Id_Recurso,
              Id_Motivo: idMotivo,
              // Usar una estructura más robusta para mostrar los datos
              maquinas: maquinaSeleccionada ? [maquinaSeleccionada] : [{ Descripcion: 'No encontrada' }],
              origenes: origenSeleccionado ? [origenSeleccionado] : [{ Descripcion: 'No encontrado' }],
              tiposMaterial: tipoMaterialSeleccionado ? [tipoMaterialSeleccionado] : [{ Descripcion: 'No encontrado' }],
              recursos: recursoSeleccionado ? [recursoSeleccionado] : [{ Descripcion: 'No encontrado' }],
              // Agregar un ID temporal único para diferenciarlo
              _tempId: Date.now()
            };
            
            console.log('Nuevo vínculo creado:', nuevoVinculo);
            
            this.vinculos = [...this.vinculos, nuevoVinculo];
            console.log('Lista de vínculos actualizada:', this.vinculos);
          }
        });
      },
      error: (err: any) => {
        alert('Error al cargar catálogos de vínculos. Revisa la consola.');
        console.error('Error en getVinculosWithCatalogos:', err);
      }
    });
  }

  onDeleteVinculo(vinculo: VinculoDto) {
    console.log('Solicitando eliminación de vínculo:', vinculo);
    
    // Obtener las descripciones para mostrar en la confirmación
    const maquinaDesc = this.getMaquinaDescripcion(vinculo);
    const origenDesc = this.getOrigenDescripcion(vinculo);
    const tipoMaterialDesc = this.getTipoMaterialDescripcion(vinculo);
    const recursoDesc = this.getRecursoDescripcion(vinculo);
    
    // Crear el modal de confirmación
    const dialogRef = this.dialog.open(ConfirmDeleteVinculoComponent, {
      width: '500px',
      maxWidth: '95vw',
      data: {
        maquina: maquinaDesc,
        origen: origenDesc,
        tipoMaterial: tipoMaterialDesc,
        recurso: recursoDesc
      },
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      hasBackdrop: true,
      backdropClass: 'confirm-backdrop'
    });
    
    dialogRef.afterClosed().subscribe(confirmed => {
      // Importante: Prevenir que el evento se propague al modal padre
      setTimeout(() => {
        if (confirmed) {
          console.log('Confirmada eliminación de vínculo');
          // TODO: Llamar endpoint deleteVinculo y refrescar lista
          this.vinculos = this.vinculos.filter(v => {
            // Si tiene _tempId, comparar por eso (vínculos nuevos)
            if (v._tempId && vinculo._tempId) {
              return v._tempId !== vinculo._tempId;
            }
            // Si no, comparar por los campos del vínculo (vínculos existentes)
            return !(v.Id_MaquinaImpute === vinculo.Id_MaquinaImpute && 
                     v.Id_Origen === vinculo.Id_Origen && 
                     v.Id_TipoMaterial === vinculo.Id_TipoMaterial && 
                     v.Id_Recurso === vinculo.Id_Recurso);
          });
          console.log('Lista de vínculos después de eliminar:', this.vinculos);
          
          // Mostrar mensaje de confirmación
          this.snackBar.open('Vínculo eliminado correctamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        } else {
          console.log('Eliminación cancelada por el usuario');
        }
      }, 100); // Pequeño delay para evitar conflictos de eventos
    });
  }

  // Método para manejar click en botón eliminar y prevenir propagación
  onDeleteVinculoClick(event: Event, vinculo: VinculoDto): void {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.onDeleteVinculo(vinculo);
  }

  // Método para manejar click en botón editar y prevenir propagación
  onEditVinculoClick(event: Event, vinculo: VinculoDto): void {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.onEditVinculo(vinculo);
  }

  // Método para editar vínculo
  onEditVinculo(vinculo: VinculoDto): void {
    console.log('Editando vínculo:', vinculo);
    
    // Obtener los datos para los selects igual que en onAddVinculo
    this.vinculoService.getVinculosWithCatalogos().subscribe({
      next: (catalogos: VinculoDto[]) => {
        console.log('Catálogos obtenidos para edición:', catalogos);
        // El primer elemento contiene los catálogos
        const catalogoData = catalogos[0];
        const maquinas = catalogoData.maquinas || [];
        const origenes = catalogoData.origenes || [];
        const tiposMaterial = catalogoData.tiposMaterial || [];
        const recursos = catalogoData.recursos || [];
        
        const dialogRef = this.dialog.open(VinculoScrapEditDialogComponent, {
          width: '800px',
          maxWidth: '95vw',
          data: {
            maquinas: maquinas,
            origenes: origenes,
            tiposMaterial: tiposMaterial,
            recursos: recursos,
            vinculo: vinculo,
            isEdit: true
          },
          disableClose: true,
          autoFocus: false
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('Resultado de edición:', result);
            
            // Si el vínculo ya tiene ID, usar updateVinculo para persistir en el backend
            const vinculoAny = vinculo as any;
            if (vinculoAny.id || vinculoAny.Id_Vinculo) {
              const vinculoParaActualizar = {
                ...result,
                id: vinculoAny.id || vinculoAny.Id_Vinculo
              };
              
              this.vinculoService.updateVinculo(vinculoParaActualizar).subscribe({
                next: (response) => {
                  console.log('Vínculo actualizado en el backend:', response);
                  
                  // Buscar el índice del vínculo a editar
                  const index = this.vinculos.findIndex(v => {
                    const vAny = v as any;
                    if (vAny.id || vAny.Id_Vinculo) {
                      return (vAny.id || vAny.Id_Vinculo) === (vinculoAny.id || vinculoAny.Id_Vinculo);
                    }
                    if (v._tempId && vinculo._tempId) {
                      return v._tempId === vinculo._tempId;
                    }
                    return v.Id_MaquinaImpute === vinculo.Id_MaquinaImpute && 
                           v.Id_Origen === vinculo.Id_Origen && 
                           v.Id_TipoMaterial === vinculo.Id_TipoMaterial && 
                           v.Id_Recurso === vinculo.Id_Recurso;
                  });

                  if (index !== -1) {
                    // Actualizar vínculo en la lista local
                    const updatedVinculo = { ...result } as any;
                    updatedVinculo.id = vinculoAny.id || vinculoAny.Id_Vinculo;
                    this.vinculos[index] = updatedVinculo;
                    console.log('Vínculo actualizado en la lista local');
                  }
                  
                  this.snackBar.open('Vínculo actualizado correctamente', 'Cerrar', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                  });
                },
                error: (error) => {
                  console.error('Error al actualizar vínculo:', error);
                  this.snackBar.open('Error al actualizar vínculo', 'Cerrar', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                  });
                }
              });
            } else {
              // Es un vínculo temporal, solo actualizar en la lista local
              const index = this.vinculos.findIndex(v => {
                if (v._tempId && vinculo._tempId) {
                  return v._tempId === vinculo._tempId;
                }
                return v.Id_MaquinaImpute === vinculo.Id_MaquinaImpute && 
                       v.Id_Origen === vinculo.Id_Origen && 
                       v.Id_TipoMaterial === vinculo.Id_TipoMaterial && 
                       v.Id_Recurso === vinculo.Id_Recurso;
              });

              if (index !== -1) {
                // Mantener el _tempId si existe
                if (vinculo._tempId) {
                  result._tempId = vinculo._tempId;
                }
                
                // Reemplazar el vínculo en la lista
                this.vinculos[index] = result;
                console.log('Vínculo temporal actualizado en la lista');
                
                // Mostrar mensaje de confirmación
                this.snackBar.open('Vínculo editado correctamente', 'Cerrar', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top'
                });
              }
            }
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener catálogos para edición:', error);
        this.snackBar.open('Error al cargar datos para edición', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  onCancel() { 
    this.dialogRef.close(); 
  }
  
  onSave() {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.dialogRef.close({
      Id_Motivo: this.data.motivo?.Id_Motivo ?? 0,
      Descripcion: value.Descripcion,
      Habilitado: value.Habilitado,
      PorcentajeSimulacionMejora: value.PorcentajeSimulacionMejora,
      pSSMotivosScrapObjetivos: this.data.motivo?.pSSMotivosScrapObjetivos ?? [],
      pSSMotivosScrapVinculos: this.data.motivo?.pSSMotivosScrapVinculos ?? []
    });
  }
}

// Componente de confirmación para eliminar vínculos
export interface ConfirmDeleteVinculoData {
  maquina: string;
  origen: string;
  tipoMaterial: string;
  recurso: string;
}

@Component({
  selector: 'app-confirm-delete-vinculo',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-header">
        <div class="title-content">
          <mat-icon class="warning-icon">warning</mat-icon>
          <h2>Confirmar eliminación</h2>
        </div>
      </div>
      <div class="dialog-content">
        <p class="confirm-message">
          ¿Está seguro de que desea eliminar el siguiente vínculo?
        </p>
        <div class="vinculo-details">
          <div class="detail-row">
            <span class="label">Máquina:</span>
            <span class="value">{{ data.maquina }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Origen:</span>
            <span class="value">{{ data.origen }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Tipo Material:</span>
            <span class="value">{{ data.tipoMaterial }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Recurso:</span>
            <span class="value">{{ data.recurso }}</span>
          </div>
        </div>
        <p class="warning-text">
          <mat-icon class="small-warning">info</mat-icon>
          Esta acción no se puede deshacer.
        </p>
      </div>
      <div class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">
          <mat-icon>cancel</mat-icon>
          Cancelar
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()" class="delete-button">
          <mat-icon>delete</mat-icon>
          Eliminar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 400px;
      background: #fff;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .dialog-header {
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
      color: white;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .title-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .warning-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    h2 {
      margin: 0;
      font-weight: 500;
      font-size: 1.3rem;
    }
    .dialog-content {
      padding: 24px;
      flex: 1;
    }
    .confirm-message {
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #333;
    }
    .vinculo-details {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      padding: 16px;
      margin: 16px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .detail-row:last-child {
      margin-bottom: 0;
    }
    .label {
      font-weight: 600;
      color: #495057;
      min-width: 120px;
    }
    .value {
      color: #212529;
      flex: 1;
      text-align: right;
    }
    .warning-text {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 16px 0 0 0;
      color: #dc3545;
      font-size: 14px;
    }
    .small-warning {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }
    .cancel-button, .delete-button {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 120px;
      height: 40px;
      font-size: 14px;
    }
    .cancel-button {
      color: #6c757d;
    }
    .delete-button {
      background-color: #dc3545;
      color: white;
    }
    .delete-button:hover {
      background-color: #c82333;
    }
  `]
})
export class ConfirmDeleteVinculoComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteVinculoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteVinculoData
  ) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
