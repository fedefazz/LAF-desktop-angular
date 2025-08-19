import { Component, ViewChild, OnInit, AfterViewInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import * as ExcelJS from 'exceljs';

import { ScrapService } from '../services/scrap.service';
import { ScrapDto, ScrapFilters } from '../models/scrap.model';
import { DeleteConfirmationDialogComponent, DeleteDialogData } from './delete-confirmation-dialog.component';
import { ExportExcelDialogComponent, ExportDialogResult } from './export-excel-dialog.component';
import { ScrapEditDialogComponent, ScrapEditDialogData } from './scrap-edit-dialog.component';

// Configuración de formato de fecha personalizado
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// DateAdapter personalizado para formato dd/mm/yyyy
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'DD/MM/YYYY') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return super.format(date, displayFormat);
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.includes('/')) {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
    return super.parse(value);
  }
}

@Component({
  selector: 'app-scrap-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardModule,
    FormsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ],
  templateUrl: './scrap-list.component.html',
  styleUrls: ['./scrap-list.component.scss']
})
export class ScrapListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Services
  private scrapService = inject(ScrapService); // Usando servicio real
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Signals
  private readonly destroySubject = new Subject<void>();
  loading = signal(false);
  scraps = signal<ScrapDto[]>([]);
  totalRecords = signal(0);
  filteredRecords = signal(0);

  // Table configuration
  displayedColumns: string[] = [
    'select',
    'IdRegScrap',
    'Fecha',
    'NumOP',
    'Maquina',
    'MaquinaImputa',
    'Actividad',
    'Operador',
    'OrigenScrap',
    'TipoMaterial',
    'Peso',
    'Observaciones',
    'actions'
  ];

  dataSource = new MatTableDataSource<ScrapDto>([]);
  selection = new SelectionModel<ScrapDto>(true, []);

  // Filters
  searchQuery = '';
  fechaDesde = (() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  })();
  fechaHasta = new Date();
  private searchSubject = new Subject<string>();
  applyDateFilters = false; // Flag to control when to apply date filters (public for template access)

  // Pagination
  pageSize = 100;
  pageIndex = 0;
  pageSizeOptions = [10, 100, 1000, 10000];

  // Math for template
  Math = Math;

  ngOnInit() {
    this.setupSearch();
    this.loadScraps();
  }

  ngAfterViewInit() {
    // Configurar el sort inicial por Fecha descendente
    if (this.sort) {
      this.sort.active = 'Fecha';
      this.sort.direction = 'desc';
    }
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private setupSearch() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroySubject)
      )
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadScraps();
      });
  }

  onSearchChange(value: string) {
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  loadScraps() {
    this.loading.set(true);

    const filters: ScrapFilters = {
      start: this.pageIndex * this.pageSize,
      length: this.pageSize,
      search: this.searchQuery,
      order: 2, // Default to Fecha column (Fecha is column index 2)
      orderDir: 'desc', // Descendente por defecto
      draw: 1,
      // Solo aplicar filtros de fecha si la bandera está activa
      dateDesde: this.applyDateFilters ? this.formatDate(this.fechaDesde) : '',
      dateHasta: this.applyDateFilters ? this.formatDate(this.fechaHasta) : ''
    };

    // Apply sorting if available
    if (this.sort?.active && this.sort?.direction) {
      const columnIndex = this.displayedColumns.indexOf(this.sort.active);
      if (columnIndex > -1) {
        filters.order = columnIndex;
        filters.orderDir = this.sort.direction;
      }
    }

    this.scrapService.getScrapServerSide(filters)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (response) => {
          this.scraps.set(response.data);
          this.totalRecords.set(response.recordsTotal);
          this.filteredRecords.set(response.recordsFiltered);
          this.dataSource.data = response.data;
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading scraps:', error);
          this.snackBar.open('Error al cargar los datos', 'Cerrar', { duration: 3000 });
          this.loading.set(false);
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadScraps();
  }

  onSortChange(sort: Sort) {
    this.pageIndex = 0;
    this.loadScraps();
  }

  applyFilters() {
    this.applyDateFilters = true;
    this.pageIndex = 0;
    this.loadScraps();
  }

  clearFilters() {
    this.applyDateFilters = false;
    this.searchQuery = '';
    this.pageIndex = 0;
    this.loadScraps();
  }

  // Selection methods
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: ScrapDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.IdRegScrap}`;
  }

  // Actions
  editScrap(scrap: ScrapDto): void {
    const dialogRef = this.dialog.open(ScrapEditDialogComponent, {
      width: '1100px',
      maxWidth: '98vw',
      height: '850px',
      maxHeight: '95vh',
      disableClose: false,
      autoFocus: false,
      panelClass: 'scrap-edit-dialog-container',
      data: { scrapId: scrap.IdRegScrap } as ScrapEditDialogData
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // El dialog de edición retorna { updated: true, scrap: ScrapDto }
      if (result && result.updated && result.scrap) {
        const updatedScrap: ScrapDto = result.scrap;
        // Obtener el registro actualizado del backend para reflejar datos frescos
        this.scrapService.getScrapById(updatedScrap.IdRegScrap).subscribe({
          next: (freshScrap: ScrapDto) => {
            console.log('[SCRAP][DEBUG] Registro actualizado recibido del backend:', freshScrap);
            const beforeArr = this.scraps();
            console.log('[SCRAP][DEBUG] Array antes de actualizar:', beforeArr);
            let updated = false;
            const scrapsArr = beforeArr.map(s => {
              if (String(s.IdRegScrap) === String(freshScrap.IdRegScrap)) {
                updated = true;
                return freshScrap;
              }
              return s;
            });
            console.log('[SCRAP][DEBUG] Array después de actualizar:', scrapsArr);
            if (updated) {
              // Forzar refresh creando nuevos arrays
              const refreshedArr = [...scrapsArr];
              this.scraps.set(refreshedArr);
              this.dataSource.data = [...refreshedArr];
              this.snackBar.open('Registro actualizado correctamente', 'Cerrar', { duration: 3000 });
            } else {
              // Si no está en la página actual, recargar la lista
              this.loadScraps();
            }
          },
          error: (err) => {
            console.error('[SCRAP][DEBUG] Error al obtener el registro actualizado:', err);
            // Si falla el GET, recargar la lista completa
            this.loadScraps();
          }
        });
      }
    });
  }

  deleteSingleScrap(scrap: ScrapDto): void {
    // Mostrar diálogo de confirmación
    const dialogData: DeleteDialogData = {
      title: 'Confirmar Eliminación',
      message: `¿Está seguro que desea eliminar el registro #${scrap.IdRegScrap}? Esta acción no se puede deshacer.`,
      count: 1
    };

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.scrapService.deleteScrap(scrap.IdRegScrap).subscribe({
          next: () => {
            this.snackBar.open('Registro eliminado exitosamente', 'Cerrar', { duration: 3000 });
            this.selection.clear(); // Limpiar selección
            this.loadScraps(); // Recargar datos
          },
          error: (error) => {
            console.error('Error deleting scrap:', error);
            this.snackBar.open('Error al eliminar el registro', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteSelected() {
    if (this.selection.selected.length === 0) {
      this.snackBar.open('Seleccione al menos un elemento para eliminar', 'Cerrar', { duration: 3000 });
      return;
    }

    const selectedIds = this.selection.selected.map(s => s.IdRegScrap);
    
    // Mostrar diálogo de confirmación
    const dialogData: DeleteDialogData = {
      title: 'Confirmar Eliminación',
      message: '¿Está seguro que desea eliminar los registros seleccionados? Esta acción no se puede deshacer.',
      count: selectedIds.length
    };

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.scrapService.deleteMultipleScrap(selectedIds)
          .pipe(takeUntil(this.destroySubject))
          .subscribe({
            next: () => {
              this.snackBar.open('Registros eliminados correctamente', 'Cerrar', { duration: 3000 });
              this.selection.clear();
              this.loadScraps();
            },
            error: (error) => {
              console.error('Error deleting scraps:', error);
              this.snackBar.open('Error al eliminar los registros', 'Cerrar', { duration: 3000 });
            }
          });
      }
    });
  }

  exportToExcel() {
    // Mostrar diálogo de selección de fechas
    const dialogRef = this.dialog.open(ExportExcelDialogComponent, {
      width: '550px',
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result: ExportDialogResult | null) => {
      if (result) {
        this.performExcelExport(result.dateFrom, result.dateTo);
      }
    });
  }

  private performExcelExport(dateFrom: string, dateTo: string): void {
    console.log('Exportando Excel con fechas:', dateFrom, 'hasta', dateTo);
    
    this.scrapService.exportToExcel(dateFrom, dateTo)
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (data) => {
          console.log('Datos recibidos del API:', data);
          this.generateExcelFile(data, dateFrom, dateTo);
        },
        error: (error) => {
          console.error('Error exporting to Excel:', error);
          this.snackBar.open('Error al exportar a Excel', 'Cerrar', { duration: 3000 });
        }
      });
  }

  /**
   * Genera el archivo Excel usando ExcelJS
   */
  private async generateExcelFile(data: any[], dateFrom: string, dateTo: string): Promise<void> {
    try {
      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Scrap');

      // Configurar las columnas
      worksheet.columns = [
        { header: 'ID', key: 'ID', width: 10 },
        { header: 'Fecha', key: 'FECHA', width: 15 },
        { header: 'OP', key: 'OP', width: 15 },
        { header: 'Máquina', key: 'MAQUINA', width: 20 },
        { header: 'Operador', key: 'OPERADOR', width: 25 },
        { header: 'Origen Scrap', key: 'ORIGEN_SCRAP', width: 25 },
        { header: 'Tipo Material', key: 'TIPO_MATERIAL', width: 20 },
        { header: 'Peso (kg)', key: 'PESO', width: 15 },
        { header: 'Observaciones', key: 'OBSERVACIONES', width: 40 },
        { header: 'Actividad', key: 'ACTIVIDAD', width: 20 },
        { header: 'Producto', key: 'PRODUCTO', width: 20 }
      ];

      // Agregar los datos
      data.forEach(item => {
        worksheet.addRow({
          ID: item.ID,
          FECHA: this.formatDateForExcel(item.FECHA),
          OP: item.OP,
          MAQUINA: item.MAQUINA,
          OPERADOR: item.OPERADOR,
          ORIGEN_SCRAP: item.ORIGEN_SCRAP,
          TIPO_MATERIAL: item.TIPO_MATERIAL,
          PESO: item.PESO,
          OBSERVACIONES: item.OBSERVACIONES,
          ACTIVIDAD: item.ACTIVIDAD,
          PRODUCTO: item.PRODUCTO
        });
      });

      // Estilizar la fila de encabezado
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1976D2' } // Azul de Bolsapel
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Aplicar bordes a todas las celdas con datos
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // Generar el archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

      // Descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fechaFromStr = dateFrom.replace(/\//g, '-');
      const fechaToStr = dateTo.replace(/\//g, '-');
      const timestamp = Date.now();
      link.download = `SCRAP_${fechaFromStr}_${fechaToStr}_${timestamp}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      this.snackBar.open(`Excel exportado exitosamente (${data.length} registros)`, 'Cerrar', {
        duration: 3000
      });

    } catch (error) {
      console.error('Error al generar archivo Excel:', error);
      this.snackBar.open('Error al generar archivo Excel', 'Cerrar', {
        duration: 3000
      });
    }
  }

  /**
   * Formatea una fecha para Excel
   */
  private formatDateForExcel(dateStr: string): string {
    try {
      // Si viene en formato ISO (YYYY-MM-DD), convertir a DD/MM/YYYY
      if (dateStr && dateStr.includes('-')) {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
      return dateStr || '';
    } catch {
      return dateStr || '';
    }
  }

  // Utility methods
  private formatDate(date: Date): string {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatDateTime(date: Date): string {
    if (!date) return '';
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  formatOperadorName(operador: any): string {
    if (!operador) return '';
    const nombre = operador.Nombre || '';
    const apellido = operador.Apellido || '';
    return `${nombre} ${apellido}`.trim();
  }
}
