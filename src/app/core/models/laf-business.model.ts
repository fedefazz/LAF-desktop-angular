// Modelos para el dominio de negocio LAF

export interface Machine {
  id: string;
  name: string;
  code: string;
  type: MachineType;
  status: MachineStatus;
  location: string;
  department: string;
  operator?: string;
  lastMaintenance: Date;
  nextMaintenance: Date;
  specifications: MachineSpecifications;
  createdAt: Date;
  updatedAt: Date;
}

export interface MachineType {
  id: string;
  name: string;
  category: 'PRODUCTION' | 'PACKAGING' | 'QUALITY' | 'MAINTENANCE';
  description: string;
}

export enum MachineStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance', 
  INACTIVE = 'inactive',
  ERROR = 'error'
}

export interface MachineSpecifications {
  model: string;
  manufacturer: string;
  year: number;
  capacity: string;
  powerConsumption: string;
  dimensions: {
    width: number;
    height: number;
    length: number;
    unit: 'mm' | 'cm' | 'm';
  };
}

export interface MaterialType {
  id: string;
  name: string;
  code: string;
  category: MaterialCategory;
  description: string;
  unit: MaterialUnit;
  density?: number;
  color?: string;
  thickness?: number;
  width?: number;
  costPerUnit: number;
  specifications: MaterialSpecifications;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum MaterialCategory {
  PLASTIC_FILM = 'plastic_film',
  PAPER = 'paper',
  CARDBOARD = 'cardboard',
  ADHESIVE = 'adhesive',
  INK = 'ink',
  SOLVENT = 'solvent',
  OTHER = 'other'
}

export enum MaterialUnit {
  KG = 'kg',
  M2 = 'm2',
  LINEAR_M = 'linear_m',
  UNITS = 'units',
  LITERS = 'liters'
}

export interface MaterialSpecifications {
  grade?: string;
  supplier: string;
  dimensions: string;
  weight: string;
  minimumStock: number;
  tolerance?: {
    thickness?: number;
    width?: number;
    length?: number;
  };
  properties: {
    tensileStrength?: number;
    elongation?: number;
    opacity?: number;
    glossLevel?: number;
  };
}

export interface ScrapItem {
  id: string;
  batchNumber: string;
  materialType: MaterialType;
  machine: Machine;
  quantity: number;
  unit: MaterialUnit;
  reason: ScrapReason;
  description: string;
  operator: string;
  supervisor?: string;
  location: string;
  status: ScrapStatus;
  images?: string[];
  qualityCheck?: QualityCheck;
  createdAt: Date;
  processedAt?: Date;
}

export enum ScrapReason {
  PRINTING_DEFECT = 'printing_defect',
  CUTTING_ERROR = 'cutting_error',
  MATERIAL_DEFECT = 'material_defect',
  MACHINE_MALFUNCTION = 'machine_malfunction',
  SETUP_WASTE = 'setup_waste',
  QUALITY_REJECTION = 'quality_rejection',
  EXPIRED_MATERIAL = 'expired_material',
  OTHER = 'other'
}

export enum ScrapStatus {
  PENDING = 'pending',
  CLASSIFIED = 'classified',
  PROCESSED = 'processed',
  RECYCLED = 'recycled',
  DISPOSED = 'disposed'
}

export interface QualityCheck {
  inspector: string;
  checkDate: Date;
  defects: string[];
  recommendation: 'RECYCLE' | 'DISPOSE' | 'REWORK';
  notes?: string;
}

export interface ProductionLine {
  id: string;
  name: string;
  machines: Machine[];
  materialTypes: MaterialType[];
  supervisor: string;
  shift: Shift;
  status: 'RUNNING' | 'STOPPED' | 'MAINTENANCE';
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  supervisor: string;
}

// Productos/Órdenes de Producción
export interface Product {
  id: string;
  code: string;
  name: string;
  status: ProductStatus;
  customerName: string;
  creationDate: Date;
  originalOrderDate: Date;
  desiredDate: Date;
  initialDate?: Date;
  finalDate?: Date;
  standByDate?: Date;
  standByEndDate?: Date;
  days: number;
  standByDays: number;
  adminType: string;
  rushOrder: boolean;
  commercialResponsible: string;
  lastRefreshDate: Date;
  specifications: ProductSpecifications;
  materials: ProductMaterial[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProductStatus {
  OPEN = 'Abierto',
  STANDBY = 'Stand By',
  CLOSED = 'Cerrado',
  CANCELLED = 'Cancelado'
}

export interface ProductSpecifications {
  dimensions: {
    width: number;
    height: number;
    length: number;
    unit: 'mm' | 'cm' | 'm';
  };
  weight: number;
  weightUnit: 'g' | 'kg' | 'ton';
  colors: string[];
  finish: string;
  packaging: string;
}

export interface ProductMaterial {
  materialTypeId: string;
  materialTypeName: string;
  quantity: number;
  unit: MaterialUnit;
  cost: number;
}

// Operadores
export interface Operator {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'ROTATING';
  skills: OperatorSkill[];
  certifications: string[];
  hireDate: Date;
  status: OperatorStatus;
  salary?: number;
  daySalary?: number;
  currentMachineId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OperatorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated'
}

export interface OperatorSkill {
  machineTypeId: string;
  machineTypeName: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  certifiedDate: Date;
}

// Actividades
export interface Activity {
  id: string;
  name: string;
  description: string;
  type: ActivityType;
  machineId?: string;
  machineName?: string;
  operatorId: string;
  operatorName: string;
  productId?: string;
  productName?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // en minutos
  status: ActivityStatus;
  priority: ActivityPriority;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ActivityType {
  PRODUCTION = 'production',
  MAINTENANCE = 'maintenance',
  SETUP = 'setup',
  CLEANING = 'cleaning',
  QUALITY_CHECK = 'quality_check',
  BREAK = 'break'
}

export enum ActivityStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused'
}

export enum ActivityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// JobTrack - Seguimiento de trabajos
export interface JobTrack {
  id: string;
  jobNumber: string;
  productId: string;
  productName: string;
  machineId: string;
  machineName: string;
  operatorId: string;
  operatorName: string;
  startDate: Date;
  estimatedEndDate: Date;
  actualEndDate?: Date;
  progress: number; // 0-100
  status: JobStatus;
  modules: JobModule[];
  totalCost: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum JobStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface JobModule {
  id: string;
  name: string;
  description: string;
  responsible: string;
  startDate?: Date;
  endDate?: Date;
  progress: number;
  status: JobStatus;
  estimatedHours: number;
  actualHours?: number;
}

// Conceptos y SubConceptos
export interface Concept {
  id: string;
  name: string;
  code: string;
  description: string;
  category: ConceptCategory;
  isActive: boolean;
  subConcepts: SubConcept[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubConcept {
  id: string;
  conceptId: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ConceptCategory {
  INCOME = 'income',
  EXPENSE = 'expense',
  MATERIAL = 'material',
  LABOR = 'labor',
  OVERHEAD = 'overhead'
}

// Cash Register
export interface CashRegisterEntry {
  id: string;
  type: 'credit' | 'debit';
  conceptId: string;
  conceptName: string;
  subConceptId?: string;
  subConceptName?: string;
  paymentMethod: PaymentMethod;
  description: string;
  amount: number;
  creationDate: Date;
  operatorId: string;
  operatorName: string;
  notes?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'creditCard',
  DEBIT_CARD = 'debitCard',
  BANK_TRANSFER = 'bankTransfer',
  CHECK = 'check'
}

// PSS Models (Production Support System)
export interface PSSMachine {
  id: string;
  description: string;
  resource: string;
  areaId: string;
  area?: PSSArea;
  enabled: boolean;
  scrapOrigins?: PSSScrapOrigin[];
  operators?: Operator[];
  materialTypes?: PSSMaterialType[];
  activities?: PSSActivity[];
  jobTracks?: PSSJobTrack[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PSSArea {
  id: string;
  description: string;
  enabled: boolean;
  machines?: PSSMachine[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PSSScrapOrigin {
  id: string;
  description: string;
  code: string;
  enabled: boolean;
  machines?: PSSMachine[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PSSMaterialType {
  id: string;
  description: string;
  code: string;
  enabled: boolean;
  machines?: PSSMachine[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PSSActivity {
  id: string;
  description: string;
  code: string;
  enabled: boolean;
  machines?: PSSMachine[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PSSJobTrack {
  id: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: string;
  machine?: PSSMachine;
  machineId: string;
  operator?: Operator;
  operatorId: string;
  product?: Product;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}
