import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * Se inyecta aca (y no solo en el navbar) para que el tema claro/oscuro
   * se aplique sobre <html> desde el arranque de la app, incluso en
   * paginas sin navbar como /login, que antes siempre se veian claras.
   */
  constructor(private themeService: ThemeService) {
  }
}
