import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/auth.models';

/** Usar con route data: { roles: ['ADMIN'] }. */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const rolesPermitidos: Rol[] = route.data['roles'] ?? [];
    if (rolesPermitidos.length === 0 || this.authService.tieneRol(...rolesPermitidos)) {
      return true;
    }
    return this.router.createUrlTree(['/no-autorizado']);
  }
}
