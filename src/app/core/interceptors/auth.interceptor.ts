import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

const RUTAS_PUBLICAS = ['/auth/login', '/auth/refresh'];

/**
 * Agrega el access token a cada request. Si el backend responde 401 (token
 * vencido) intenta un refresh una sola vez y reintenta la request original;
 * si el refresh también falla, cierra sesión y manda a /login. Varias
 * requests que fallan al mismo tiempo comparten el mismo refresh en curso
 * (no dispara un /auth/refresh por cada una).
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private refrescando = false;
  private refreshListo$ = new BehaviorSubject<string | null>(null);

  constructor(
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const esPublica = RUTAS_PUBLICAS.some(ruta => req.url.includes(ruta));
    const conToken = esPublica ? req : this.agregarToken(req);

    return next.handle(conToken).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !esPublica) {
          return this.manejar401(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private agregarToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.tokenStorage.obtenerAccessToken();
    return token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  }

  private manejar401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.tokenStorage.obtenerRefreshToken()) {
      this.cerrarSesionYRedirigir();
      return throwError(() => new Error('Sesión expirada'));
    }

    if (this.refrescando) {
      return this.refreshListo$.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => next.handle(this.agregarToken(req)))
      );
    }

    this.refrescando = true;
    this.refreshListo$.next(null);

    return this.authService.refresh().pipe(
      switchMap(res => {
        this.refrescando = false;
        this.refreshListo$.next(res.accessToken);
        return next.handle(this.agregarToken(req));
      }),
      catchError(err => {
        this.refrescando = false;
        this.cerrarSesionYRedirigir();
        return throwError(() => err);
      })
    );
  }

  private cerrarSesionYRedirigir(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }
}
