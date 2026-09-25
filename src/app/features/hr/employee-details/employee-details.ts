import { Component, computed, inject, ViewChild, effect } from '@angular/core';
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

@Component({
  imports: [CommonModule, MatCardModule, RouterLink,
    MatButtonModule, MatIconModule, MatTableModule,
    MatSortModule],
  selector: 'app-employee-details',
  styleUrls: ['./employee-details.scss'],
  templateUrl: './employee-details.html',
})
export class EmployeeDetails {

  constructor() {

    // EFFECT PER AGGIORNARE I DATI DELLA TABELLA QUANDO LE RICHIESTE CAMBIANO
    effect(() => {
      this.dataSource.data = this.requests().filter(r => r.status !== 'DRAFT');
    });

  }


  // VIEW CHILD PER IL MAT SORT (ORDINAMENTO DELLA TABELLA)
  @ViewChild(MatSort)
  set sort(sort: MatSort) {

    if (!sort) {
      return;
    }

    this.dataSource.sort = sort;

    this.dataSource.sortingDataAccessor = (
      item,
      property
    ) => {

      switch (property) {

        case 'creationDate':
          return new Date(item.creationDate).getTime();

        case 'requestedAmount':
          return item.totalRequestedAmount;

        case 'approvedAmount':
          return item.totalApprovedAmount ?? 0;

        default:
          return item[property as keyof RefundRequest] as any;

      }

    };

    // Ordinamento iniziale della tabella (dal più recente al meno recente)
    this.dataSource.sort.active = 'creationDate';
    this.dataSource.sort.direction = 'desc';
    this.dataSource.sort.sortChange.emit({
      active: 'creationDate',
      direction: 'desc'
    });

  }


  // DATASOURCE PER LA TABELLA DELLE RICHIESTE
  dataSource = new MatTableDataSource<RefundRequest>();


  // INIEZIONE DELLE DIPENDENZE
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private requestService = inject(RefundRequestService);


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


  // SIGNAL PER LE RICHIESTE DI RIMBORSO DELL'IMPIEGATO
  requests = toSignal(
    this.route.paramMap.pipe(
      switchMap(params =>
        this.requestService.getRequestsByUserId(params.get('id')!)
          .pipe(catchError(error => {
            console.error(error);
            return of([]);
          }))
      )
    ),
    {
      initialValue: []
    }
  );


  // COMPUTED PER IL NUMERO TOTALE DI RICHIESTE
  totalRequests = computed(
    () => this.requests().length
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE APPROVATE
  approvedRequests = computed(
    () => this.requests().filter(
      r => r.status === 'APPROVED'
    ).length
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE RIFIUTATE
  rejectedRequests = computed(
    () => this.requests().filter(
      r => r.status === 'REJECTED'
    ).length
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE IN ATTESA
  pendingRequests = computed(
    () => this.requests().filter(
      r => r.status === 'PENDING' ||
        r.status === 'IN_PROGRESS'
    ).length
  );


  // COMPUTED PER L'IMPORTO TOTALE RICHIESTO
  totalRequestedAmount = computed(
    () => this.requests().reduce(
      (sum, request) => sum + request.totalRequestedAmount,
      0
    )
  );


  // COMPUTED PER L'IMPORTO TOTALE APPROVATO
  totalApprovedAmount = computed(
    () => this.requests().reduce(
      (sum, request) => sum + (request.totalApprovedAmount ?? 0),
      0
    )
  );


  // COLONNE DA VISUALIZZARE NELLA TABELLA DELLE RICHIESTE
  displayedColumns = [
    'referenceMonth',
    'creationDate',
    'status',
    'requestedAmount',
    'approvedAmount',
    'actions'
  ]

}