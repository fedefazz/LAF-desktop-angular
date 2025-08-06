import { Injectable, signal, effect, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { ThemeConfig, THEMES } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly renderer = this.rendererFactory.createRenderer(null, null);

  private readonly STORAGE_KEY = 'laf-desktop-theme';
  
  private readonly currentTheme = signal<ThemeConfig>(
    this.loadThemeFromStorage()
  );

  readonly theme = this.currentTheme.asReadonly();
  readonly isDark = signal(this.currentTheme().isDark);

  constructor() {
    // Apply theme when it changes
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  setTheme(themeName: string): void {
    const theme = THEMES[themeName];
    if (theme) {
      this.currentTheme.set(theme);
      this.isDark.set(theme.isDark);
      this.saveThemeToStorage(theme);
    }
  }

  toggleTheme(): void {
    const current = this.currentTheme();
    const newTheme = current.isDark ? THEMES['light'] : THEMES['dark'];
    this.setTheme(newTheme.name);
  }

  getAvailableThemes(): ThemeConfig[] {
    return Object.values(THEMES);
  }

  private applyTheme(theme: ThemeConfig): void {
    // Update the color-scheme CSS property
    this.renderer.setAttribute(
      this.document.body,
      'data-theme',
      theme.name
    );

    // Update color-scheme meta property
    this.document.body.style.colorScheme = theme.isDark ? 'dark' : 'light';

    // Update CSS custom properties
    this.document.documentElement.style.setProperty(
      '--primary-color',
      theme.primaryColor
    );
    this.document.documentElement.style.setProperty(
      '--accent-color',
      theme.accentColor
    );

    // Add/remove dark theme class
    if (theme.isDark) {
      this.renderer.addClass(this.document.body, 'dark-theme');
      this.renderer.removeClass(this.document.body, 'light-theme');
    } else {
      this.renderer.addClass(this.document.body, 'light-theme');
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }

  private loadThemeFromStorage(): ThemeConfig {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const themeName = JSON.parse(saved);
        return THEMES[themeName] || THEMES['light'];
      }
    } catch (error) {
      console.warn('Failed to load theme from storage:', error);
    }
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? THEMES['dark'] : THEMES['light'];
  }

  private saveThemeToStorage(theme: ThemeConfig): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(theme.name));
    } catch (error) {
      console.warn('Failed to save theme to storage:', error);
    }
  }
}
