import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { MatAnchor } from "@angular/material/button";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardSubtitle } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  imports: [MatAnchor, MatCard, MatCardHeader,
    MatCardTitle, MatCardContent, RouterLink,
    MatIconModule, MatCardSubtitle],
  selector: 'app-employee-dashboard',
  styleUrls: ['./employee-dashboard.scss'],
  templateUrl: './employee-dashboard.html',
})
export class EmployeeDashboard {

  // INIEZIONI DELLE DIPENDENZE
  private authService = inject(AuthService);


  // UTENTE CORRENTE
  currentUser: User | null = this.authService.getCurrentUser();

}



// VS Code counter: 19 code lines (19/10/2026)
