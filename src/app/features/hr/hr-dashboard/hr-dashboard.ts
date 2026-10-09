import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/interfaces/user';
import { MatAnchor } from "@angular/material/button";
import { MatCardModule, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatAnchor, MatCardModule,
    MatCardHeader, MatCardTitle, MatCardContent,
    RouterLink, MatTooltipModule, MatIconModule],
  selector: 'app-hr-dashboard',
  styleUrls: ['./hr-dashboard.scss'],
  templateUrl: './hr-dashboard.html',
})
export class HrDashboard {

  // INIEZIONI DI DIPENDENZE
  private authService = inject(AuthService);


  // VARIABILE CHE CONTIENE L'UTENTE CORRENTE (OTTENUTO DAL SERVIZIO DI AUTENTICAZIONE) 
  currentUser: User | null = this.authService.getCurrentUser();

}



// VS Code Counter: 20 code lines (08/10/2026)
