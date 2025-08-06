import { Component, signal } from '@angular/core';
import { MainLayoutComponent } from './core/layout';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
  template: '<app-main-layout></app-main-layout>',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('laf-desktop-angular');
}
