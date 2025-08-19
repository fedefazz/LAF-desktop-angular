import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrapListComponent } from '../../modules/scrap/components/scrap-list.component';

@Component({
  selector: 'app-scrap-manager',
  standalone: true,
  imports: [
    CommonModule,
    ScrapListComponent
  ],
  template: `<app-scrap-list></app-scrap-list>`,
  styles: []
})
export class ScrapManagerComponent {}
