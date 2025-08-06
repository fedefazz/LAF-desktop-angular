import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map } from 'rxjs';
import { Product, ProductStatus, ProductSpecifications, ProductMaterial } from '../models/laf-business.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  // Signals para estado reactivo
  private productsSignal = signal<Product[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  public products = this.productsSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();

  public productStats = computed(() => {
    const products = this.productsSignal();
    return {
      total: products.length,
      open: products.filter(p => p.status === ProductStatus.OPEN).length,
      standby: products.filter(p => p.status === ProductStatus.STANDBY).length,
      closed: products.filter(p => p.status === ProductStatus.CLOSED).length,
      cancelled: products.filter(p => p.status === ProductStatus.CANCELLED).length,
      rushOrders: products.filter(p => p.rushOrder).length
    };
  });

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulamos datos mock
    setTimeout(() => {
      const mockProducts = this.generateMockProducts();
      this.productsSignal.set(mockProducts);
      this.productsSubject.next(mockProducts);
      this.loadingSignal.set(false);
    }, 1000);
  }

  public getAllProducts(): Observable<Product[]> {
    return this.products$.pipe(delay(500));
  }

  public getProductById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id)),
      delay(300)
    );
  }

  public getProductsByStatus(status: ProductStatus): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.status === status)),
      delay(300)
    );
  }

  public getProductsByCustomer(customerName: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => 
        p.customerName.toLowerCase().includes(customerName.toLowerCase())
      )),
      delay(300)
    );
  }

  public createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentProducts = this.productsSignal();
    const updatedProducts = [...currentProducts, newProduct];
    
    this.productsSignal.set(updatedProducts);
    this.productsSubject.next(updatedProducts);

    return of(newProduct).pipe(delay(500));
  }

  public updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
    const currentProducts = this.productsSignal();
    const productIndex = currentProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct = {
      ...currentProducts[productIndex],
      ...updates,
      updatedAt: new Date()
    };

    const updatedProducts = [...currentProducts];
    updatedProducts[productIndex] = updatedProduct;
    
    this.productsSignal.set(updatedProducts);
    this.productsSubject.next(updatedProducts);

    return of(updatedProduct).pipe(delay(500));
  }

  public deleteProduct(id: string): Observable<boolean> {
    const currentProducts = this.productsSignal();
    const updatedProducts = currentProducts.filter(p => p.id !== id);
    
    this.productsSignal.set(updatedProducts);
    this.productsSubject.next(updatedProducts);

    return of(true).pipe(delay(500));
  }

  public updateProductStatus(id: string, status: ProductStatus): Observable<Product> {
    const updates: Partial<Product> = { status };
    
    if (status === ProductStatus.STANDBY) {
      updates.standByDate = new Date();
    } else if (status === ProductStatus.CLOSED) {
      updates.finalDate = new Date();
      if (updates.standByDate && updates.standByEndDate) {
        updates.standByDays = Math.ceil(
          (updates.standByEndDate.getTime() - updates.standByDate.getTime()) / (1000 * 60 * 60 * 24)
        );
      }
    }

    return this.updateProduct(id, updates);
  }

  public searchProducts(query: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => 
        p.code.toLowerCase().includes(query.toLowerCase()) ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.customerName.toLowerCase().includes(query.toLowerCase()) ||
        p.commercialResponsible.toLowerCase().includes(query.toLowerCase())
      )),
      delay(300)
    );
  }

  public getProductsInDateRange(startDate: Date, endDate: Date): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => {
        const creationDate = new Date(p.creationDate);
        return creationDate >= startDate && creationDate <= endDate;
      })),
      delay(300)
    );
  }

  private generateMockProducts(): Product[] {
    const customers = [
      'Coca-Cola FEMSA', 'PepsiCo', 'Unilever', 'Nestlé', 'Procter & Gamble',
      'Johnson & Johnson', 'Colgate-Palmolive', 'Kimberly-Clark', 'Grupo Bimbo', 'Alpina'
    ];

    const commercialResponsibles = [
      'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez'
    ];

    const products: Product[] = [];
    
    for (let i = 1; i <= 50; i++) {
      const creationDate = new Date();
      creationDate.setDate(creationDate.getDate() - Math.floor(Math.random() * 90));
      
      const desiredDate = new Date(creationDate);
      desiredDate.setDate(desiredDate.getDate() + Math.floor(Math.random() * 30) + 7);

      const status = [
        ProductStatus.OPEN,
        ProductStatus.STANDBY, 
        ProductStatus.CLOSED,
        ProductStatus.CANCELLED
      ][Math.floor(Math.random() * 4)];

      products.push({
        id: `PRD-${i.toString().padStart(4, '0')}`,
        code: `LAF-${i.toString().padStart(4, '0')}`,
        name: `Producto ${i} - ${customers[Math.floor(Math.random() * customers.length)]}`,
        status,
        customerName: customers[Math.floor(Math.random() * customers.length)],
        creationDate,
        originalOrderDate: creationDate,
        desiredDate,
        initialDate: status !== ProductStatus.OPEN ? creationDate : undefined,
        finalDate: status === ProductStatus.CLOSED ? desiredDate : undefined,
        standByDate: status === ProductStatus.STANDBY ? new Date() : undefined,
        standByEndDate: undefined,
        days: Math.floor(Math.random() * 30) + 1,
        standByDays: status === ProductStatus.STANDBY ? Math.floor(Math.random() * 10) : 0,
        adminType: Math.random() > 0.5 ? 'Normal' : 'Especial',
        rushOrder: Math.random() > 0.8,
        commercialResponsible: commercialResponsibles[Math.floor(Math.random() * commercialResponsibles.length)],
        lastRefreshDate: new Date(),
        specifications: {
          dimensions: {
            width: Math.floor(Math.random() * 1000) + 100,
            height: Math.floor(Math.random() * 1000) + 100,
            length: Math.floor(Math.random() * 1000) + 100,
            unit: 'mm'
          },
          weight: Math.floor(Math.random() * 100) + 10,
          weightUnit: 'kg',
          colors: ['Azul', 'Rojo', 'Verde', 'Amarillo'].slice(0, Math.floor(Math.random() * 3) + 1),
          finish: ['Mate', 'Brillante', 'Satinado'][Math.floor(Math.random() * 3)],
          packaging: ['Caja', 'Bolsa', 'Rollo'][Math.floor(Math.random() * 3)]
        },
        materials: [
          {
            materialTypeId: 'MAT-001',
            materialTypeName: 'BOPP Transparente',
            quantity: Math.floor(Math.random() * 1000) + 100,
            unit: 'kg' as any,
            cost: Math.floor(Math.random() * 10000) + 1000
          },
          {
            materialTypeId: 'MAT-002', 
            materialTypeName: 'Tinta Flexográfica',
            quantity: Math.floor(Math.random() * 50) + 10,
            unit: 'kg' as any,
            cost: Math.floor(Math.random() * 5000) + 500
          }
        ],
        notes: Math.random() > 0.7 ? 'Producto con especificaciones especiales' : undefined,
        createdAt: creationDate,
        updatedAt: new Date()
      });
    }

    return products;
  }

  public refreshProducts(): void {
    this.loadProducts();
  }
}
