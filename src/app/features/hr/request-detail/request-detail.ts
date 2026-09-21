import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RefundRequestService } from '../../../core/services/refund-request.service';
import { RefundRequest } from '../../../core/interfaces/refund-request';
import { toSignal } from '@angular/core/rxjs-interop';
import { RequestStatus } from '../../../core/interfaces/enum';
import { FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatLabel, MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatCardModule, MatLabel, MatInputModule, MatFormFieldModule,
    CommonModule, ReactiveFormsModule, MatButtonModule, RouterLink, MatIconModule],
  selector: 'app-request-detail',
  styleUrls: ['./request-detail.scss'],
  templateUrl: './request-detail.html',
})
export class RequestDetail {

  constructor() {

    effect(() => {

      const request = this.requestResource();

      if (!request) {
        return;
      }

      this.request.set(request);


      // Controlla se la richiesta è in stato PENDING e non è già stata revisionata
      if (request.status === RequestStatus.PENDING &&
        !this.alreadyReviewed) {
        this.alreadyReviewed = true;
        this.markAsInProgress(request);
      }

    })

  }

  // INIEZIONI DI DIPENDENZE
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private refundRequestService = inject(RefundRequestService);
  private fb = inject(FormBuilder);


  // VARIABILE CHE CONTIENE L'ID DELLA RICHIESTA DI RIMBORSO (PRESA DALL'URL)
  requestId = this.route.snapshot.paramMap.get('id') ?? '';


  // VARIABILE CHE CONTIENE LA RISORSA (OGGETTO GREZZO) DELLA RICHIESTA DI RIMBORSO (OTTENUTA DAL SERVIZIO)
  requestResource = toSignal(
    this.refundRequestService.getRequestById(this.requestId!),
    {
      initialValue: null
    }
  );


  // VARIABILE CHE CONTIENE LA RICHIESTA DI RIMBORSO CORRENTE (AGGIORNATA IN BASE ALLA RISORSA)
  request = signal<RefundRequest | null>(null);


  // FORM PER LE NOTE DELLA RISORSA HR
  form = this.fb.group({
    noteHr: ['']
  });


  // VARIABILE COMPUTED CHE CONTIENE L'IMPORTO TOTALE APPROVATO DI TUTTE LE SPESE
  approvedTotal = computed(() => {

    const request = this.request();

    if (!request) {
      return;
    }

    return request.expenses.reduce(
      (sum, expense) => sum + (expense.approvedAmount ?? 0),
      0
    );

  });


  // METODO PER AGGIORNARE L'IMPORTO APPROVATO DI UNA SINGOLA SPESA
  updatedApprovedAmount(expenseId: string, value: number): void {

    const request = this.request();

    if (!request) {
      return;
    }


    const updatedRequest: RefundRequest = {

      ...request,
      expenses: request.expenses.map(expense =>
        expense.id === expenseId
          ? {
            ...expense,
            approvedAmount: value
          }
          : expense
      )
    };

    this.request.set(updatedRequest);
  }


  // VARIABILE PER IL MESSAGGIO DI ERRORE DEL FORM
  formError = '';

  // METODO PER APPROVARE LA RICHIESTA DI RIMBORSO
  approveRequest(): void {

    const request = this.request();

    if (!request) {
      return;
    }

    // Controllo se la richiesta ha spese approvate (caso provvisorio in fase di sviluppo)
    if (this.approvedTotal() === 0) {
      this.formError = 'No expenses have been approved for this request!';
      return;
    }
    /////
    
    
    const updatedRequest: RefundRequest = {

      ...request,

      status: RequestStatus.APPROVED,
      noteHr: this.form.value.noteHr ?? '',
      totalApprovedAmount: this.approvedTotal(),
      lastUpdateDate: new Date().toISOString()
    };


    this.request.set(updatedRequest);

    this.refundRequestService
      .updateRequest(updatedRequest.id!, updatedRequest)
      .subscribe({
        next: () => {
          this.router.navigate(['/hr/request-list']);
        }
      });


  }


  // METODO PER RIFIUTARE LA RICHIESTA DI RIMBORSO
  rejectRequest(): void {

    const request = this.request();

    if (!request) {
      return;
    }

    const updatedRequest: RefundRequest = {

      ...request,

      status: RequestStatus.REJECTED,
      noteHr: this.form.value.noteHr ?? '',
      totalApprovedAmount: 0,
      lastUpdateDate: new Date().toISOString()
    };


    this.request.set(updatedRequest);

    this.refundRequestService
      .updateRequest(updatedRequest.id!, updatedRequest)
      .subscribe({
        next: () => {
          this.router.navigate(['/hr/request-list']);
        }
      });

  }


  // METODO PRIVATO PER MARCARE UNA RICHIESTA COME IN CORSO
  private markAsInProgress(request: RefundRequest): void {

    if (request.status !== RequestStatus.PENDING) {
      return;
    }

    const updatedRequest: RefundRequest = {
      ...request,
      status: RequestStatus.IN_PROGRESS,
      lastUpdateDate: new Date().toISOString()
    };

    this.request.set(updatedRequest);


    this.refundRequestService
      .updateRequest(request.id!, updatedRequest)
      .subscribe();

  }


  // VARIABILE CHE INDICA SE LA RICHIESTA È GIÀ STATA REVISIONATA DALL'HR
  private alreadyReviewed = false;

}
