import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiErrorResponse } from '../../core/models/api-error.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  cargando = false;
  errorGeneral: string | null = null;
  mostrarPassword = false;
  anioActual = new Date().getFullYear();
  private returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      mantenerSesion: [true]
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorGeneral = null;
    this.cargando = true;
    const { username, password, mantenerSesion } = this.form.value;

    this.authService.login({ username, password }, mantenerSesion).subscribe({
      next: res => {
        this.cargando = false;
        if (res.usuario.debeCambiarPassword) {
          this.router.navigate(['/cambiar-password'], { queryParams: { obligatorio: true } });
        } else {
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;
        this.errorGeneral = this.extraerMensaje(err);
      }
    });
  }

  private extraerMensaje(err: HttpErrorResponse): string {
    const body = err.error as ApiErrorResponse | undefined;
    if (body?.message) {
      return body.message;
    }
    if (err.status === 401) {
      return 'Usuario o contraseña incorrectos.';
    }
    return 'No se pudo iniciar sesión. Intenta de nuevo.';
  }
}
