import { Component, computed, inject, ViewChild, effect, ChangeDetectorRef, input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { RefundRequestService } from '../../../core/services/refund-request.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RefundRequest } from '../../../core/interfaces/refund-request';
import { catchError, of } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { EmployeeStatistics } from './employee-statistics/employee-statistics';
import { EmployeeRequestHistory } from './employee-request-history/employee-request-history';

@Component({
  imports: [CommonModule, MatCardModule, RouterLink,
    MatButtonModule, MatIconModule, MatTableModule,
    MatSortModule, MatPaginatorModule, EmployeeStatistics, EmployeeRequestHistory],
  selector: 'app-employee-details',
  styleUrls: ['./employee-details.scss'],
  templateUrl: './employee-details.html',
})
export class EmployeeDetails {

  // INIEZIONE DELLE DIPENDENZE
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);


  // SIGNAL PER L'ID DELL'IMPIEGATO
  employeeId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') ?? '')
    ),
    {
      initialValue: ''
    }
  );


  // SIGNAL PER I DETTAGLI DELL'IMPIEGATO
  employee = toSignal(
    this.route.paramMap.pipe(
      switchMap(params =>
        this.userService.getUserById(params.get('id')!)
      )
    ),
    {
      initialValue: undefined
    }
  );

}



// VS Code Counter: 47 code lines (20/10/2026)