import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { Notification } from '../../../../shared/notification-service/notification';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatCard, MatCardHeader, MatCardTitle,
    MatIconModule, MatCardContent, CommonModule,
    ReactiveFormsModule, MatFormField, MatLabel,
    MatInputModule, MatAnchor, RouterLink,
    MatTooltipModule, MatButtonModule],
  selector: 'app-reset-password',
  styleUrls: ['./reset-password.scss'],
  templateUrl: './reset-password.html',
})
export class ResetPassword {

  // INIEZIONE DELLE DIPENDENZE
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly notification = inject(Notification);


  // STATI REATTIVI
  readonly loading = signal(false);
  readonly errorMessage = signal('');


  // FORM REATTIVO PER IL RESET DELLA PASSWORD
  readonly form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],
    confirmPassword: [
      '',
      [
        Validators.required,
      ]
    ]
  });


  // METODO PER IL RESET DELLA PASSWORD
  onSubmit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      email,
      password,
      confirmPassword
    } = this.form.getRawValue();


    if (password !== confirmPassword) {
      this.errorMessage.set('Passwords do not match!');
      return;
    }

    this.loading.set(true);

    this.errorMessage.set('');

    this.userService
      .getUserByEmail(email)
      .subscribe({

        next: user => {

          if (!user) {
            this.loading.set(false);

            this.errorMessage.set(
              'User not found'
            );

            return;

          }

          this.userService
            .updateUser(
              user.id,
              {
                ...user,
                password
              }
            )
            .subscribe({

              next: () => {
                this.loading.set(false);
                this.notification.success('Password updated sucessfully');
                this.router.navigate(['/login']);
              },

              error: () => {

                this.loading.set(false);

                this.errorMessage.set(
                  'Unexpected error'
                );
              }

            });
        }
      })

  }


  // METODO PER MOSTRARE/NASCONDERE LA PASSWORD
  hidePassword = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }


}
