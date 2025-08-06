import { Injectable, signal, computed } from '@angular/core';
import { MaterialType, MaterialCategory, MaterialUnit } from '../models/laf-business.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialTypeService {
  // Mock data para demostración
  private materialTypes = signal<MaterialType[]>([
    {
      id: '1',
      name: 'Film BOPP Transparente',
      code: 'BOPP-001',
      category: MaterialCategory.PLASTIC_FILM,
      description: 'Film de polipropileno biorientado transparente para laminación',
      unit: MaterialUnit.KG,
      density: 0.91,
      thickness: 20,
      width: 1000,
      costPerUnit: 145.50,
      specifications: {
        grade: 'Transparente Premium',
        supplier: 'PlásticoTech SA',
        dimensions: '1000mm x 20μm',
        weight: '18.2 kg/rollo',
        minimumStock: 500,
        tolerance: {
          thickness: 2,
          width: 5
        },
        properties: {
          tensileStrength: 120,
          elongation: 150,
          opacity: 2,
          glossLevel: 85
        }
      },
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2025-01-20')
    },
    {
      id: '2',
      name: 'Film BOPP Metalizado',
      code: 'BOPP-002',
      category: MaterialCategory.PLASTIC_FILM,
      description: 'Film de polipropileno biorientado metalizado para empaque premium',
      unit: MaterialUnit.KG,
      density: 0.92,
      thickness: 25,
      width: 800,
      costPerUnit: 198.75,
      specifications: {
        grade: 'Metalizado Plata',
        supplier: 'MetalFilm Corp',
        dimensions: '800mm x 25μm',
        weight: '20.5 kg/rollo',
        minimumStock: 300,
        tolerance: {
          thickness: 2,
          width: 5
        },
        properties: {
          tensileStrength: 115,
          elongation: 140,
          opacity: 95,
          glossLevel: 90
        }
      },
      isActive: true,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2025-01-18')
    },
    {
      id: '3',
      name: 'Papel Kraft',
      code: 'KRAFT-001',
      category: MaterialCategory.PAPER,
      description: 'Papel kraft natural para bolsas y empaque ecológico',
      unit: MaterialUnit.KG,
      color: 'Natural',
      costPerUnit: 85.30,
      specifications: {
        grade: 'Kraft 70g',
        supplier: 'Papelera Nacional',
        dimensions: '70cm x 100cm',
        weight: '70 g/m²',
        minimumStock: 1000,
        properties: {
          tensileStrength: 95
        }
      },
      isActive: true,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2025-01-10')
    }
  ]);

  // Computed properties
  readonly allMaterialTypes = this.materialTypes.asReadonly();
  
  readonly activeMaterialTypes = computed(() => 
    this.materialTypes().filter(material => material.isActive)
  );
  
  readonly materialTypesByCategory = computed(() => {
    const categories: Record<string, MaterialType[]> = {};
    this.materialTypes().forEach(material => {
      const category = material.category;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(material);
    });
    return categories;
  });

  // Search functionality
  searchMaterialTypes(query: string): MaterialType[] {
    const searchTerm = query.toLowerCase();
    return this.materialTypes().filter(type => 
      type.name.toLowerCase().includes(searchTerm) ||
      type.code.toLowerCase().includes(searchTerm) ||
      type.description.toLowerCase().includes(searchTerm) ||
      type.specifications.supplier.toLowerCase().includes(searchTerm)
    );
  }
}
