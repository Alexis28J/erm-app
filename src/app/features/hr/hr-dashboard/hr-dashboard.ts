import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { MatToolbar } from "@angular/material/toolbar";
import { MatAnchor } from "@angular/material/button";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { RouterLink } from '@angular/router';
import { Notification } from '../../../shared/notification-service/notification';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmAction } from '../../../shared/dialogs/confirm-action/confirm-action';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatToolbar, MatAnchor, MatCard, MatCardHeader, MatCardTitle, MatCardContent, RouterLink, MatTooltipModule, MatIconModule],
  selector: 'app-hr-dashboard',
  styleUrls: ['./hr-dashboard.scss'],
  templateUrl: './hr-dashboard.html',
})
export class HrDashboard {


  // INIEZIONI DI DIPENDENZE
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(Notification);
  private dialog = inject(MatDialog)


  // VARIABILE CHE CONTIENE L'UTENTE CORRENTE (OTTENUTO DAL SERVIZIO DI AUTENTICAZIONE) 
  currentUser: User | null = this.authService.getCurrentUser();


  // METODO PER EFFETTUARE IL LOGOUT DELL'UTENTE CORRENTE
  logout(): void {

    const dialogRef = this.dialog.open(ConfirmAction, {
      autoFocus: false,
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


