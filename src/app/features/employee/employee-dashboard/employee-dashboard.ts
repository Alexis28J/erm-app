import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { MatToolbar } from "@angular/material/toolbar";
import { MatAnchor } from "@angular/material/button";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmAction } from '../../../shared/dialogs/confirm-action/confirm-action';
import { Notification } from '../../../shared/notification-service/notification';

@Component({
  imports: [MatToolbar, MatAnchor, MatCard, MatCardHeader, MatCardTitle, MatCardContent, RouterLink],
  selector: 'app-employee-dashboard',
  styleUrls: ['./employee-dashboard.scss'],
  templateUrl: './employee-dashboard.html',
})
export class EmployeeDashboard {

  // INIEZIONI DELLE DIPENDENZE
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private notificationService = inject(Notification);


  // UTENTE CORRENTE
  currentUser: User | null = this.authService.getCurrentUser();


  // LOGOUT DELL'UTENTE
  logout(): void {

    const dialogRef = this.dialog.open(ConfirmAction, {
      data: {
        title: 'Logout',
        message: 'Are you sure you want to log out?'
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result === true) {
        this.authService.logout();
        this.router.navigate(['/login']);
        this.notificationService.success('Successfully logged out');

      }
    });
  }

}

