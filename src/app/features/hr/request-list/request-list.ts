import { Component, effect, inject, signal, ViewChild } from '@angular/core';
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


@Component({
  imports: [MatIconModule, MatCardModule, MatTableModule, DatePipe,
    CommonModule, MatButtonModule, RouterLink, MatSortModule],
  selector: 'app-request-list',
  styleUrls: ['./request-list.scss'],
  templateUrl: './request-list.html',
})
export class RequestList {

  constructor() {


    effect(() => {

      const requests = this.requestResource();

      this.requests.set(
        requests.filter(
          request => request.status !== 'DRAFT'
        ));

      this.dataSource.data = this.requests();
    });

  }

  // COLLEGAMENTO DEL MATSORT ALLA DATASOURCE DELLA TABELLA
  @ViewChild(MatSort)  
  set sort(sort: MatSort) {  
    if (!sort) {  
      return;
    }

    this.dataSource.sort = sort;  

    this.dataSource.sortingDataAccessor = (item, property) => {

      switch (property) {
        case 'month': return item.referenceMonth;
        case 'creationDate': return new Date(item.creationDate).getTime();
        case 'amount': return item.totalRequestedAmount;
        default: return item[property as keyof RefundRequest] as any;
      }
    };

    // Ordinamento iniziale
    this.dataSource.sort.active = 'creationDate';
    this.dataSource.sort.direction = 'desc';
    this.dataSource.sort.sortChange.emit({
      active: 'creationDate',
      direction: 'desc'
    });
  }


  // FONTE DEI DATI PER LA TABELLA DELLE RICHIESTE DI RIMBORSO
  dataSource = new MatTableDataSource<RefundRequest>();  


  // INIEZIONI DI SERVIZI
  private refundRequestService = inject(RefundRequestService);
  private router = inject(Router);


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
    'month',
    'creationDate',
    'amount',
    'status',
    'actions'
  ];

}
