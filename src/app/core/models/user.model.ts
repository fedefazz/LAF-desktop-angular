export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin', 
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee',
  INGENIERIA = 'Ingenieria',
  PRODUCTO = 'Producto',
  PRE_PRENSA = 'Pre Prensa',
  ADMIN_PRODUCTO = 'Admin Producto',
  HERRAMENTAL = 'Herramental'
}

export interface UserProfile extends User {
  fullName: string;
}
