import { Component, inject, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface DeleteDialogData {
  title: string;
  message: string;
  count: number;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      
      <div mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
        <div class="count-info" *ngIf="data.count > 0">
          <strong>{{ data.count }} registro{{ data.count > 1 ? 's' : '' }} seleccionado{{ data.count > 1 ? 's' : '' }}</strong>
        </div>
      </div>
      
      <div mat-dialog-actions class="dialog-actions">
        <button 
          mat-raised-button 
          type="button" 
          class="cancel-button"
          (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
        <button 
          mat-raised-button 
          color="warn" 
          class="delete-button"
          (click)="onConfirm()">
          <mat-icon>delete</mat-icon>
          Eliminar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
      max-width: 450px;
      width: 100%;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 24px 24px 16px 24px;
      background-color: #fff3e0;
      border-bottom: 1px solid #ffcc02;
      border-radius: 4px 4px 0 0;

      .warning-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: #ff9800;
      }

      h2 {
        margin: 0;
        color: #e65100;
        font-size: 1.4rem;
        font-weight: 500;
      }
    }

    .dialog-content {
      padding: 24px;
      color: #424242;
      line-height: 1.6;

      p {
        margin: 0 0 16px 0;
        font-size: 16px;
      }

      .count-info {
        background-color: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 12px 16px;
        text-align: center;
        color: #1976d2;
        font-size: 14px;
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
        min-width: 120px;
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

        &.delete-button {
          background-color: #d32f2f;
          color: white;

          &:hover {
            background-color: #c62828;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(211, 47, 47, 0.3);
          }
        }
      }
    }

    // Dark theme support
    :host-context(body.dark-theme) {
      .dialog-header {
        background-color: #4a5568;
        border-bottom-color: #ff9800;

        h2 {
          color: #ffcc02;
        }
      }

      .dialog-content {
        background-color: #4a5568;
        color: #e2e8f0;

        .count-info {
          background-color: #2d3748;
          border-color: #4a5568;
          color: #90cdf4;
        }
      }

      .dialog-actions {
        background-color: #2d3748;
      }
    }
  `]
})
export class DeleteConfirmationDialogComponent {
  private dialogRef = inject(MatDialogRef<DeleteConfirmationDialogComponent>);
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
