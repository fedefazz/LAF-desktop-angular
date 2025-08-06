import { UserRole } from './user.model';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  roles: UserRole[];
  isActive?: boolean;
  badge?: {
    text: string;
    color: 'primary' | 'accent' | 'warn';
  };
}

export interface NavigationItem extends MenuItem {
  expanded?: boolean;
}
