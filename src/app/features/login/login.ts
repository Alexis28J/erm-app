import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/interfaces/enum';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";

@Component({
  imports: [ReactiveFormsModule, CommonModule, MatCardModule,
    MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, RouterLink],
  selector: 'app-login',
  styleUrls: ['./login.scss'],
  templateUrl: './login.html',
})
export class Login {

  // INIEZIONE DELLE DIPENDENZE
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);  //ser

  errorMessage = '';


  // DEFINIZIONE DEL FORM DI LOGIN
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });


  // METODO PER GESTIRE L'INVIO DEL FORM DI LOGIN
  onSubmit(): void {

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(
      email!,
      password!
    )
      .subscribe(user => {

        if (!user) {
          this.errorMessage =
            "Invalid email or password";

          return;
        }

        this.errorMessage = '';  
        
        if (user.role === UserRole.HR) {
          this.router.navigate(
            ['/hr/dashboard']
          );

        } else {
          this.router.navigate(
            ['/employee/dashboard']
          );
        }

      });

  }

}


