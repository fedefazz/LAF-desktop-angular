import { Routes } from '@angular/router';
import { ScrapListComponent } from './components/scrap-list.component';

export const SCRAP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ScrapListComponent,
    title: 'Lista de Scraps'
  },
  // Future routes for CRUD operations
  // {
  //   path: 'create',
  //   component: ScrapCreateComponent,
  //   title: 'Crear Scrap'
  // },
  // {
  //   path: 'edit/:id',
  //   component: ScrapEditComponent,
  //   title: 'Editar Scrap'
  // }
];
