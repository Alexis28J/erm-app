import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Notification } from '../../../notification-service/notification';
import { User } from '../../../../core/interfaces/user';
import { ConfirmAction } from '../../../dialogs/confirm-action/confirm-action';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatTooltipModule, 
    MatIconModule, MatCardModule, MatMenuModule, RouterLink],
  selector: 'app-employee-navbar',
  styleUrls: ['./employee-navbar.scss'],
  templateUrl: './employee-navbar.html',
})
export class EmployeeNavbar {

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



// COMMENTI:
// QUESTO COMPONENTE DEFINISCE LA NAVBAR PER LE PAGINE DELL'EMPLOYEE, 
// INCLUDENDO LE FUNZIONALITÀ DI LOGOUT E NOTIFICHE.