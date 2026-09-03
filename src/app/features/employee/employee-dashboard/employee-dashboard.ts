import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { MatToolbar } from "@angular/material/toolbar";
import { MatAnchor } from "@angular/material/button";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";

@Component({
  imports: [MatToolbar, MatAnchor, MatCard, MatCardHeader, MatCardTitle, MatCardContent],
  selector: 'app-employee-dashboard',
  styleUrls: ['./employee-dashboard.scss'],
  templateUrl: './employee-dashboard.html',
})
export class EmployeeDashboard {

  // INIEZIONI DELLE DIPENDENZE
  private authService = inject(AuthService);
  private router = inject(Router);


  // UTENTE CORRENTE
  currentUser: User | null = this.authService.getCurrentUser();


  // LOGOUT DELL'UTENTE
  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}

