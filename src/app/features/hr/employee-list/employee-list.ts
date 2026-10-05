import { ChangeDetectorRef, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { FormControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatColumnDef, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { User } from '../../../core/interfaces/user';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  imports: [MatCardModule, MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, MatTableModule, MatColumnDef,
    CommonModule, MatButtonModule, RouterLink,
    MatIconModule, MatSortModule, MatPaginatorModule],
  selector: 'app-employee-list',
  styleUrls: ['./employee-list.scss'],
  templateUrl: './employee-list.html',
})
export class EmployeeList {

  constructor() {

    effect(() => {

      this.dataSource.data = this.filteredEmployees();

      if (!this.filteredEmployees() || this.filteredEmployees().length === 0) return;

      this.cdr.detectChanges();

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

      if (this.sortComponent && !this.dataSource.sort) {
        this.dataSource.sort = this.sortComponent;
      }

      if (this.paginatorComponent && !this.dataSource.paginator) {
        this.dataSource.paginator = this.paginatorComponent;
      }

      if (this.dataSource.sort) {
        this.dataSource.sort.sort({ id: "employeeCode", start: "asc", disableClear: false });
      }
    })

    // Sottoscrizione ai cambiamenti del controllo di ricerca
    this.searchControl.valueChanges.subscribe(value => {
      this.search.set(value ?? '');
    });
  }


  // // ORDINA LA TABELLA IN BASE ALLA COLONNA SPECIFICATA
  // @ViewChild(MatSort)
  // set sort(sort: MatSort) {

  //   if (!sort) {
  //     return;
  //   }

  //   this.dataSource.sort = sort;

  //   this.dataSource.sortingDataAccessor = (item, property) => {

  //     switch (property) {
  //       case "code": return item.employeeCode;
  //       case "name": return item.name;
  //       case "email": return item.email;
  //       case "active": return item.active;
  //       default: return item[property as keyof User] as any;
  //     };

  //   };

  //   // Ordinamento iniziale
  //   this.dataSource.sort.active = 'name';
  //   this.dataSource.sort.direction = 'asc';
  //   this.dataSource.sort.sortChange.emit({
  //     active: 'name',
  //     direction: 'asc'
  //   });

  // }


  // // PAGINATORE DELLA TABELLA
  // @ViewChild(MatPaginator)
  // set paginator(paginator: MatPaginator) {  // Imposta il paginatore della tabella
  //   if (!paginator) {  // Se il paginatore non è disponibile, esci dal metodo
  //     return;
  //   }
  //   this.dataSource.paginator = paginator;  
  // }

  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatSort) sortComponent!: MatSort;
  @ViewChild(MatPaginator) paginatorComponent!: MatPaginator;


  // DATASOURCE PER LA TABELLA
  dataSource = new MatTableDataSource<User>();


  // INIEZIONE DEL SERVIZIO USER  
  private userService = inject(UserService);
  private router = inject(Router);


  // CONTROLLO DI RICERCA
  searchControl = new FormControl('');


  // SEGNALE CHE CONTIENE LA LISTA DEGLI IMPIEGATI 
  employees = toSignal(
    this.userService.getEmployees(),
    {
      initialValue: []
    }
  );


  // SEGNALE DI RICERCA
  search = signal('');


  // COMPUTED CHE RESTITUISCE LA LISTA FILTRATA DEGLI IMPIEGATI
  filteredEmployees = computed(() => {

    const term = this.search().toLowerCase();

    return this.employees().filter(employee =>
      employee.name.toLowerCase().includes(term)
      || employee.surname.toLowerCase().includes(term)
      || employee.email.toLowerCase().includes(term)
    );

  });


  // COLONNE VISUALIZZATE NELLA TABLE
  displayedColumns = [
    'employeeCode',
    'name',
    'email',
    'active',
    'actions'
  ];


  // METODO PER DIRIGERSI ALLA PAGINA "DETTAGLI DEL DIPENDENTE"
  viewDetails(employeeId: string): void {
    this.router.navigate(['/hr/employee-details', employeeId]);
  }

}
