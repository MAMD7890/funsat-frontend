import { Injectable } from '@angular/core';

const THEME_KEY = 'inv_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private oscuro = false;

  constructor() {
    const guardado = localStorage.getItem(THEME_KEY);
    this.oscuro = guardado
      ? guardado === 'dark'
      : window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    this.aplicar();
  }

  esOscuro(): boolean {
    return this.oscuro;
  }

  alternar(): void {
    this.oscuro = !this.oscuro;
    localStorage.setItem(THEME_KEY, this.oscuro ? 'dark' : 'light');
    this.aplicar();
  }

  private aplicar(): void {
    document.documentElement.setAttribute('data-theme', this.oscuro ? 'dark' : 'light');
  }
}
