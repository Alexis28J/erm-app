import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { FormControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatColumnDef } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatCardModule, MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, MatTableModule, MatColumnDef,
    CommonModule, MatButtonModule, RouterLink, MatIconModule],
  selector: 'app-employee-list',
  styleUrls: ['./employee-list.scss'],
  templateUrl: './employee-list.html',
})
export class EmployeeList {

  constructor() {
    this.searchControl.valueChanges.subscribe(value => {
      this.search.set(value ?? '');
    });
  }

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
