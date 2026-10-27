import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user';
import { Notification } from '../../../shared/notification-service/notification';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import { UserRole } from '../../../core/interfaces/enum';

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

  private readonly notification = inject(Notification);

  users = signal<User[]>([]);


  // METODO PER CARICARE GLI UTENTI DAL SERVIZIO
  loadUsers(): void {

    this.userService
      .getUsers()
      .subscribe(users => {
        this.users.set(
          users.filter(user => !user.systemConfig && user.role === UserRole.EMPLOYEE)
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
    'employeeCode',
    'name',
    'email',
    'active'
  ]


  // METODO PER IMPORTARE GLI UTENTI ATTIVI DA UN FILE EXCEL

  // VERSIONE SENZA forkJoin
  importActiveUsers(event: Event): void {

    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {

      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        const workbook = XLSX.read(
          arrayBuffer,
          {
            type: 'array'
          }
        );

        const worksheet = workbook.Sheets[
          workbook.SheetNames[0]
        ];

        const rawData = XLSX.utils.sheet_to_json(
          worksheet
        );

        console.log(rawData);


        // CONVERSIONE 
        const importedUsers = rawData.map(
          (row: any) => ({

            employeeCode: row.EmployeeCode?.trim(),
            fullName: row.Name?.trim(),
            active: row.Active === true ||
              row.Active === 'true'

          })
        );

        console.log('IMPORTED USERS', importedUsers);


        // VALIDAZIONE
        const invalidRows = importedUsers.some(
          user =>
            !user.employeeCode ||
            !user.fullName
        );

        if (invalidRows) {
          this.notification.error('The excel file contains invalid data');
          return;
        }


        // MERGE
        const usersToUpdate =
          this.users()
            .map(existingUser => {
              const importedUser = importedUsers.find(
                user =>
                  user.employeeCode ===
                  existingUser.employeeCode &&
                  user.fullName ===
                  `${existingUser.name} ${existingUser.surname}`
              );

              if (!importedUser) {
                return null;
              }

              return {
                ...existingUser,
                active: importedUser.active
              };
            }).filter(Boolean) as User[];

        console.log('USERS TO UPDATE', usersToUpdate);


        //UPDATE
        usersToUpdate.forEach(user => {
          this.userService
            .updateUser(user.id, user)
            .subscribe({

              next: () => {
                console.log('Update:', user.employeeCode);
                console.log('Update:', `${user.name} ${user.surname}`),
                  console.log('Active:', user.active);
                this.notification.success(
                  `User ${user.name} ${user.surname} updated successfully`
                );

                this.loadUsers();

              },
              error: error => {
                console.error(error);
                this.notification.error(
                  'Error while importing expense limits'
                );
              }
            });
        });

      }

      catch (error) {
        console.log(error);
        this.notification.error('Unable to read the Excel file');
      }
    };

    reader.readAsArrayBuffer(file);

  }


}



// VS Code Counter: 147 code lines (27/10/2026)