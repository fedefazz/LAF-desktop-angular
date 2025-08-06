import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables
} from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #chartCanvas [id]="canvasId"></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    canvas {
      max-width: 100%;
      max-height: 100%;
    }
  `]
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  @Input() chartType: ChartType = 'bar';
  @Input() set chartData(data: ChartData) {
    if (!data) {
      return;
    }
    
    this._chartData = data;
    
    // Destruir chart existente antes de crear uno nuevo
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    
    if (this.chartCanvas?.nativeElement) {
      setTimeout(() => this.createChart(), 50);
    }
  }
  @Input() options: ChartConfiguration['options'] = {};
  
  private _chartData: ChartData = { labels: [], datasets: [] };
  private chart: Chart | null = null;
  public readonly canvasId = `chart-${Math.random().toString(36).substr(2, 9)}`;

  ngOnInit() {
    // Asignar ID único al canvas
    if (this.chartCanvas?.nativeElement) {
      this.chartCanvas.nativeElement.id = this.canvasId;
    }
  }

  ngAfterViewInit() {
    // Crear el gráfico después de que la vista esté lista
    setTimeout(() => {
      if (this._chartData?.labels?.length > 0) {
        this.createChart();
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private createChart() {
    // Destruir chart existente primero
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.warn('No se pudo obtener el contexto del canvas');
      return;
    }

    const chartData = this._chartData;
    
    // Verificar si hay datos válidos
    if (!chartData || !chartData.labels || chartData.labels.length === 0) {
      return;
    }

    const defaultOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false, // Desactivar animaciones para evitar loops
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: 'rgba(255, 255, 255, 0.9)',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderWidth: 1
        }
      },
      scales: this.chartType === 'pie' || this.chartType === 'doughnut' ? {} : {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.2)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.9)',
            font: {
              size: 11
            }
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.9)',
            font: {
              size: 11
            }
          }
        }
      }
    };

    try {
      this.chart = new Chart(ctx, {
        type: this.chartType,
        data: chartData,
        options: { ...defaultOptions, ...this.options }
      });
      console.log(`✅ Chart created successfully with type: ${this.chartType}`);
    } catch (error) {
      console.error('❌ Error creating chart:', error);
      // Si falla, intentar limpiar y reintentar
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    }
  }
}
