import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { MatToolbar } from "@angular/material/toolbar";
import { MatAnchor } from "@angular/material/button";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";

@Component({
  imports: [MatToolbar, MatAnchor, MatCard, MatCardHeader, MatCardTitle, MatCardContent],
  selector: 'app-hr-dashboard',
  styleUrl: './hr-dashboard.scss',
  templateUrl: './hr-dashboard.html',
})
export class HrDashboard {

  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: User | null = this.authService.getCurrentUser();

  logout(): void {

    this.authService.logout();
    this.router.navigate(['/login']);

  }

}
