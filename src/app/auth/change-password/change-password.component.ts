import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiErrorResponse } from '../../core/models/api-error.model';

function passwordsIguales(control: AbstractControl): ValidationErrors | null {
  const nueva = control.get('newPassword')?.value;
  const confirmacion = control.get('confirmPassword')?.value;
  return nueva && confirmacion && nueva !== confirmacion ? { noCoincide: true } : null;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;
  cargando = false;
  errorGeneral: string | null = null;
  exito = false;
  esObligatorio = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordsIguales });
  }

  ngOnInit(): void {
    this.esObligatorio = this.route.snapshot.queryParams['obligatorio'] === 'true';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorGeneral = null;
    this.cargando = true;
    const { currentPassword, newPassword } = this.form.value;

    this.authService.cambiarPassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = true;
        setTimeout(() => this.router.navigateByUrl('/'), 1200);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;
        const body = err.error as ApiErrorResponse | undefined;
        this.errorGeneral = body?.message ?? 'No se pudo cambiar la contraseña.';
      }
    });
  }
}
