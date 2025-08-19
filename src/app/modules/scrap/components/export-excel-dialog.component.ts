import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ExportDialogData {
  title: string;
  message: string;
}

export interface ExportDialogResult {
  dateFrom: string;
  dateTo: string;
}

@Component({
  selector: 'app-export-excel-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon class="export-icon">file_download</mat-icon>
        <h2 mat-dialog-title>Seleccionar Fechas</h2>
      </div>
      
      <div mat-dialog-content class="dialog-content">
        <div class="date-filters">
          <div class="date-row">
            <mat-form-field appearance="outline" class="date-field">
              <mat-label>Desde</mat-label>
              <input 
                matInput 
                type="date"
                [(ngModel)]="dateFromInput"
                required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="date-field">
              <mat-label>Hasta</mat-label>
              <input 
                matInput 
                type="date"
                [(ngModel)]="dateToInput"
                required>
            </mat-form-field>
          </div>
        </div>

        <div class="info-message" *ngIf="dateFromInput && dateToInput">
          <mat-icon>info</mat-icon>
          <span>Se exportarán los registros desde <strong>{{ formatDate(dateFromInput) }}</strong> hasta <strong>{{ formatDate(dateToInput) }}</strong></span>
        </div>
      </div>
      
      <div mat-dialog-actions class="dialog-actions">
        <button 
          mat-raised-button 
          type="button" 
          class="cancel-button"
          (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cerrar
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          class="export-button"
          [disabled]="!dateFromInput || !dateToInput"
          (click)="onExport()">
          <mat-icon>file_download</mat-icon>
          Descargar Reporte
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
      max-width: 550px;
      width: 100%;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 24px 24px 16px 24px;
      background-color: #e8f5e8;
      border-bottom: 1px solid #4caf50;
      border-radius: 4px 4px 0 0;

      .export-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: #2e7d32;
      }

      h2 {
        margin: 0;
        color: #1b5e20;
        font-size: 1.4rem;
        font-weight: 500;
      }
    }

    .dialog-content {
      padding: 24px;
      color: #424242;
      line-height: 1.6;

      p {
        margin: 0 0 20px 0;
        font-size: 16px;
      }

      .date-filters {
        .date-row {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;

          .date-field {
            flex: 1;
          }
        }

        .preset-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;

          .preset-btn {
            border-radius: 6px;
            font-weight: 500;
            border: 2px solid #1976d2;
            color: #1976d2;
            transition: all 0.2s ease;

            mat-icon {
              margin-right: 6px;
              font-size: 18px;
              width: 18px;
              height: 18px;
            }

            &:hover {
              background-color: #e3f2fd;
              border-color: #1565c0;
              transform: translateY(-1px);
            }
          }
        }
      }

      .info-message {
        display: flex;
        align-items: center;
        gap: 12px;
        background-color: #e3f2fd;
        border: 1px solid #2196f3;
        border-radius: 6px;
        padding: 16px;
        color: #1565c0;
        font-size: 14px;

        mat-icon {
          color: #1976d2;
          flex-shrink: 0;
        }
      }
    }

    .dialog-actions {
      padding: 16px 24px 24px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background-color: #fafafa;
      border-radius: 0 0 4px 4px;

      button {
        min-width: 140px;
        border-radius: 6px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.2s ease;

        mat-icon {
          margin-right: 8px;
          font-size: 18px;
          width: 18px;
          height: 18px;
        }

        &.cancel-button {
          background-color: #6c757d;
          color: white;

          &:hover {
            background-color: #5a6268;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
          }
        }

        &.export-button {
          background-color: #1976d2;
          color: white;

          &:hover:not(:disabled) {
            background-color: #1565c0;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
          }

          &:disabled {
            opacity: 0.6;
            transform: none;
            box-shadow: none;
          }
        }
      }
    }

    // Responsive
    @media (max-width: 600px) {
      .dialog-container {
        max-width: 95vw;
      }

      .date-row {
        flex-direction: column !important;
        gap: 12px !important;
      }

      .preset-buttons {
        flex-direction: column !important;
        
        .preset-btn {
          width: 100%;
        }
      }

      .dialog-actions {
        flex-direction: column;
        
        button {
          width: 100%;
        }
      }
    }

    // Dark theme support
    :host-context(body.dark-theme) {
      .dialog-header {
        background-color: #2d3748;
        border-bottom-color: #4caf50;

        h2 {
          color: #81c784;
        }

        .export-icon {
          color: #4caf50;
        }
      }

      .dialog-content {
        background-color: #4a5568;
        color: #e2e8f0;

        .info-message {
          background-color: #2d3748;
          border-color: #4299e1;
          color: #90cdf4;

          mat-icon {
            color: #4299e1;
          }
        }
      }

      .dialog-actions {
        background-color: #2d3748;
      }
    }
  `]
})
export class ExportExcelDialogComponent {
  private dialogRef = inject(MatDialogRef<ExportExcelDialogComponent>);
  
  dateFromInput: string = '';
  dateToInput: string = '';

  constructor() {
    // Establecer fechas por defecto (último mes)
    this.setLastMonth();
  }

  setLastMonth(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.dateFromInput = this.toDateInputFormat(firstDayOfMonth);
    this.dateToInput = this.toDateInputFormat(today);
  }

  setLast3Months(): void {
    const today = new Date();
    const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
    
    this.dateFromInput = this.toDateInputFormat(threeMonthsAgo);
    this.dateToInput = this.toDateInputFormat(today);
  }

  setCurrentYear(): void {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    
    this.dateFromInput = this.toDateInputFormat(startOfYear);
    this.dateToInput = this.toDateInputFormat(endOfYear);
  }

  private toDateInputFormat(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onExport(): void {
    if (this.dateFromInput && this.dateToInput) {
      const result: ExportDialogResult = {
        dateFrom: this.formatDate(this.dateFromInput),
        dateTo: this.formatDate(this.dateToInput)
      };
      this.dialogRef.close(result);
    }
  }
}
