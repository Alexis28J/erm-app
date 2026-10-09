import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAnchor } from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import { Notification } from '../../../notification-service/notification';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmAction } from '../../../dialogs/confirm-action/confirm-action';
import { User } from '../../../../core/interfaces/user';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatToolbarModule, MatAnchor, MatButtonModule,
    RouterLink, MatCardModule, MatIconModule,
    MatMenuModule, MatTooltipModule],
  selector: 'app-hr-navbar',
  styleUrls: ['./hr-navbar.scss'],
  templateUrl: './hr-navbar.html',
})
export class HrNavbar {

  // INIEZIONI DI DIPENDENZE
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(Notification);
  private dialog = inject(MatDialog);


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


/////////////////////////////////////////////////////////////////////

// COMMENTI:
// QUESTO COMPONENTE DEFINISCE LA NAVBAR PER LE PAGINE DELL'HR, 
// INCLUDENDO LE FUNZIONALITÀ DI LOGOUT E NOTIFICHE.

/////////////////////////////////////////////////////////////////////


// VS Code Counter: 46 code lines (08/10/2026)