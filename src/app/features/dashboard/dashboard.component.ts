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
          
          @if (loadingStates.kpis) {
            <!-- Skeleton para KPIs -->
            @for (i of [1,2,3,4,5,6,7,8,9]; track i) {
              <div class="kpi-card skeleton">
                <div class="kpi-icon skeleton-icon"></div>
                <div class="kpi-content">
                  <div class="skeleton-line skeleton-title"></div>
                  <div class="skeleton-line skeleton-subtitle"></div>
                  <div class="skeleton-line skeleton-value"></div>
                </div>
              </div>
            }
          } @else {
            <!-- KPIs reales -->
            <!-- Fila 1 - Totales Generales -->
            <div class="kpi-card kpi-general">
              <div class="kpi-icon kpi-icon-general">
                <div class="icon-bg icon-bg-percentage">
                  <mat-icon>percent</mat-icon>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-title">PORCENTAJE TOTAL PLANTA</div>
                <div class="kpi-subtitle">Últimos 30 días</div>
                <div class="kpi-value">{{ getTotalPlantaPorcentaje() | number:'1.1-1' }}%</div>
              </div>
            </div>

            <div class="kpi-card kpi-general">
              <div class="kpi-icon kpi-icon-general">
                <div class="icon-bg icon-bg-scrap">
                  <mat-icon>warning</mat-icon>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-title">SCRAP TOTAL PLANTA</div>
                <div class="kpi-subtitle">Últimos 30 días</div>
                <div class="kpi-value">{{ getTotalPlantaScrapKgs() | number:'1.0-0' }} Kg.</div>
              </div>
            </div>

            <div class="kpi-card kpi-general">
              <div class="kpi-icon kpi-icon-general">
                <div class="icon-bg icon-bg-production">
                  <mat-icon>factory</mat-icon>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-title">PRODUCIDOS TOTAL PLANTA</div>
                <div class="kpi-subtitle">Últimos 30 días</div>
                <div class="kpi-value">{{ getTotalPlantaProduccionKgs() | number:'1.0-0' }} Kg.</div>
              </div>
            </div>

            <!-- Fila 2 - Áreas Específicas -->
            <div class="kpi-card kpi-area">
              <div class="kpi-icon kpi-icon-area">
                <div class="icon-bg icon-bg-impresion">
                  <mat-icon>print</mat-icon>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-title">TOTAL IMPRESORAS</div>
                <div class="kpi-subtitle">Últimos 30 días</div>
                <div class="kpi-value">{{ getAreaPorcentaje('impresion') | number:'1.1-1' }}%</div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos Kg.</span>
                  <span class="detail-value">{{ getAreaScrapKgs('impresion') | number:'1.0-0' }} Kg.</span>
                </div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos producidos: Kg.</span>
                  <span class="detail-value">{{ getAreaProduccionKgs('impresion') | number:'1.0-0' }} Kg.</span>
                </div>
              </div>
            </div>

            <div class="kpi-card kpi-area">
              <div class="kpi-icon kpi-icon-area">
                <div class="icon-bg icon-bg-corte">
                  <mat-icon>content_cut</mat-icon>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-title">TOTAL CORTE</div>
                <div class="kpi-subtitle">Últimos 30 días</div>
                <div class="kpi-value">{{ getAreaPorcentaje('corte') | number:'1.1-1' }}%</div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos Kg.</span>
                  <span class="detail-value">{{ getAreaScrapKgs('corte') | number:'1.0-0' }} Kg.</span>
                </div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos producidos: Kg.</span>
                  <span class="detail-value">{{ getAreaProduccionKgs('corte') | number:'1.0-0' }} Kg.</span>
                </div>
              </div>
            </div>

            <div class="kpi-card kpi-area">
              <div class="kpi-icon kpi-icon-area">
                <div class="icon-bg icon-bg-mangas">
                  <mat-icon>shopping_bag</mat-icon>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-title">TOTAL MANGAS</div>
                <div class="kpi-subtitle">Últimos 30 días</div>
                <div class="kpi-value">{{ getAreaPorcentaje('mangas') | number:'1.1-1' }}%</div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos Kg.</span>
                  <span class="detail-value">{{ getAreaScrapKgs('mangas') | number:'1.0-0' }} Kg.</span>
                </div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos producidos: Kg.</span>
                  <span class="detail-value">{{ getAreaProduccionKgs('mangas') | number:'1.0-0' }} Kg.</span>
                </div>
              </div>
            </div>

            <!-- Fila 3 - Áreas Específicas -->
            <div class="kpi-card kpi-area">
              <div class="kpi-icon kpi-icon-area">
                <div class="icon-bg icon-bg-doypack">
                  <mat-icon>inventory_2</mat-icon>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-title">TOTAL DOYPACKS</div>
                <div class="kpi-subtitle">Últimos 30 días</div>
                <div class="kpi-value">{{ getAreaPorcentaje('doypack') | number:'1.1-1' }}%</div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos Kg.</span>
                  <span class="detail-value">{{ getAreaScrapKgs('doypack') | number:'1.0-0' }} Kg.</span>
                </div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos producidos: Kg.</span>
                  <span class="detail-value">{{ getAreaProduccionKgs('doypack') | number:'1.0-0' }} Kg.</span>
                </div>
              </div>
            </div>

            <div class="kpi-card kpi-area">
              <div class="kpi-icon kpi-icon-area">
                <div class="icon-bg icon-bg-tabaco">
                  <mat-icon>grass</mat-icon>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-title">TOTAL TABACO/BOX</div>
                <div class="kpi-subtitle">Últimos 30 días</div>
                <div class="kpi-value">{{ getAreaPorcentaje('tabaco') | number:'1.1-1' }}%</div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos Kg.</span>
                  <span class="detail-value">{{ getAreaScrapKgs('tabaco') | number:'1.0-0' }} Kg.</span>
                </div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos producidos: Kg.</span>
                  <span class="detail-value">{{ getAreaProduccionKgs('tabaco') | number:'1.0-0' }} Kg.</span>
                </div>
              </div>
            </div>

            <div class="kpi-card kpi-area">
              <div class="kpi-icon kpi-icon-area">
                <div class="icon-bg icon-bg-laminado">
                  <mat-icon>layers</mat-icon>
                </div>
              </div>
              <div class="kpi-content">
                <div class="kpi-title">TOTAL LAMINADO</div>
                <div class="kpi-subtitle">Últimos 30 días</div>
                <div class="kpi-value">{{ getAreaPorcentaje('laminado') | number:'1.1-1' }}%</div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos Kg.</span>
                  <span class="detail-value">{{ getAreaScrapKgs('laminado') | number:'1.0-0' }} Kg.</span>
                </div>
                <div class="kpi-detail">
                  <span class="detail-label">Total de kilos producidos: Kg.</span>
                  <span class="detail-value">{{ getAreaProduccionKgs('laminado') | number:'1.0-0' }} Kg.</span>
                </div>
              </div>
            </div>
          }

        </div>

        <!-- 4 Gráficos a pantalla completa -->
        <div class="dashboard-charts">
          
          <!-- Gráfico 1: Área Impresión -->
          <div class="chart-section-full">
            @if (loadingStates.impresion) {
              <!-- Skeleton para Impresión -->
              <div class="chart-skeleton">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-subtitle"></div>
                <div class="chart-container-dual">
                  <div class="chart-left">
                    <div class="skeleton-chart"></div>
                  </div>
                  <div class="chart-separator"></div>
                  <div class="chart-right">
                    <div class="skeleton-circle"></div>
                    <div class="skeleton-legend">
                      @for (i of [1,2,3,4]; track i) {
                        <div class="skeleton-line skeleton-legend-item"></div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            } @else {
              <!-- Gráfico real de Impresión -->
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
            }
          </div>

          <!-- Gráfico 2: Área Laminación -->
          <div class="chart-section-full">
            @if (loadingStates.laminacion) {
              <!-- Skeleton para Laminación -->
              <div class="chart-skeleton">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-subtitle"></div>
                <div class="chart-container-dual">
                  <div class="chart-left">
                    <div class="skeleton-chart"></div>
                  </div>
                  <div class="chart-separator"></div>
                  <div class="chart-right">
                    <div class="skeleton-circle"></div>
                    <div class="skeleton-legend">
                      @for (i of [1,2,3,4]; track i) {
                        <div class="skeleton-line skeleton-legend-item"></div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            } @else {
              <!-- Gráfico real de Laminación -->
              <div class="chart-container-dual">
                <div class="chart-left">
                  <h4 class="chart-title">Área Laminación</h4>
                  <p class="chart-subtitle">Incidencias de los últimos 12 meses</p>
                  <div class="chart-content">
                    <app-chart 
                      [chartData]="laminacionTimelineData"
                      [options]="laminacionChartOptionsFormatted"
                      chartType="line">
                    </app-chart>
                  </div>
                </div>
                <!-- Separador visual -->
                <div class="chart-separator"></div>
                <div class="chart-right">
                  <p class="chart-subtitle-right">Incidencias de los últimos 12 meses</p>
                  
                  <!-- Totales -->
                  <div class="laminacion-totals">
                    <div class="totals-container" style="display: flex; gap: 25px; margin-bottom: 8px; font-size: 1em;">
                      <div>
                        <div class="total-value" style="font-size: 1.0em; color: #ffffff; font-weight: 600;">{{ laminacionTotalScrap | argentinianNumber }}</div>
                        <div class="total-label" style="font-size: 0.65em; color: #ffffff;">kilos de Scrap</div>
                      </div>
                      <div>
                        <div class="total-value" style="font-size: 1.0em; color: #ffffff; font-weight: 600;">{{ laminacionTotalProduccion | argentinianNumber }}</div>
                        <div class="total-label" style="font-size: 0.65em; color: #ffffff;">kilos Producidos</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Doughnut chart más grande con leyenda central -->
                  <div style="width: 180px; height: 180px; margin: 0 auto 8px auto; position: relative;">
                    <app-chart 
                      [chartData]="laminacionDoughnutData"
                      [options]="laminacionDoughnutChartOptionsFormatted"
                      chartType="doughnut">
                    </app-chart>
                    <!-- Leyenda central sobre el doughnut -->
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none;">
                      <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 4px;">
                        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:{{laminacionLegend[laminacionActiveIndex]?.color || '#fff'}};"></span>
                        <div style="font-size: 0.9em; color: #fff; font-weight: 600;">{{ laminacionLegend[laminacionActiveIndex]?.label || '' }}</div>
                      </div>
                      <div style="font-size: 0.8em; color: #fff; margin-top: 2px;">{{ getActivePorcentajeLaminacionFormatted() }}%</div>
                    </div>
                  </div>
                  
                  <!-- Leyenda compacta -->
                  <div class="laminacion-legend" style="font-size: 0.8em; width: 100%;">
                    <div style="padding: 0;">
                      <div style="color: #999; font-size: 0.7em; margin-bottom: 6px;">Scrap / Producidos</div>
                      <div style="display: flex; flex-direction: column; gap: 2px;">
                        <div *ngFor="let item of laminacionLegend" style="display: flex; align-items: center; gap: 8px; font-size: 0.85em;">
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
            }
          </div>

          <!-- Gráfico 3: Porcentaje mensual de scrap planta -->
          <div class="chart-section-full">
            @if (loadingStates.monthlyScrap) {
              <!-- Skeleton para Monthly Scrap -->
              <div class="chart-skeleton">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-subtitle"></div>
                <div class="skeleton-chart-full"></div>
              </div>
            } @else {
              <!-- Gráfico real -->
              <h4 class="chart-title">Porcentaje mensual de scrap planta</h4>
              <p class="chart-subtitle">Incidencias de los últimos 12 meses</p>
              <div class="chart-container-full">
                <app-chart 
                  [chartData]="monthlyScrapData"
                  [options]="monthlyScrapChartOptionsFormatted"
                  chartType="line">
                </app-chart>
              </div>
            }
          </div>

          <!-- Gráfico 4: Total scrap planta -->
          <div class="chart-section-full">
            @if (loadingStates.totalScrap) {
              <!-- Skeleton para Total Scrap -->
              <div class="chart-skeleton">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-subtitle"></div>
                <div class="skeleton-chart-full"></div>
              </div>
            } @else {
              <!-- Gráfico real -->
              <h4 class="chart-title">Total scrap planta</h4>
              <p class="chart-subtitle">Incidencias de los últimos 12 meses</p>
              <div class="chart-container-full">
                <app-chart 
                  [chartData]="totalScrapData"
                  [options]="totalScrapChartOptionsFormatted"
                  chartType="line">
                </app-chart>
              </div>
            }
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
      border-radius: 8px;
      padding: 20px;
      display: flex;
      align-items: flex-start;
      min-height: 120px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }

    /* Efecto de gradiente para KPIs generales */
    .kpi-card.kpi-general::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
    }

    /* Efecto de borde para KPIs de área */
    .kpi-card.kpi-area::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(74, 144, 226, 0.8);
    }

    .kpi-icon {
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kpi-icon-general {
      width: 60px;
    }

    .kpi-icon-area {
      width: 50px;
    }

    .icon-bg {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .kpi-icon-general .icon-bg {
      width: 56px;
      height: 56px;
    }

    .icon-bg mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .kpi-icon-general .icon-bg mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    /* Colores de íconos para totales generales */
    .icon-bg-percentage {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .icon-bg-scrap {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .icon-bg-production {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    /* Colores de íconos para áreas específicas */
    .icon-bg-impresion {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;
    }

    .icon-bg-corte {
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
      color: #333;
    }

    .icon-bg-mangas {
      background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
      color: #333;
    }

    .icon-bg-doypack {
      background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
      color: white;
    }

    .icon-bg-tabaco {
      background: linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%);
      color: white;
    }

    .icon-bg-laminado {
      background: linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%);
      color: white;
    }

    .kpi-content {
      flex: 1;
    }

    .kpi-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 6px;
      color: #fff;
      letter-spacing: 0.5px;
    }

    .kpi-subtitle {
      font-size: 11px;
      color: #999;
      margin-bottom: 12px;
      font-weight: 400;
    }

    .kpi-value {
      font-size: 28px;
      font-weight: 300;
      color: #fff;
      margin-bottom: 8px;
      line-height: 1;
    }

    .kpi-general .kpi-value {
      font-size: 32px;
      font-weight: 200;
    }

    .kpi-detail {
      font-size: 11px;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .detail-label {
      color: #888;
      font-weight: 400;
    }

    .detail-value {
      color: #4ecdc4;
      font-weight: 600;
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

    .laminacion-totals {
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

      .laminacion-legend {
        font-size: 0.9em !important;
      }
      .laminacion-legend div[style*="font-size: 0.7em"] {
        font-size: 0.8em !important;
      }
      .laminacion-legend div[style*="font-size: 0.85em"] {
        font-size: 0.95em !important;
      }
      
      .laminacion-totals .total-value {
        font-size: 1.1em !important;
      }
      .laminacion-totals .total-label {
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

    /* Skeleton loading styles */
    .skeleton {
      animation: skeleton-loading 1.5s infinite ease-in-out;
    }

    @keyframes skeleton-loading {
      0% {
        opacity: 0.7;
      }
      50% {
        opacity: 0.4;
      }
      100% {
        opacity: 0.7;
      }
    }

    .skeleton-line {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      height: 16px;
      margin-bottom: 8px;
    }

    .skeleton-title {
      width: 60%;
      height: 20px;
    }

    .skeleton-subtitle {
      width: 40%;
      height: 12px;
    }

    .skeleton-value {
      width: 80%;
      height: 24px;
    }

    .skeleton-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      margin-right: 16px;
    }

    .skeleton-chart {
      width: 100%;
      height: 350px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      position: relative;
      overflow: hidden;
    }

    .skeleton-chart::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      animation: skeleton-shimmer 2s infinite;
    }

    .skeleton-chart-full {
      width: 100%;
      height: 400px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      position: relative;
      overflow: hidden;
    }

    .skeleton-chart-full::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      animation: skeleton-shimmer 2s infinite;
    }

    .skeleton-circle {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      margin: 0 auto 8px auto;
      position: relative;
      overflow: hidden;
    }

    .skeleton-circle::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      animation: skeleton-shimmer 2s infinite;
    }

    .skeleton-legend {
      width: 100%;
      margin-top: 16px;
    }

    .skeleton-legend-item {
      width: 90%;
      height: 14px;
      margin-bottom: 4px;
    }

    @keyframes skeleton-shimmer {
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    }

    .chart-skeleton {
      padding: 0;
    }

    .chart-skeleton .skeleton-title {
      margin-bottom: 3px;
    }

    .chart-skeleton .skeleton-subtitle {
      margin-bottom: 15px;
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

  // Formatted chart options for Laminación (igual que impresión)
  public readonly laminacionChartOptionsFormatted = {
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
            const label = this.laminacionTimelineData.labels?.[index];
            return this.formatMonthLabelForDisplay(label as string);
          }
        }
      }
    }
  };

  // Doughnut chart options para laminación (similar a impresión)
  public readonly laminacionDoughnutChartOptionsFormatted = {
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
        this.laminacionActiveIndex = elements[0].index;
        event.native.target.style.cursor = 'pointer';
      } else {
        event.native.target.style.cursor = 'default';
      }
    }
  };

  // Formatted chart options for Monthly Scrap (con eje X dinámico)
  public readonly monthlyScrapChartOptionsFormatted = {
    ...this.areaChartOptions,
    scales: {
      ...this.areaChartOptions.scales,
      x: {
        ...this.areaChartOptions.scales.x,
        ticks: { 
          color: 'rgba(255,255,255,0.6)', 
          font: { size: 11 },
          callback: (value: any, index: any, values: any) => {
            const label = this.monthlyScrapData.labels?.[index];
            return this.formatMonthLabelForDisplay(label as string);
          }
        }
      }
    }
  };

  // Formatted chart options for Total Scrap (con eje X dinámico)
  public readonly totalScrapChartOptionsFormatted = {
    ...this.areaChartOptions,
    scales: {
      ...this.areaChartOptions.scales,
      x: {
        ...this.areaChartOptions.scales.x,
        ticks: { 
          color: 'rgba(255,255,255,0.6)', 
          font: { size: 11 },
          callback: (value: any, index: any, values: any) => {
            const label = this.totalScrapData.labels?.[index];
            return this.formatMonthLabelForDisplay(label as string);
          }
        }
      }
    }
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

  // Totals and legend for Laminación - igual que impresión
  public laminacionTotalScrap: number = 0;
  public laminacionTotalProduccion: number = 0;
  public laminacionLegend: any[] = [];
  public laminacionActiveIndex: number = 0; // Para la leyenda activa
  
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  // Properties (NO usar signals para evitar leaks)
  private _loading = false;
  private _error: string | null = null;
  private _dashboardStats: DashboardStats | null = null;

  // Estados de carga granulares
  public loadingStates = {
    kpis: true,
    impresion: true,
    laminacion: true,
    monthlyScrap: true,
    totalScrap: true
  };

  // Chart data properties - calculadas una vez
  public impresionTimelineData: ChartData = { labels: [], datasets: [] };
  public impresionDoughnutData: ChartData = { labels: [], datasets: [] };
  public laminacionTimelineData: ChartData = { labels: [], datasets: [] };
  public laminacionDoughnutData: ChartData = { labels: [], datasets: [] };
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

  public getAreaProduccionKgs(area: string): number {
    return this._areaData[area]?.produccionKgs ?? 0;
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

  // Método para obtener el porcentaje formateado del elemento activo de laminación
  public getActivePorcentajeLaminacionFormatted(): string {
    if (!this.laminacionDoughnutData?.datasets?.[0]?.data) {
      return '0,00';
    }
    const activeValue = this.laminacionDoughnutData.datasets[0].data[this.laminacionActiveIndex];
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
    
    // Resetear estados de carga
    this.loadingStates = {
      kpis: true,
      impresion: true,
      laminacion: true,
      monthlyScrap: true,
      totalScrap: true
    };
    
    this.cdr.markForCheck();

    // Cargar datos de forma progresiva
    this.loadProgressiveData();
  }

  private async loadProgressiveData(): Promise<void> {
    try {
      // Cargar KPIs primero (generalmente más rápido)
      this.loadKPIData();
      
      // Cargar gráficos en paralelo
      this.loadImpresionData();
      this.loadLaminacionData();
      this.loadMonthlyScrapData();
      this.loadTotalScrapData();
      
      // El loading principal se desactiva inmediatamente para mostrar los skeletons
      this._loading = false;
      this.cdr.markForCheck();
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this._error = 'Error al cargar datos del dashboard';
      this._loading = false;
      this.cdr.markForCheck();
    }
  }

  private async loadKPIData(): Promise<void> {
    try {
      const [totalPlanta, totalPlantaCerradas, ...areas] = await Promise.all([
        this.dashboardService.getTotalPlanta().toPromise(),
        this.dashboardService.getTotalPlantaCerradas().toPromise(),
        this.dashboardService.getTotalAreas(1).toPromise(), // Impresión
        this.dashboardService.getTotalAreas(2).toPromise(), // Corte
        this.dashboardService.getTotalAreas(3).toPromise(), // Mangas
        this.dashboardService.getTotalAreas(4).toPromise(), // Doypack
        this.dashboardService.getTotalAreas(5).toPromise(), // Tabaco
        this.dashboardService.getTotalAreas(6).toPromise(), // Laminado
      ]);

      // Actualizar KPIs
      this._totalPlantaPorcentaje = totalPlanta?.PORCENTAJE || 0;
      this._totalPlantaScrapKgs = totalPlanta?.SCRAP_KGS || 0;
      this._totalPlantaProduccionKgs = totalPlanta?.PRODUCCION_KGS || 0;
      
      this._areaData = {
        impresion: { porcentaje: areas[0]?.PORCENTAJE || 0, scrapKgs: areas[0]?.SCRAP_KGS || 0, produccionKgs: areas[0]?.PRODUCCION_KGS || 0 },
        corte: { porcentaje: areas[1]?.PORCENTAJE || 0, scrapKgs: areas[1]?.SCRAP_KGS || 0, produccionKgs: areas[1]?.PRODUCCION_KGS || 0 },
        mangas: { porcentaje: areas[2]?.PORCENTAJE || 0, scrapKgs: areas[2]?.SCRAP_KGS || 0, produccionKgs: areas[2]?.PRODUCCION_KGS || 0 },
        doypack: { porcentaje: areas[3]?.PORCENTAJE || 0, scrapKgs: areas[3]?.SCRAP_KGS || 0, produccionKgs: areas[3]?.PRODUCCION_KGS || 0 },
        tabaco: { porcentaje: areas[4]?.PORCENTAJE || 0, scrapKgs: areas[4]?.SCRAP_KGS || 0, produccionKgs: areas[4]?.PRODUCCION_KGS || 0 },
        laminado: { porcentaje: areas[5]?.PORCENTAJE || 0, scrapKgs: areas[5]?.SCRAP_KGS || 0, produccionKgs: areas[5]?.PRODUCCION_KGS || 0 }
      };

      this.loadingStates.kpis = false;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading KPI data:', error);
      this.loadingStates.kpis = false;
      this.cdr.markForCheck();
    }
  }

  private async loadImpresionData(): Promise<void> {
    try {
      const [totalImpresion, impresionDetalle] = await Promise.all([
        this.dashboardService.getTotalImpresion().toPromise(),
        this.dashboardService.getImpresionDetalle().toPromise()
      ]);

      if (totalImpresion) {
        this.impresionTotalScrap = totalImpresion.totalScrap ?? 0;
        this.impresionTotalProduccion = totalImpresion.totalProducidos ?? 0;
        
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

        const maxIndex = this.impresionLegend.reduce((maxIdx, item, idx, arr) => 
          item.total > arr[maxIdx].total ? idx : maxIdx, 0);
        this.impresionActiveIndex = maxIndex;

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

      this.loadingStates.impresion = false;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading impresion data:', error);
      this.loadingStates.impresion = false;
      this.cdr.markForCheck();
    }
  }

  private async loadLaminacionData(): Promise<void> {
    try {
      const [totalLaminacion, laminacionDetalle] = await Promise.all([
        this.dashboardService.getTotalLaminacion().toPromise(),
        this.dashboardService.getLaminacionDetalle().toPromise()
      ]);

      if (totalLaminacion) {
        this.laminacionTotalScrap = (totalLaminacion as any).totalScrap ?? 0;
        this.laminacionTotalProduccion = (totalLaminacion as any).totalProducidos ?? 0;
        
        if ((totalLaminacion as any).listadodetallemaquina && Array.isArray((totalLaminacion as any).listadodetallemaquina)) {
          const laminadoraColors = [
            'rgba(220, 53, 69, 1)',
            'rgba(13, 110, 253, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(25, 135, 84, 1)'
          ];

          this.laminacionLegend = (totalLaminacion as any).listadodetallemaquina.map((item: any, index: number) => ({
            label: item.nombre?.replace('LAM LAMINA ', 'Lam ') ?? `Lam ${index + 2}`,
            scrap: item.scrap ?? 0,
            produccion: item.produccion ?? 0,
            color: laminadoraColors[index % laminadoraColors.length],
            total: (item.scrap ?? 0) + (item.produccion ?? 0)
          }));

          const maxIndex = this.laminacionLegend.reduce((maxIdx, item, idx, arr) => 
            item.total > arr[maxIdx].total ? idx : maxIdx, 0);
          this.laminacionActiveIndex = maxIndex;

          this.laminacionDoughnutData = {
            labels: this.laminacionLegend.map(item => item.label),
            datasets: [{
              label: 'Incidencia por máquina',
              data: (totalLaminacion as any).listadodetallemaquina.map((item: any) => item.incidencia || 0),
              backgroundColor: laminadoraColors.slice(0, (totalLaminacion as any).listadodetallemaquina.length)
            }]
          };
        }
      }

      if (laminacionDetalle && Array.isArray(laminacionDetalle)) {
        this.laminacionTimelineData = {
          labels: laminacionDetalle.map(d => this.formatMonthLabel(d.DTPRODUCAO)),
          datasets: [
            this.createDatasetWithPointColors(
              'Lam 2',
              laminacionDetalle.map(d => d.LAMINADORA_2 || 0),
              'rgba(220, 53, 69, 1)',
              'rgba(220, 53, 69, 0.2)'
            ),
            this.createDatasetWithPointColors(
              'Lam 3',
              laminacionDetalle.map(d => d.LAMINADORA_3 || 0),
              'rgba(13, 110, 253, 1)',
              'rgba(13, 110, 253, 0.2)'
            ),
            this.createDatasetWithPointColors(
              'Lam 4',
              laminacionDetalle.map(d => d.LAMINADORA_4 || 0),
              'rgba(255, 193, 7, 1)',
              'rgba(255, 193, 7, 0.2)'
            ),
            this.createDatasetWithPointColors(
              'Lam 5',
              laminacionDetalle.map(d => d.LAMINADORA_5 || 0),
              'rgba(25, 135, 84, 1)',
              'rgba(25, 135, 84, 0.2)'
            )
          ]
        };
      }

      this.loadingStates.laminacion = false;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading laminacion data:', error);
      this.loadingStates.laminacion = false;
      this.cdr.markForCheck();
    }
  }

  private async loadMonthlyScrapData(): Promise<void> {
    try {
      const indicadoresTotalesOp = await this.dashboardService.getIndicadoresTotalesOp().toPromise();
      
      if (indicadoresTotalesOp && Array.isArray(indicadoresTotalesOp)) {
        this.monthlyScrapData = {
          labels: indicadoresTotalesOp.map(d => this.formatMonthLabel(d.DTPRODUCAO)),
          datasets: [
            this.createDatasetWithPointColors(
              'Porcentaje Scrap',
              indicadoresTotalesOp.map(d => d.Todas || 0),
              'rgba(255, 193, 7, 1)',
              'rgba(255, 193, 7, 0.2)'
            )
          ]
        };
      }

      this.loadingStates.monthlyScrap = false;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading monthly scrap data:', error);
      this.loadingStates.monthlyScrap = false;
      this.cdr.markForCheck();
    }
  }

  private async loadTotalScrapData(): Promise<void> {
    try {
      const indicadoresTotalScrap = await this.dashboardService.getIndicadoresTotalScrap().toPromise();
      
      if (indicadoresTotalScrap && Array.isArray(indicadoresTotalScrap)) {
        this.totalScrapData = {
          labels: indicadoresTotalScrap.map(d => this.formatMonthLabel(d.DTPRODUCAO)),
          datasets: [
            this.createDatasetWithPointColors(
              'Scrap',
              indicadoresTotalScrap.map(d => (d as any).SCRAP || 0),
              'rgba(220, 53, 69, 1)',
              'rgba(220, 53, 69, 0.2)'
            ),
            this.createDatasetWithPointColors(
              'Producción',
              indicadoresTotalScrap.map(d => (d as any).PRODUCCION_KGS || 0),
              'rgba(25, 135, 84, 1)',
              'rgba(25, 135, 84, 0.2)'
            )
          ]
        };
      }

      this.loadingStates.totalScrap = false;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading total scrap data:', error);
      this.loadingStates.totalScrap = false;
      this.cdr.markForCheck();
    }
  }
}
