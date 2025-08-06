import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Product, ProductStatus, ProductSpecifications, ProductMaterial } from '../models/laf-business.model';
import { ProductoDto, ProductoListDto } from '../models/laf-api.dto';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends ApiService {
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

  public stats = computed(() => {
    const products = this.productsSignal();
    return {
      total: products.length,
      open: products.filter(p => p.status === ProductStatus.OPEN).length,
      standby: products.filter(p => p.status === ProductStatus.STANDBY).length,
      closed: products.filter(p => p.status === ProductStatus.CLOSED).length,
      rushOrders: products.filter(p => p.rushOrder).length
    };
  });

  constructor() {
    super(inject(HttpClient));
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.getAllProductsFromApi().subscribe({
      next: (products) => {
        this.productsSignal.set(products);
        this.productsSubject.next(products);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorSignal.set('Error al cargar productos');
        this.loadingSignal.set(false);
      }
    });
  }

  private getAllProductsFromApi(): Observable<Product[]> {
    return this.get<ProductoListDto[]>('PSSProductos/getProductos').pipe(
      map(dtos => dtos.map(dto => this.mapProductListDtoToProduct(dto))),
      catchError(error => {
        console.error('API Error:', error);
        return of([]); // Devolver array vacío en caso de error
      })
    );
  }

  private mapProductListDtoToProduct(dto: ProductoListDto): Product {
    return {
      id: dto.Cod_Producto,
      code: dto.Cod_Producto,
      name: dto.Descripcion || 'Sin descripción',
      status: this.mapEstadoToProductStatus(dto.Estado),
      customerName: dto.Nombre_Cliente || 'Sin cliente',
      creationDate: new Date(dto.Fecha_Creacion),
      originalOrderDate: new Date(dto.Fecha_Creacion),
      desiredDate: new Date(dto.Fecha_Deseada_Cliente),
      standByDate: dto.FechaStandBy ? new Date(dto.FechaStandBy) : undefined,
      standByEndDate: dto.FechaFinStandBy ? new Date(dto.FechaFinStandBy) : undefined,
      days: this.calculateDaysDifference(new Date(dto.Fecha_Creacion), new Date(dto.Fecha_Deseada_Cliente)),
      standByDays: dto.FechaStandBy && dto.FechaFinStandBy 
        ? this.calculateDaysDifference(new Date(dto.FechaStandBy), new Date(dto.FechaFinStandBy))
        : 0,
      adminType: dto.Tipo_Adm || 'Normal',
      rushOrder: dto.RushOrder || false,
      commercialResponsible: this.getResponsableName(dto.ResponsableComercial),
      lastRefreshDate: new Date(dto.LastRefreshDate),
      specifications: this.getDefaultSpecifications(),
      materials: [],
      notes: dto.ObsProducto,
      createdAt: new Date(dto.Fecha_Creacion),
      updatedAt: new Date(dto.LastRefreshDate)
    };
  }

  private mapEstadoToProductStatus(estado: number): ProductStatus {
    switch (estado) {
      case 1: return ProductStatus.OPEN;
      case 2: return ProductStatus.STANDBY;
      case 3: return ProductStatus.CLOSED;
      case 4: return ProductStatus.CANCELLED;
      default: return ProductStatus.OPEN;
    }
  }

  private calculateDaysDifference(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getResponsableName(id: number): string {
    // TODO: Mapear con tabla de responsables reales
    const responsables: { [key: number]: string } = {
      1: 'Juan Pérez',
      2: 'María García',
      3: 'Carlos López',
      4: 'Ana Martínez'
    };
    return responsables[id] || 'Sin asignar';
  }

  private getDefaultSpecifications(): ProductSpecifications {
    return {
      dimensions: {
        width: 0,
        height: 0,
        length: 0,
        unit: 'mm'
      },
      weight: 0,
      weightUnit: 'kg',
      colors: [],
      finish: '',
      packaging: ''
    };
  }

  public getAllProducts(): Observable<Product[]> {
    return this.products$;
  }

  public getProductById(id: string): Observable<Product | undefined> {
    return this.get<ProductoDto>(`PSSProductos/getProducto?Cod_Producto=${id}`).pipe(
      map(dto => this.mapProductDtoToProduct(dto)),
      catchError(error => {
        console.error('Error getting product by ID:', error);
        return of(undefined);
      })
    );
  }

  private mapProductDtoToProduct(dto: ProductoDto): Product {
    return {
      id: dto.Cod_Producto,
      code: dto.Cod_Producto,
      name: dto.Descripcion || 'Sin descripción',
      status: this.mapEstadoToProductStatus(dto.Estado),
      customerName: dto.Nombre_Cliente || 'Sin cliente',
      creationDate: new Date(dto.Fecha_Creacion),
      originalOrderDate: new Date(dto.Fecha_Pedido_Original),
      desiredDate: new Date(dto.Fecha_Deseada_Cliente),
      standByDate: dto.FechaStandBy ? new Date(dto.FechaStandBy) : undefined,
      standByEndDate: dto.FechaFinStandBy ? new Date(dto.FechaFinStandBy) : undefined,
      days: this.calculateDaysDifference(new Date(dto.Fecha_Creacion), new Date(dto.Fecha_Deseada_Cliente)),
      standByDays: dto.FechaStandBy && dto.FechaFinStandBy 
        ? this.calculateDaysDifference(new Date(dto.FechaStandBy), new Date(dto.FechaFinStandBy))
        : 0,
      adminType: dto.Tipo_Adm || 'Normal',
      rushOrder: dto.RushOrder || false,
      commercialResponsible: this.getResponsableName(dto.ResponsableComercial),
      lastRefreshDate: new Date(dto.LastRefreshDate),
      specifications: this.getDefaultSpecifications(),
      materials: [],
      notes: dto.ObsProducto,
      createdAt: new Date(dto.Fecha_Creacion),
      updatedAt: new Date(dto.LastRefreshDate)
    };
  }

  public getProductsByStatus(status: ProductStatus): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.status === status))
    );
  }

  public getProductsByCustomer(customerName: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => 
        p.customerName.toLowerCase().includes(customerName.toLowerCase())
      ))
    );
  }

  public createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    // La API backend no tiene un endpoint POST para productos principales,
    // solo para trabajos de cilindros específicos
    // Implementamos funcionalidad local por ahora
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
    // Mapear el Product a ProductoDto para enviar a la API
    const currentProducts = this.productsSignal();
    const existingProduct = currentProducts.find(p => p.id === id);
    
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const updatedProduct = { ...existingProduct, ...updates, updatedAt: new Date() };
    const productoDto = this.mapProductToProductoDto(updatedProduct);

    return this.put<void>(`PSSProductos?id=${id}`, productoDto).pipe(
      map(() => {
        // Actualizar el estado local después de la actualización exitosa
        const currentProducts = this.productsSignal();
        const index = currentProducts.findIndex(p => p.id === id);
        
        if (index !== -1) {
          const updatedProducts = [...currentProducts];
          updatedProducts[index] = updatedProduct;
          
          this.productsSignal.set(updatedProducts);
          this.productsSubject.next(updatedProducts);
        }
        
        return updatedProduct;
      }),
      catchError(error => {
        console.error('Error updating product:', error);
        throw error;
      })
    );
  }

  private mapProductToProductoDto(product: Product): any {
    return {
      Cod_Producto: product.code,
      Descripcion: product.name,
      Nombre_Cliente: product.customerName,
      Fecha_Deseada_Cliente: product.desiredDate,
      RushOrder: product.rushOrder,
      ObsProducto: product.notes,
      Tipo_Adm: product.adminType,
      // Agregar más campos según sea necesario
    };
  }

  public deleteProduct(id: string): Observable<boolean> {
    // Nota: En el proyecto original no hay delete de productos, 
    // pero podríamos implementarlo si fuera necesario
    // Para mantener consistencia, mantenemos solo el delete local
    const currentProducts = this.productsSignal();
    const filteredProducts = currentProducts.filter(p => p.id !== id);
    
    this.productsSignal.set(filteredProducts);
    this.productsSubject.next(filteredProducts);
    
    return of(true).pipe(delay(500));
  }

  public searchProducts(query: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => 
        p.code.toLowerCase().includes(query.toLowerCase()) ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.customerName.toLowerCase().includes(query.toLowerCase()) ||
        p.commercialResponsible.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  public getProductsInDateRange(startDate: Date, endDate: Date): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => {
        const creationDate = new Date(p.creationDate);
        return creationDate >= startDate && creationDate <= endDate;
      }))
    );
  }

  public refreshProducts(): void {
    this.loadProducts();
  }
}
