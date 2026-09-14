import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { MatToolbar } from "@angular/material/toolbar";
import { MatAnchor } from "@angular/material/button";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { RouterLink } from '@angular/router';

@Component({
  imports: [MatToolbar, MatAnchor, MatCard, MatCardHeader, MatCardTitle, MatCardContent, RouterLink],
  selector: 'app-hr-dashboard',
  styleUrls: ['./hr-dashboard.scss'],
  templateUrl: './hr-dashboard.html',
})
export class HrDashboard {


  // INIEZIONI DI DIPENDENZE
  private authService = inject(AuthService);  
  private router = inject(Router);


  // VARIABILE CHE CONTIENE L'UTENTE CORRENTE (OTTENUTO DAL SERVIZIO DI AUTENTICAZIONE) 
  currentUser: User | null = this.authService.getCurrentUser();  


  // METODO PER EFFETTUARE IL LOGOUT DELL'UTENTE CORRENTE
  logout(): void {   

    this.authService.logout();  
    this.router.navigate(['/login']);  

  }

}


