import { Component, effect, inject, signal } from '@angular/core';
import { RefundRequest } from '../../../core/interfaces/refund-request';
import { RefundRequestService } from '../../../core/services/refund-request.service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';



@Component({
  imports: [MatIconModule, MatCardModule, MatTableModule, DatePipe, CommonModule, MatButtonModule, RouterLink],
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

    });

  }

  private refundRequestService = inject(RefundRequestService);
  private router = inject(Router);

  // Segnale per memorizzare le richieste di rimborso
  requests = signal<RefundRequest[]>([]);

  // Segnale per memorizzare la risorsa delle richieste di rimborso 
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
