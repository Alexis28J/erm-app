import { ChangeDetectorRef, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RefundRequest } from '../../../core/interfaces/refund-request';
import { RefundRequestService } from '../../../core/services/refund-request.service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [MatIconModule, MatCardModule, MatTableModule,
    DatePipe, CommonModule, MatButtonModule,
    RouterLink, MatSortModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule],
  selector: 'app-request-list',
  styleUrls: ['./request-list.scss'],
  templateUrl: './request-list.html',
})
export class RequestList {

  constructor() {

    // DEFINIZIONE DEL FILTRO DI RICERCA PERSONALIZZATO PER LA TABELLA
    this.dataSource.filterPredicate = (request, filter) => {
      const searchableText = [
        request.referenceMonth,
        request.creationDate,
        request.status,
        request.totalRequestedAmount,
        // request.totalApprovedAmount ?? 0,
      ].join(' ').toLowerCase();

      return searchableText.includes(filter);
    };


    // EFFECT PER AGGIORNARE LA TABELLA QUANDO LA RISORSA DELLE RICHIESTE DI RIMBORSO CAMBIA
    effect(() => {

      const currentRequests = this.requestResource();

      this.requests.set(
        currentRequests.filter(
          request => request.status !== 'DRAFT'
        ));


      // Aggiorno i dati del dataSource con le richieste filtrate
      this.dataSource.data = this.requests();


      // Applico il filtro al dataSource
      this.dataSource.filter = this.filterValue().trim().toLowerCase();


      // Se non ci sono richieste, esco dalla funzione
      if (!this.requests() || this.requests().length === 0) return;


      // Forzo il rilevamento (cioè il refresh) delle modifiche per aggiornare la vista della tabella
      this.cdr.detectChanges();


      // Imposto l'accessor per l'ordinamento dei dati nella tabella
      if (!this.dataSource.sortingDataAccessor) {
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case "referenceMonth": return item.referenceMonth;
            case "creationDate": return new Date(item.creationDate).getTime();
            case "totalRequestedAmount": return item.totalRequestedAmount;
            default: return item[property as keyof RefundRequest] as any;
          }
        };
      }

      // Controllo se il componente di ordinamento è presente 
      // e se il dataSource non ha ancora un ordinamento assegnato
      if (this.sortComponent && !this.dataSource.sort) {
        this.dataSource.sort = this.sortComponent;

        this.sortComponent.active = "creationDate";
        this.sortComponent.direction = "desc";
      }


      // Controllo se il componente di paginazione è presente 
      // e se il dataSource non ha ancora un paginatore assegnato
      if (this.paginatorComponent && !this.dataSource.paginator) {
        this.dataSource.paginator = this.paginatorComponent;
      }


      // Controllo se il dataSource ha un ordinamento assegnato e, 
      // in tal caso, applico l'ordinamento iniziale
      if (this.dataSource.sort) {
        this.dataSource.sort.sort({ id: "creationDate", start: "desc", disableClear: false });
      }

    });

  }

  // Riferimenti classici (non più setter complessi)
  @ViewChild(MatSort) sortComponent!: MatSort;
  @ViewChild(MatPaginator) paginatorComponent!: MatPaginator;


  // FONTE DEI DATI PER LA TABELLA DELLE RICHIESTE DI RIMBORSO
  dataSource = new MatTableDataSource<RefundRequest>();


  // INIEZIONI DI SERVIZI
  private refundRequestService = inject(RefundRequestService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);


  // SEGNALE PER MEMORIZZARE LE RICHIESTE DI RIMBORSO 
  requests = signal<RefundRequest[]>([]);


  // SEGNALE PER MEMORIZZARE LA RISORSA DELLE RICHIESTE DI RIMBORSO 
  requestResource = toSignal(
    this.refundRequestService.getAllRequests(),
    {
      initialValue: []
    }
  );


  // METODO PER VISUALIZZARE I DETTAGLI DI UNA RICHIESTA DI RIMBORSO
  viewDetails(id: string): void {

    this.router.navigate([
      '/hr/request-details', id
    ]);

  }


  // COLONNE DELLA TABELLA
  displayedColumns = [
    'referenceMonth',
    'creationDate',
    'totalRequestedAmount',
    'status',
    'actions'
  ];


  // SEGNALE PER MEMORIZZARE IL VALORE DEL FILTRO DI RICERCA
  filterValue = signal('');


  // METODO PER AGGIORNARE IL FILTRO DI RICERCA
  updateFilter(event: Event): void {

    this.filterValue.set(
      (event.target as HTMLInputElement).value
    )

  }

}
