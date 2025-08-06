import { Injectable, signal, computed } from '@angular/core';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'user' | 'scrap' | 'report' | 'setting' | 'notification';
  route?: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerm = signal('');
  private isSearchOpen = signal(false);

  // Mock data para demostración
  private allItems: SearchResult[] = [
    // Usuarios
    { id: '1', title: 'Juan Pérez', description: 'Supervisor - Área Producción', type: 'user', route: '/users', icon: 'person' },
    { id: '2', title: 'María González', description: 'Administrador del Sistema', type: 'user', route: '/users', icon: 'person' },
    { id: '3', title: 'Carlos Rodríguez', description: 'Empleado - Área Scrap', type: 'user', route: '/users', icon: 'person' },
    
    // Productos Scrap
    { id: '4', title: 'Bobina #12345', description: 'Scrap por defecto de impresión', type: 'scrap', route: '/scrap', icon: 'inventory' },
    { id: '5', title: 'Lámina Plástica #67890', description: 'Material recuperable', type: 'scrap', route: '/scrap', icon: 'inventory' },
    { id: '6', title: 'Rollo Defectuoso #54321', description: 'Pendiente de clasificación', type: 'scrap', route: '/scrap', icon: 'inventory' },
    
    // Reportes
    { id: '7', title: 'Reporte Mensual Scrap', description: 'Estadísticas del mes actual', type: 'report', route: '/reports', icon: 'assessment' },
    { id: '8', title: 'Análisis de Productividad', description: 'Métricas de rendimiento', type: 'report', route: '/reports', icon: 'trending_up' },
    { id: '9', title: 'Dashboard Ejecutivo', description: 'Resumen de KPIs principales', type: 'report', route: '/reports', icon: 'dashboard' },
    
    // Configuraciones
    { id: '10', title: 'Configuración de Usuario', description: 'Perfil y preferencias', type: 'setting', route: '/settings', icon: 'account_circle' },
    { id: '11', title: 'Seguridad del Sistema', description: 'Gestión de accesos y permisos', type: 'setting', route: '/settings', icon: 'security' },
    { id: '12', title: 'Base de Datos', description: 'Configuración de conexión', type: 'setting', route: '/settings', icon: 'storage' }
  ];

  // Computed properties
  searchResults = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return [];
    
    return this.allItems.filter(item => 
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    ).slice(0, 8); // Límite de 8 resultados
  });

  isOpen = this.isSearchOpen.asReadonly();
  currentTerm = this.searchTerm.asReadonly();

  // Methods
  setSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  openSearch() {
    this.isSearchOpen.set(true);
  }

  closeSearch() {
    this.isSearchOpen.set(false);
    this.searchTerm.set('');
  }

  getTypeColor(type: SearchResult['type']): string {
    const colors = {
      user: 'primary',
      scrap: 'accent',
      report: 'warn',
      setting: 'primary',
      notification: 'accent'
    };
    return colors[type];
  }

  getTypeLabel(type: SearchResult['type']): string {
    const labels = {
      user: 'Usuario',
      scrap: 'Scrap',
      report: 'Reporte',
      setting: 'Configuración',
      notification: 'Notificación'
    };
    return labels[type];
  }
}
