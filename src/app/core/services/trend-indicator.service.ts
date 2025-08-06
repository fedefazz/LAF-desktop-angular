import { Injectable } from '@angular/core';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface TrendIndicator {
  direction: TrendDirection;
  percentage: number;
  icon: string;
  color: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrendIndicatorService {
  
  /**
   * Calcular tendencia basada en valores actuales y anteriores
   */
  public calculateTrend(currentValue: number, previousValue: number): TrendIndicator {
    if (previousValue === 0 || currentValue === previousValue) {
      return this.createTrendIndicator('neutral', 0);
    }
    
    const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
    const direction: TrendDirection = percentageChange > 0 ? 'up' : 'down';
    
    return this.createTrendIndicator(direction, Math.abs(percentageChange));
  }
  
  /**
   * Calcular tendencia para un array de valores (últimos vs anteriores)
   */
  public calculateTrendFromArray(values: number[]): TrendIndicator {
    if (values.length < 2) {
      return this.createTrendIndicator('neutral', 0);
    }
    
    const currentPeriod = values.slice(-3); // Últimos 3 valores
    const previousPeriod = values.slice(-6, -3); // 3 valores anteriores
    
    if (previousPeriod.length === 0) {
      return this.createTrendIndicator('neutral', 0);
    }
    
    const currentAvg = currentPeriod.reduce((a, b) => a + b, 0) / currentPeriod.length;
    const previousAvg = previousPeriod.reduce((a, b) => a + b, 0) / previousPeriod.length;
    
    return this.calculateTrend(currentAvg, previousAvg);
  }
  
  /**
   * Obtener indicador de tendencia para métricas específicas
   */
  public getScrapTrend(currentScrap: number, previousScrap: number): TrendIndicator {
    const trend = this.calculateTrend(currentScrap, previousScrap);
    
    // Para scrap, "up" es malo y "down" es bueno, así que invertimos los colores
    if (trend.direction === 'up') {
      return {
        ...trend,
        color: '#dc3545', // Rojo para aumento de scrap (malo)
        label: 'Aumento en scrap'
      };
    } else if (trend.direction === 'down') {
      return {
        ...trend,
        color: '#28a745', // Verde para disminución de scrap (bueno)
        label: 'Reducción en scrap'
      };
    }
    
    return trend;
  }
  
  public getProductionTrend(currentProduction: number, previousProduction: number): TrendIndicator {
    const trend = this.calculateTrend(currentProduction, previousProduction);
    
    // Para producción, "up" es bueno y "down" es malo
    if (trend.direction === 'up') {
      return {
        ...trend,
        color: '#28a745', // Verde para aumento de producción (bueno)
        label: 'Aumento en producción'
      };
    } else if (trend.direction === 'down') {
      return {
        ...trend,
        color: '#dc3545', // Rojo para disminución de producción (malo)
        label: 'Disminución en producción'
      };
    }
    
    return trend;
  }
  
  public getEfficiencyTrend(currentEfficiency: number, previousEfficiency: number): TrendIndicator {
    const trend = this.calculateTrend(currentEfficiency, previousEfficiency);
    
    if (trend.direction === 'up') {
      return {
        ...trend,
        color: '#28a745',
        label: 'Mejora en eficiencia'
      };
    } else if (trend.direction === 'down') {
      return {
        ...trend,
        color: '#dc3545',
        label: 'Reducción en eficiencia'
      };
    }
    
    return trend;
  }
  
  /**
   * Crear objeto de indicador de tendencia
   */
  private createTrendIndicator(direction: TrendDirection, percentage: number): TrendIndicator {
    const icons = {
      up: '↗️',
      down: '↘️',
      neutral: '➡️'
    };
    
    const colors = {
      up: '#007bff',
      down: '#007bff', 
      neutral: '#6c757d'
    };
    
    const labels = {
      up: 'Tendencia positiva',
      down: 'Tendencia negativa',
      neutral: 'Sin cambios'
    };
    
    return {
      direction,
      percentage: Math.round(percentage * 100) / 100, // Redondear a 2 decimales
      icon: icons[direction],
      color: colors[direction],
      label: labels[direction]
    };
  }
  
  /**
   * Obtener clase CSS para la tendencia
   */
  public getTrendClass(trend: TrendIndicator): string {
    return `trend-${trend.direction}`;
  }
  
  /**
   * Formatear porcentaje para mostrar
   */
  public formatPercentage(percentage: number): string {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  }
  
  /**
   * Obtener texto descriptivo completo
   */
  public getTrendDescription(trend: TrendIndicator): string {
    if (trend.direction === 'neutral') {
      return 'Sin cambios significativos';
    }
    
    const changeText = trend.direction === 'up' ? 'aumento' : 'disminución';
    return `${trend.icon} ${changeText} del ${trend.percentage.toFixed(1)}%`;
  }
}
