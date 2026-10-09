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

@Component({
  imports: [CommonModule, MatCardModule, RouterLink,
    MatButtonModule, MatIconModule, MatTableModule,
    MatSortModule, MatPaginatorModule],
  selector: 'app-employee-details',
  styleUrls: ['./employee-details.scss'],
  templateUrl: './employee-details.html',
})
export class EmployeeDetails {

  constructor() {

    // EFFECT PER AGGIORNARE I DATI DELLA TABELLA QUANDO LE RICHIESTE CAMBIANO
    effect(() => {

      // Ottiene le richieste correnti dal resource signal
      const currentRequests = this.requestsResource();


      // Esclude le richieste con stato "DRAFT" e aggiorna il signal this.requests
      this.requests.set(
        currentRequests.filter(
          r => r.status !== "DRAFT"
        )
      );


      // Aggiorna il dataSource della tabella con le richieste filtrate
      this.dataSource.data = this.requests();


      // Se non ci sono richieste filtrate, esce dall'effetto per evitare ulteriori operazioni
      if (!this.requests() || this.requests().length === 0) return;


      // Forza il rilevamento delle modifiche per aggiornare la vista con i nuovi dati della tabella
      this.cdr.detectChanges();


      // Imposta l'accessor per l'ordinamento dei dati nella tabella se non è già stato impostato
      if (!this.dataSource.sortingDataAccessor) {
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case "referenceMonth": return item.referenceMonth;
            case "creationDate": return new Date(item.creationDate).getTime();
            case "status": return item.status;
            case "totalRequestedAmount": return item.totalRequestedAmount;
            case "totalApprovedAmount": return item.totalApprovedAmount ?? 0;
            default: return item[property as keyof RefundRequest] as any;
          }
        }
      }


      // Imposta il componente di ordinamento della tabella se non è già stato impostato
      if (this.sortComponent && !this.dataSource.sort) {
        this.dataSource.sort = this.sortComponent;

        this.sortComponent.active = "creationDate";
        this.sortComponent.direction = "desc";
      }


      // Imposta il componente di paginazione della tabella se non è già stato impostato
      if (this.paginatorComponent && !this.dataSource.paginator) {
        this.dataSource.paginator = this.paginatorComponent;
      }


      // Applica l'ordinamento iniziale della tabella se il componente di ordinamento è presente
      if (this.dataSource.sort) {
        this.dataSource.sort.sort({ id: "creationDate", start: "desc", disableClear: false });
      }

    });

  }


  // REFERENZE AI COMPONENTI DELLA TABELLA (SORT E PAGINATOR)
  @ViewChild(MatSort) sortComponent!: MatSort;
  @ViewChild(MatPaginator) paginatorComponent!: MatPaginator;


  // DATASOURCE PER LA TABELLA DELLE RICHIESTE
  dataSource = new MatTableDataSource<RefundRequest>();


  // INIEZIONE DELLE DIPENDENZE
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private requestService = inject(RefundRequestService);
  private cdr = inject(ChangeDetectorRef);


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


  // SIGNAL PER LE RICHIESTE DI RIMBORSO DELL'IMPIEGATO (WRITABLE SIGNAL) (NON FILTRATE)
  requests = signal<RefundRequest[]>([]);


  // SIGNAL PER LE RICHIESTE DI RIMBORSO DELL'IMPIEGATO  (READ-ONLY SIGNAL)
  requestsResource = toSignal(
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
    () => this.requestsResource().filter(
      r => r.status !== 'DRAFT'
    ).length
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE APPROVATE
  approvedRequests = computed(
    () => this.requestsResource().filter(
      r => r.status === 'APPROVED'
    ).length
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE RIFIUTATE
  rejectedRequests = computed(
    () => this.requestsResource().filter(
      r => r.status === 'REJECTED'
    ).length
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE IN ATTESA
  pendingRequests = computed(
    () => this.requestsResource().filter(
      r => r.status === 'PENDING' ||
        r.status === 'IN_PROGRESS'
    ).length
  );


  // COMPUTED PER L'IMPORTO TOTALE RICHIESTO
  totalRequestedAmount = computed(
    () => this.requestsResource().reduce(
      (sum, request) => sum + request.totalRequestedAmount,
      0
    )
  );


  // COMPUTED PER L'IMPORTO TOTALE APPROVATO
  totalApprovedAmount = computed(
    () => this.requestsResource().reduce(
      (sum, request) => sum + (request.totalApprovedAmount ?? 0),
      0
    )
  );


  // COLONNE DA VISUALIZZARE NELLA TABELLA DELLE RICHIESTE
  displayedColumns = [
    'referenceMonth',
    'creationDate',
    'status',
    'totalRequestedAmount',
    'totalApprovedAmount',
    'actions'
  ]

}



// VS Code Counter: 142 code lines (08/10/2026)