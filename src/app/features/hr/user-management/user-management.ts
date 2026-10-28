import { ChangeDetectorRef, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user';
import { Notification } from '../../../shared/notification-service/notification';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import { UserRole } from '../../../core/interfaces/enum';
import { forkJoin } from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatLabel } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  imports: [MatCardModule, MatIconModule, MatTableModule,
    MatSlideToggleModule, MatButtonModule, RouterLink,
    MatTooltipModule, MatSortModule, MatPaginatorModule,
    MatFormFieldModule, MatLabel, ReactiveFormsModule,
    MatInputModule, CommonModule],
  selector: 'app-user-management',
  styleUrls: ['./user-management.scss'],
  templateUrl: './user-management.html',
})
export class UserManagement {

  constructor() {

    this.loadUsers()

    // Sottoscrizione ai cambiamenti del controllo di ricerca per aggiornare il filtro degli utenti in tempo reale
    this.searchControl.valueChanges.subscribe(value => {
      this.search.set(value ?? '');
    })


    // EFFECT PER AGGIORNARE LA TABELLA QUANDO CAMBIANO I DATI O IL FILTRO DI RICERCA
    effect(() => {

      // Aggiorna i dati della tabella in base al filtro di ricerca corrente
      this.dataSource.data = this.filteredEmployees();

      // Se non ci sono risultati filtrati, esci dall'effetto
      if (!this.filteredEmployees() || this.filteredEmployees().length === 0) {
        return;
      }

      // Forza l'aggiornamento della vista per riflettere i cambiamenti nei dati della tabella
      this.cdr.detectChanges();

      // Se il sortingDataAccessor non è ancora stato impostato, impostalo ora
      if (!this.dataSource.sortingDataAccessor) {

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case "employeeCode": return item.employeeCode;
            case "name": return item.name;
            case "email": return item.email;
            default: return item[property as keyof User] as any;
          }
        };

      }

      // Imposta il sorting della tabella se non è già stato impostato
      if (this.sortComponent && !this.dataSource.sort) {
        this.dataSource.sort = this.sortComponent;
      }

      // Imposta il paginatore della tabella se non è già stato impostato
      if (this.paginatorComponent && !this.dataSource.paginator) {
        this.dataSource.paginator = this.paginatorComponent;
      }

      // Applica il sorting iniziale della tabella se il sorting è già stato impostato
      if (this.dataSource.sort) {
        this.dataSource.sort.sort({ id: "employeeCode", start: "asc", disableClear: false })
      }

    });

  }

  // REFERENZE AI COMPONENTI DELLA TABELLA (SORT E PAGINATOR)
  @ViewChild(MatSort) sortComponent!: MatSort;
  @ViewChild(MatPaginator) paginatorComponent!: MatPaginator;


  // DATA SOURCE DELLA TABELLA
  dataSource = new MatTableDataSource<User>();


  // INIEZIONE DEI SERVIZI NECESSARI
  private readonly userService = inject(UserService);
  private readonly notification = inject(Notification);
  private cdr = inject(ChangeDetectorRef);


  // SEGNALE CHE CONTIENE LA LISTA DEGLI UTENTI FILTRATI
  users = signal<User[]>([]);


  // SEGNALE CHE CONTIENE LA LISTA COMPLETA DEGLI UTENTI OTTENUTI DAL SERVIZIO
  usersResource = toSignal(
    this.userService.getUsers(),
    {
      initialValue: []
    }
  );


  // CONTROLLO DI RICERCA
  searchControl = new FormControl('');


  // SEGNALE DI RICERCA
  search = signal('');


  // COMPUTED CHE RESTITUISCE LA LISTA DEGLI UTENTI FILTRATI IN BASE ALLA RICERCA
  filteredEmployees = computed(() => {
    const term = this.search().toLowerCase();

    return this.users().filter(u =>
      u.name.toLowerCase().includes(term)
      || u.surname.toLowerCase().includes(term)
      || u.email.toLowerCase().includes(term)
    );
  });


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


  /// METODO PER IMPORTARE GLI UTENTI ATTIVI DA UN FILE EXCEL ///
  // (VERSIONE CON forkJoin PER AGGIORNARE TUTTI GLI UTENTI INSIEME)
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


        // CONVERSIONE: Trasforma i dati grezzi del foglio Excel in oggetti utente con proprietà specifiche
        const importedUsers = rawData.map(
          (row: any) => ({

            employeeCode: row.EmployeeCode.trim(),
            fullName: row.Name.trim(),
            active: row.Active === true || row.Active === 'true'
          })
        );


        // VALIDAZIONE: Controlla che tutti gli utenti importati abbiano codice dipendente e nome completo validi
        const hasInvalidRows = importedUsers.some(
          user =>
            !user.employeeCode ||
            !user.fullName
        )

        if (hasInvalidRows) {
          this.notification.error('The Excel file contains invalid data');
          return;
        }


        // VALIDAZIONE: Controlla che tutti gli utenti importati esistano già nel sistema
        const unknownEmployees = importedUsers.filter(
          imported => !this.users().some(
            existing => existing.employeeCode === imported.employeeCode &&
              `${existing.name} ${existing.surname}` === imported.fullName
          )
        );

        if (unknownEmployees.length > 0) {
          this.notification.error('The Excel file contains unknown employees.');
          return;
        }


        // MERGE: Aggiorna lo stato degli utenti esistenti con i dati importati
        const usersToUpdate = this.users()
          .map(existingUser => {

            const importedUser = importedUsers.find(
              user => user.employeeCode === existingUser.employeeCode &&
                user.fullName === `${existingUser.name} ${existingUser.surname}`
            );

            if (!importedUser) {
              return null;
            }

            return {
              ...existingUser,
              active: importedUser.active
            };


          })
          .filter(Boolean) as User[];


        // CHIAMATE HTTP: Invia richieste di aggiornamento per gli utenti modificati
        // PREPARAZIONE (updatedRequests): Crea un array di richieste HTTP per aggiornare gli utenti modificati
        // updatedRequests conterrà le chiamate HTTP per aggiornare ciascun utente modificato
        const updatedRequests = usersToUpdate.map(
          user =>
            this.userService.updateUser(
              user.id,
              user
            )
        );

        if (updatedRequests.length === 0) {
          this.notification.error(
            'Not matching users found.'
          );
          return;
        }


        // ESECUZIONE: Invia tutte le richieste di aggiornamento in parallelo e gestisce il risultato
        // forkJoin: Combina tutte le richieste HTTP in un'unica osservabile che emette quando tutte le richieste sono completate
        forkJoin(updatedRequests)
          .subscribe({
            next: () => {
              this.notification.success(
                'Users imported succesfully.'
              );

              this.loadUsers();
            },

            error: () => {
              this.notification.error(
                'Error importing users.'
              );
            }
          });

      }

      catch (error) {
        console.error(error);
        this.notification.error(
          'Unable to read the Excel file'
        );
      }


    };

    reader.readAsArrayBuffer(file);

  }


}



// VS Code Counter: 221 code lines (28/10/2026)