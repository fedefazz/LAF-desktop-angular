import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';
import { ChartComponent, ChartData } from '../../shared/components/charts/chart.component';
import { ArgentinianNumberPipe } from '../../shared/pipes/argentinian-number.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    ChartComponent,
    ArgentinianNumberPipe
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">Dashboard</h1>
      </div>

      @if (loading) {
        <div class="loading-state">
          <mat-icon>refresh</mat-icon>
          <p>Cargando datos del dashboard...</p>
        </div>
      } @else if (error) {
        <div class="error-state">
          <mat-icon color="warn">error</mat-icon>
          <p>{{ error }}</p>
          <button mat-raised-button color="primary" (click)="loadDashboardData()">
            Reintentar
          </button>
        </div>
      } @else {
        
        <!-- KPIs en grilla 3x3 -->
        <div class="dashboard-kpis-grid">
          
          <!-- Fila 1 -->
          <div class="kpi-card">
            <div class="kpi-icon"><i class="fa fa-globe"></i></div>
            <div class="kpi-content">
              <div class="kpi-title">PORCENTAJE TOTAL PLANTA</div>
              <div class="kpi-subtitle">Últimos 30 días</div>
              <div class="kpi-value">{{ getTotalPlantaPorcentaje() | number:'1.1-1' }}%</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon"><i class="fa fa-globe"></i></div>
            <div class="kpi-content">
              <div class="kpi-title">SCRAP TOTAL PLANTA</div>
              <div class="kpi-subtitle">Últimos 30 días</div>
              <div class="kpi-value">{{ getTotalPlantaScrapKgs() | number:'1.0-0' }} Kg.</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon"><i class="fa fa-globe"></i></div>
            <div class="kpi-content">
              <div class="kpi-title">PRODUCIDOS TOTAL PLANTA</div>
              <div class="kpi-subtitle">Últimos 30 días</div>
              <div class="kpi-value">{{ getTotalPlantaProduccionKgs() | number:'1.0-0' }} Kg.</div>
            </div>
          </div>

          <!-- Fila 2 -->
          <div class="kpi-card">
            <div class="kpi-icon"><i class="fa fa-file"></i></div>
            <div class="kpi-content">
              <div class="kpi-title">TOTAL IMPRESORAS</div>
              <div class="kpi-subtitle">Últimos 30 días</div>
              <div class="kpi-value">{{ getAreaPorcentaje('impresion') | number:'1.1-1' }}%</div>
              <div class="kpi-detail">{{ getAreaScrapKgs('impresion') | number:'1.0-0' }} Kg.</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon"><i class="fa fa-cut"></i></div>
            <div class="kpi-content">
              <div class="kpi-title">TOTAL CORTE</div>
              <div class="kpi-subtitle">Últimos 30 días</div>
              <div class="kpi-value">{{ getAreaPorcentaje('corte') | number:'1.1-1' }}%</div>
              <div class="kpi-detail">{{ getAreaScrapKgs('corte') | number:'1.0-0' }} Kg.</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon"><i class="fa fa-comments"></i></div>
            <div class="kpi-content">
              <div class="kpi-title">TOTAL MANGAS</div>
              <div class="kpi-subtitle">Últimos 30 días</div>
              <div class="kpi-value">{{ getAreaPorcentaje('mangas') | number:'1.1-1' }}%</div>
              <div class="kpi-detail">{{ getAreaScrapKgs('mangas') | number:'1.0-0' }} Kg.</div>
            </div>
          </div>

          <!-- Fila 3 -->
          <div class="kpi-card">
            <div class="kpi-icon"><i class="fa fa-anchor"></i></div>
            <div class="kpi-content">
              <div class="kpi-title">TOTAL DOYPACKS</div>
              <div class="kpi-subtitle">Últimos 30 días</div>
              <div class="kpi-value">{{ getAreaPorcentaje('doypack') | number:'1.1-1' }}%</div>
              <div class="kpi-detail">{{ getAreaScrapKgs('doypack') | number:'1.0-0' }} Kg.</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon"><i class="fa fa-smile-o"></i></div>
            <div class="kpi-content">
              <div class="kpi-title">TOTAL TABACO/BOX</div>
              <div class="kpi-subtitle">Últimos 30 días</div>
              <div class="kpi-value">{{ getAreaPorcentaje('tabaco') | number:'1.1-1' }}%</div>
              <div class="kpi-detail">{{ getAreaScrapKgs('tabaco') | number:'1.0-0' }} Kg.</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon"><i class="fa fa-adjust"></i></div>
            <div class="kpi-content">
              <div class="kpi-title">TOTAL LAMINADO</div>
              <div class="kpi-subtitle">Últimos 30 días</div>
              <div class="kpi-value">{{ getAreaPorcentaje('laminado') | number:'1.1-1' }}%</div>
              <div class="kpi-detail">{{ getAreaScrapKgs('laminado') | number:'1.0-0' }} Kg.</div>
            </div>
          </div>

        </div>

        <!-- 4 Gráficos a pantalla completa -->
        <div class="dashboard-charts">
          
          <!-- Gráfico 1: Área Impresión -->
          <div class="chart-section-full">
            <div class="chart-container-dual">
              <div class="chart-left">
                <h4 class="chart-title">Área Impresión</h4>
                <p class="chart-subtitle">Incidencias de los últimos 12 meses</p>
                <div class="chart-content">
                  <app-chart 
                    [chartData]="impresionTimelineData"
                    [options]="timelineChartOptionsFormatted"
                    chartType="line">
                  </app-chart>
                </div>
              </div>
              <!-- Separador visual -->
              <div class="chart-separator"></div>
              <div class="chart-right">
                <p class="chart-subtitle-right">Incidencias de los últimos 12 meses</p>
                
                <!-- Totales -->
                <div class="impresion-totals">
                  <div class="totals-container" style="display: flex; gap: 25px; margin-bottom: 8px; font-size: 1em;">
                    <div>
                      <div class="total-value" style="font-size: 1.0em; color: #ffffff; font-weight: 600;">{{ impresionTotalScrap | argentinianNumber }}</div>
                      <div class="total-label" style="font-size: 0.65em; color: #ffffff;">kilos de Scrap</div>
                    </div>
                    <div>
                      <div class="total-value" style="font-size: 1.0em; color: #ffffff; font-weight: 600;">{{ impresionTotalProduccion | argentinianNumber }}</div>
                      <div class="total-label" style="font-size: 0.65em; color: #ffffff;">kilos Producidos</div>
                    </div>
                  </div>
                </div>
                
                <!-- Doughnut chart más grande con leyenda central -->
                <div style="width: 180px; height: 180px; margin: 0 auto 8px auto; position: relative;">
                  <app-chart 
                    [chartData]="impresionDoughnutData"
                    [options]="doughnutChartOptionsFormatted"
                    chartType="doughnut">
                  </app-chart>
                  <!-- Leyenda central sobre el doughnut -->
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 4px;">
                      <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:{{impresionLegend[impresionActiveIndex]?.color || '#fff'}};"></span>
                      <div style="font-size: 0.9em; color: #fff; font-weight: 600;">{{ impresionLegend[impresionActiveIndex]?.label || '' }}</div>
                    </div>
                    <div style="font-size: 0.8em; color: #fff; margin-top: 2px;">{{ getActivePorcentajeFormatted() }}%</div>
                  </div>
                </div>
                
                <!-- Leyenda compacta -->
                <div class="impresion-legend" style="font-size: 0.8em; width: 100%;">
                  <div style="padding: 0;">
                    <div style="color: #999; font-size: 0.7em; margin-bottom: 6px;">Scrap / Producidos</div>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                      <div *ngFor="let item of impresionLegend" style="display: flex; align-items: center; gap: 8px; font-size: 0.85em;">
                        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:{{item.color}};"></span>
                        <span style="color:#fff;">{{ item.scrap | argentinianNumber }}</span>
                        <span style="color:#666;">|</span>
                        <span style="color:#fff;">{{ item.produccion | argentinianNumber }} kg</span>
                        <span style="color:#666;">|</span>
                        <span style="color:{{item.color}};">{{ item.label }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico 2: Área Laminación -->
          <div class="chart-section-full">
            <h4 class="chart-title">Área Laminación</h4>
            <p class="chart-subtitle">Incidencias de los últimos 12 meses</p>
            <div class="chart-container-full">
              <app-chart 
                [chartData]="laminacionTimelineData"
                [options]="timelineChartOptions"
                chartType="line">
              </app-chart>
            </div>
          </div>

          <!-- Gráfico 3: Total scrap planta -->
          <div class="chart-section-full">
            <h4 class="chart-title">Total scrap planta</h4>
            <p class="chart-subtitle">Incidencias de los últimos 12 meses</p>
            <div class="chart-container-full">
              <app-chart 
                [chartData]="totalScrapData"
                [options]="areaChartOptions"
                chartType="line">
              </app-chart>
            </div>
          </div>

          <!-- Gráfico 4: Porcentaje mensual de scrap planta -->
          <div class="chart-section-full">
            <h4 class="chart-title">Porcentaje mensual de scrap planta</h4>
            <p class="chart-subtitle">Incidencias de los últimos 12 meses</p>
            <div class="chart-container-full">
              <app-chart 
                [chartData]="monthlyScrapData"
                [options]="areaChartOptions"
                chartType="line">
              </app-chart>
            </div>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 16px;
      background-color: #f5f5f5;
      min-height: 100vh;
    }

    .dashboard-header {
      margin-bottom: 24px;
    }

    .dashboard-title {
      font-size: 24px;
      font-weight: 400;
      color: #333;
      margin: 0;
    }

    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
    }

    .error-state button {
      margin-top: 16px;
    }

    /* KPIs en grilla 3x3 */
    .dashboard-kpis-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .kpi-card {
      background: #242a30;
      color: white;
      border-radius: 4px;
      padding: 20px;
      display: flex;
      align-items: center;
      min-height: 100px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .kpi-icon {
      font-size: 32px;
      margin-right: 16px;
      color: #666;
      width: 40px;
      text-align: center;
    }

    .kpi-content {
      flex: 1;
    }

    .kpi-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
      color: #ccc;
    }

    .kpi-subtitle {
      font-size: 10px;
      color: #888;
      margin-bottom: 8px;
    }

    .kpi-value {
      font-size: 24px;
      font-weight: 300;
      color: #fff;
      margin-bottom: 4px;
    }

    .kpi-detail {
      font-size: 10px;
      color: #888;
      margin-bottom: 2px;
    }

    /* Gráficos a pantalla completa */
    .dashboard-charts {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .chart-section-full {
      background: #242a30;
      border-radius: 4px;
      padding: 24px;
      color: white;
    }

    .chart-title {
      font-size: 18px;
      font-weight: 400;
      color: white;
      margin: 0 0 3px 0;
    }

    .chart-subtitle {
      font-size: 12px;
      color: #888;
      margin-bottom: 15px;
    }

    .chart-container-full {
      height: 400px;
      color: white;
    }

    .chart-container-dual {
      display: grid;
      grid-template-columns: 3fr 2px 1fr;
      gap: 0;
      height: 400px;
    }

    .chart-left {
      height: 100%;
      padding-right: 16px;
    }

    .chart-content {
      height: 350px;
    }

    .chart-separator {
      background: rgba(0,0,0,0.3);
      width: 2px;
      height: 100%;
      margin: 0;
    }

    .chart-right {
      height: 100%;
      padding-left: 12px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .chart-title-right {
      font-size: 16px;
      font-weight: 400;
      color: white;
      margin: 0 0 2px 0;
    }

    .chart-subtitle-right {
      font-size: 11px;
      color: #888;
      margin-bottom: 12px;
    }

    .impresion-totals {
      width: 100%;
      margin-bottom: 8px;
    }

    /* Responsive design */
    @media (min-width: 1281px) {
      .impresion-legend {
        font-size: 0.9em !important;
      }
      .impresion-legend div[style*="font-size: 0.7em"] {
        font-size: 0.8em !important;
      }
      .impresion-legend div[style*="font-size: 0.85em"] {
        font-size: 0.95em !important;
      }
      
      .impresion-totals .total-value {
        font-size: 1.1em !important;
      }
      .impresion-totals .total-label {
        font-size: 0.75em !important;
      }
    }

    @media (max-width: 1200px) {
      .dashboard-kpis-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .dashboard-kpis-grid {
        grid-template-columns: 1fr;
      }
      
      .kpi-card {
        flex-direction: column;
        text-align: center;
      }
      
      .kpi-icon {
        margin: 0 0 12px 0;
      }
    }

    /* Font Awesome icons */
    .fa {
      font-family: FontAwesome;
    }
  `]
})
export class DashboardComponent implements OnInit {

  // Chart options (declaradas primero para evitar errores de inicialización)
  public readonly timelineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255,255,255,0.8)',
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          boxWidth: 8,
          boxHeight: 8,
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset: any, index: number) => ({
              text: dataset.label,
              fillStyle: dataset.borderColor,
              strokeStyle: 'rgba(255,255,255,1)',
              lineWidth: 1,
              pointStyle: 'circle',
              datasetIndex: index,
              fontColor: 'rgba(255,255,255,0.8)'
            }));
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        pointStyle: 'circle',
        boxPadding: 4
      }
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } },
        grid: { 
          color: 'rgba(255,255,255,0.1)',
          drawBorder: false
        }
      },
      y: {
        ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } },
        grid: { 
          color: 'rgba(255,255,255,0.1)',
          drawBorder: false
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,1)'
      },
      line: {
        tension: 0.3,
        borderWidth: 3
      }
    }
  };

  public readonly areaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: {
        ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };

  public readonly doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false  // Ocultamos la leyenda porque tenemos una personalizada
      },
      tooltip: {
        enabled: false  // Deshabilitamos el tooltip por defecto para usar uno personalizado en el centro
      }
    },
    cutout: '75%',  // Agujero más grande para mostrar la leyenda central
    elements: {
      arc: {
        borderWidth: 1,  // Líneas más finas
        borderColor: 'rgba(255, 255, 255, 0.1)',  // Borde sutil
        hoverBorderWidth: 2,  // Ligeramente más grueso al hacer hover
        hoverBorderColor: 'rgba(255, 255, 255, 0.3)'
      }
    },
    interaction: {
      intersect: false,
      mode: 'point' as const
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart' as const
    },
    onHover: (event: any, elements: any[]) => {
      if (elements.length > 0) {
        // Cambiar el índice activo para mostrar en el centro
        this.impresionActiveIndex = elements[0].index;
        event.native.target.style.cursor = 'pointer';
      } else {
        event.native.target.style.cursor = 'default';
      }
    }
  };

  // Formatted chart options for Argentinian numbers (solo tooltips, eje Y entero)
  public readonly timelineChartOptionsFormatted = {
    ...this.timelineChartOptions,
    plugins: {
      ...this.timelineChartOptions.plugins,
      tooltip: {
        ...this.timelineChartOptions.plugins.tooltip,
        callbacks: {
          label: (ctx: any) => {
            const value = ctx.parsed.y;
            // Mostrar el valor tal como viene del API, sin formatear
            return `${ctx.dataset.label}: ${value}`;
          }
        }
      }
    },
    scales: {
      ...this.timelineChartOptions.scales,
      x: {
        ...this.timelineChartOptions.scales.x,
        ticks: { 
          color: 'rgba(255,255,255,0.6)', 
          font: { size: 11 },
          callback: (value: any, index: any, values: any) => {
            const label = this.impresionTimelineData.labels?.[index];
            return this.formatMonthLabelForDisplay(label as string);
          }
        }
      }
    }
  };

  public readonly doughnutChartOptionsFormatted = {
    ...this.doughnutChartOptions
  };

  // Helper for Argentinian number formatting (consistente con el pipe)
  private formatArgentinian(value: number): string {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    try {
      // Los valores del API vienen como 7.385 que significa 7385 (siete mil trescientos ochenta y cinco)
      // No hay decimales, solo necesitamos formatear con separador de miles argentino
      const integerValue = Math.round(value);
      
      // Formatear con punto como separador de miles
      return integerValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    } catch {
      return '0';
    }
  }

  // Helper for date formatting  
  private formatMonthLabel(date: string): string {
    if (!date) return '';
    // Si viene como YYYY-MM, lo dejamos así
    if (date.match(/^\d{4}-\d{2}$/)) return date;
    // Si viene en otro formato, intentamos convertir
    try {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    } catch {
      return date;
    }
  }

  // Helper for displaying month labels on chart axis
  private formatMonthLabelForDisplay(date: string): string {
    if (!date) return '';
    
    const monthNames = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    
    try {
      // Si viene como YYYY-MM
      if (date.match(/^\d{4}-\d{2}$/)) {
        const [year, monthStr] = date.split('-');
        const monthIndex = parseInt(monthStr, 10) - 1;
        
        if (monthIndex >= 0 && monthIndex < 12) {
          return `${monthNames[monthIndex]} ${year}`;
        }
      }
      
      // Si viene en otro formato, intentamos convertir
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        const monthIndex = d.getMonth();
        const year = d.getFullYear();
        return `${monthNames[monthIndex]} ${year}`;
      }
      
      return date;
    } catch {
      return date;
    }
  }

  // Helper para crear datasets con colores de puntos correctos
  private createDatasetWithPointColors(label: string, data: number[], borderColor: string, backgroundColor: string): any {
    return {
      label,
      data,
      borderColor,
      backgroundColor,
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointBackgroundColor: borderColor,
      pointBorderColor: 'rgba(255, 255, 255, 1)',
      pointBorderWidth: 1,
      pointRadius: 4,
      pointHoverRadius: 8
    };
  }

  // Totals and legend for Impresión - SIMPLIFICADO para evitar leaks
  public impresionTotalScrap: number = 0;
  public impresionTotalProduccion: number = 0;
  public impresionLegend: any[] = [];
  public impresionActiveIndex: number = 0; // Para la leyenda activa
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  // Properties (NO usar signals para evitar leaks)
  private _loading = false;
  private _error: string | null = null;
  private _dashboardStats: DashboardStats | null = null;

  // Chart data properties - calculadas una vez
  public impresionTimelineData: ChartData = { labels: [], datasets: [] };
  public impresionDoughnutData: ChartData = { labels: [], datasets: [] };
  public laminacionTimelineData: ChartData = { labels: [], datasets: [] };
  public totalScrapData: ChartData = { labels: [], datasets: [] };
  public monthlyScrapData: ChartData = { labels: [], datasets: [] };

  public get loading(): boolean { return this._loading; }
  public get error(): string | null { return this._error; }
  public get dashboardStats(): DashboardStats | null { return this._dashboardStats; }

  // Helper methods simplificados
  private _totalPlantaPorcentaje: number = 0;
  private _totalPlantaScrapKgs: number = 0;
  private _totalPlantaProduccionKgs: number = 0;
  private _areaData: any = {};

  public getTotalPlantaPorcentaje(): number { return this._totalPlantaPorcentaje; }
  public getTotalPlantaScrapKgs(): number { return this._totalPlantaScrapKgs; }
  public getTotalPlantaProduccionKgs(): number { return this._totalPlantaProduccionKgs; }
  
  public getAreaPorcentaje(area: string): number {
    return this._areaData[area]?.porcentaje ?? 0;
  }
  
  public getAreaScrapKgs(area: string): number {
    return this._areaData[area]?.scrapKgs ?? 0;
  }

  // Método para manejar clics en la leyenda de impresión
  public onImpresionLegendClick(index: number): void {
    this.impresionActiveIndex = index;
    this.cdr.markForCheck();
  }

  // Método para obtener si un elemento de la leyenda está activo
  public isImpresionLegendActive(index: number): boolean {
    return this.impresionActiveIndex === index;
  }

  // Método para obtener la leyenda activa para mostrar en el centro
  public getActiveLegendItem(): any {
    return this.impresionLegend[this.impresionActiveIndex] || this.impresionLegend[0] || {};
  }

  // Método para obtener el scrap formateado del elemento activo
  public getActiveScrapFormatted(): string {
    const activeItem = this.impresionLegend[this.impresionActiveIndex];
    if (!activeItem || activeItem.scrap === undefined || activeItem.scrap === null) {
      return '0';
    }
    return this.formatArgentinian(activeItem.scrap);
  }

  // Método para obtener el porcentaje formateado del elemento activo
  public getActivePorcentajeFormatted(): string {
    if (!this.impresionDoughnutData?.datasets?.[0]?.data) {
      return '0,00';
    }
    const activeValue = this.impresionDoughnutData.datasets[0].data[this.impresionActiveIndex];
    if (activeValue === undefined || activeValue === null) {
      return '0,00';
    }
    return this.formatArgentinian(Number(activeValue));
  }

  // ...existing code...

  ngOnInit(): void {
    this.loadDashboardData();
  }

  public loadDashboardData(): void {
    this._loading = true;
    this._error = null;
    this.cdr.markForCheck();

    this.dashboardService.getDashboardStats().then(
      (stats) => {
        this._dashboardStats = stats;
        this._loading = false;
        
        // Actualizar chart data de forma simple
        this.updateChartDataSimple();
        
        this.cdr.markForCheck();
      }
    ).catch(
      (error) => {
        console.error('Error loading dashboard data:', error);
        this._error = 'Error al cargar datos del dashboard';
        this._loading = false;
        this.cdr.markForCheck();
      }
    );
  }

  private updateChartDataSimple(): void {
    const stats = this._dashboardStats;
    if (!stats) return;

    // Actualizar datos básicos una vez
    this._totalPlantaPorcentaje = stats.totalPlanta?.porcentaje ?? 0;
    this._totalPlantaScrapKgs = stats.totalPlanta?.scrapKgs ?? 0;
    this._totalPlantaProduccionKgs = stats.totalPlanta?.produccionKgs ?? 0;
    
    this._areaData = {
      impresion: stats.areas?.impresion ?? { porcentaje: 0, scrapKgs: 0 },
      corte: stats.areas?.corte ?? { porcentaje: 0, scrapKgs: 0 },
      mangas: stats.areas?.mangas ?? { porcentaje: 0, scrapKgs: 0 },
      doypack: stats.areas?.doypack ?? { porcentaje: 0, scrapKgs: 0 },
      tabaco: stats.areas?.tabaco ?? { porcentaje: 0, scrapKgs: 0 },
      laminado: stats.areas?.laminado ?? { porcentaje: 0, scrapKgs: 0 }
    };

    // IMPRESIÓN: Usar datos reales del API
    const totalImpresion = (stats as any)?.raw?.totalImpresion;
    const impresionDetalle = (stats as any)?.raw?.impresionDetalleRaw;

    if (totalImpresion) {
      // Actualizar totales de impresión
      this.impresionTotalScrap = totalImpresion.totalScrap ?? 0;
      this.impresionTotalProduccion = totalImpresion.totalProducidos ?? 0;
      
      // Actualizar leyenda de impresión
      this.impresionLegend = [
        {
          label: 'Fischer',
          scrap: totalImpresion.scrapFischer ?? 0,
          produccion: totalImpresion.produccionFischer ?? 0,
          color: 'rgba(220, 53, 69, 1)',
          total: (totalImpresion.scrapFischer ?? 0) + (totalImpresion.produccionFischer ?? 0)
        },
        {
          label: 'Rotomec',
          scrap: totalImpresion.scrapRotomec ?? 0,
          produccion: totalImpresion.produccionRotomec ?? 0,
          color: 'rgba(13, 110, 253, 1)',
          total: (totalImpresion.scrapRotomec ?? 0) + (totalImpresion.produccionRotomec ?? 0)
        },
        {
          label: 'Heliostar',
          scrap: totalImpresion.scrapHeliostar ?? 0,
          produccion: totalImpresion.produccionHeliostar ?? 0,
          color: 'rgba(255, 193, 7, 1)',
          total: (totalImpresion.scrapHeliostar ?? 0) + (totalImpresion.produccionHeliostar ?? 0)
        },
        {
          label: 'Allstein',
          scrap: totalImpresion.scrapAllstein ?? 0,
          produccion: totalImpresion.produccionAllstein ?? 0,
          color: 'rgba(25, 135, 84, 1)',
          total: (totalImpresion.scrapAllstein ?? 0) + (totalImpresion.produccionAllstein ?? 0)
        }
      ];

      // Encontrar el índice del elemento con mayor total y establecerlo como activo
      const maxIndex = this.impresionLegend.reduce((maxIdx, item, idx, arr) => 
        item.total > arr[maxIdx].total ? idx : maxIdx, 0);
      this.impresionActiveIndex = maxIndex;

      // Doughnut chart con datos reales
      this.impresionDoughnutData = {
        labels: ['Fischer', 'Heliostar', 'Rotomec', 'Allstein'],
        datasets: [{
          label: 'Incidencia por máquina',
          data: [
            totalImpresion.incidenciaFischer || 0,
            totalImpresion.incidenciaHeliostar || 0,
            totalImpresion.incidenciaRotomec || 0,
            totalImpresion.incidenciaAllstein || 0
          ],
          backgroundColor: ['#dc3545', '#ffc107', '#0d6efd', '#198754']
        }]
      };
    }

    if (impresionDetalle && Array.isArray(impresionDetalle)) {
      // Timeline chart con datos reales
      this.impresionTimelineData = {
        labels: impresionDetalle.map(d => this.formatMonthLabel(d.DTPRODUCAO)),
        datasets: [
          this.createDatasetWithPointColors(
            'Fischer',
            impresionDetalle.map(d => d.FISCHER || 0),
            'rgba(220, 53, 69, 1)',
            'rgba(220, 53, 69, 0.2)'
          ),
          this.createDatasetWithPointColors(
            'Heliostar',
            impresionDetalle.map(d => d.HELIOSTAR || 0),
            'rgba(255, 193, 7, 1)',
            'rgba(255, 193, 7, 0.2)'
          ),
          this.createDatasetWithPointColors(
            'Rotomec',
            impresionDetalle.map(d => d.ROTOMEC || 0),
            'rgba(13, 110, 253, 1)',
            'rgba(13, 110, 253, 0.2)'
          ),
          this.createDatasetWithPointColors(
            'Allstein',
            impresionDetalle.map(d => d.ALLSTEIN || 0),
            'rgba(25, 135, 84, 1)',
            'rgba(25, 135, 84, 0.2)'
          )
        ]
      };
    }

    // Otros gráficos con datos estáticos por ahora
    this.laminacionTimelineData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [{
        label: 'Laminación',
        data: [5, 10, 8, 12, 15, 10],
        borderColor: 'rgba(255, 193, 7, 1)',
        backgroundColor: 'rgba(255, 193, 7, 0.1)'
      }]
    };

    this.totalScrapData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [{
        label: 'Scrap Total',
        data: [1500, 1800, 1400, 2000, 2800, 1300],
        borderColor: 'rgba(220, 53, 69, 1)',
        backgroundColor: 'rgba(220, 53, 69, 0.2)'
      }]
    };

    this.monthlyScrapData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [{
        label: 'Scrap %',
        data: [8, 7, 6, 12, 18, 5],
        borderColor: 'rgba(255, 193, 7, 1)',
        backgroundColor: 'rgba(255, 193, 7, 0.2)'
      }]
    };
  }
}
