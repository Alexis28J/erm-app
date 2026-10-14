import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatCardModule, MatIconModule, MatTableModule,
    MatSlideToggleModule, MatButtonModule, RouterLink,
    MatTooltipModule],
  selector: 'app-user-management',
  styleUrls: ['./user-management.scss'],
  templateUrl: './user-management.html',
})
export class UserManagement {

  constructor() { this.loadUsers() }

  private readonly userService = inject(UserService);

  users = signal<User[]>([]);


  // METODO PER CARICARE GLI UTENTI DAL SERVIZIO
  loadUsers(): void {

    this.userService
      .getUsers()
      .subscribe(users => {
        this.users.set(
          users.filter(user => !user.systemConfig)
        );
      });
  }


  // METODO PER ATTIVARE/DISATTIVARE GLI UTENTI
  toggleUsers(user: User): void {

    const updateUser: User = {
      ...user,
      active: !user.active
    };

    this.userService
      .updateUser(user.id, updateUser)
      .subscribe(savedUser => {

        this.users.update(users =>
          users.map(u =>
            u.id === savedUser.id
              ? savedUser
              : u
          )
        );
      });
  }


  // COLONNE DA VISUALIZZARE NELLA TABELLA DEGLI UTENTI
  displayedColumns = [
    'name',
    'email',
    'active'
  ]

}



// VS Code Counter: 54 code lines (14/10/2026)