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
import { MatIconModule } from '@angular/material/icon';
import { ProgressBar } from '../../../shared/progress-bar/progress-bar/progress-bar';
import { MatDivider } from '@angular/material/divider';
import { EXPENSE_CATEGORIES } from '../../../core/constants/expense-categories.constant';
import { TotalProgressBar } from '../../../shared/total-progress-bar/total-progress-bar/total-progress-bar';
import { AttachmentList } from '../../../shared/attachment-list/attachment-list/attachment-list';


@Component({
  imports: [MatCardModule, MatLabel, MatInputModule,
    MatFormFieldModule, CommonModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule,
    ProgressBar, MatDivider, TotalProgressBar, AttachmentList],
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

      this.form.patchValue({    
        noteHr: request.noteHr ?? '' 
      });

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


  // VARIABILE CHE INDICA SE SI È IN MODALITÀ DI REVISIONE DELLA RICHIESTA
  readonly reviewMode = signal(false);


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

    // VARIABILE CHE CONTIENE L'IMPORTO TOTALE APPROVATO DELLE SPESE 
    const approvedAmount = this.approvedTotal() ?? 0;  


    // Controllo se la richiesta ha spese approvate (caso provvisorio in fase di sviluppo)
    if (this.approvedTotal() === 0) {
      this.formError = 'No expenses have been approved for this request!';
      return;
    }
    /////


    // VARIABILE CHE CONTIENE LO STATO DELLA RICHIESTA IN BASE ALL'IMPORTO APPROVATO
    let status: RequestStatus;  


    // Controllo se l'importo approvato è inferiore all'importo totale richiesto per determinare lo stato della richiesta
    if (approvedAmount < request.totalRequestedAmount) {
      status = RequestStatus.PARTIAL_APPROVED;
    } else {
      status = RequestStatus.APPROVED;
    }

    const updatedRequest: RefundRequest = {

      ...request,

      status, 
      noteHr: this.form.value.noteHr ?? '',  
      totalApprovedAmount: approvedAmount,  
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
      noteHr: this.form.value.noteHr ?? 'No HR Notes',
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


  // CALCOLO DELL'IMPORTO CONSENTITO TOTALE
  readonly totalAllowedAmount = computed(() => {

    const request = this.request();

    if (!request) {
      return 0;
    }

    return request.expenses.reduce((total, expense) => {
      const category = EXPENSE_CATEGORIES.find(
        c => c.name === expense.category
      );

      return total + (category?.maxAmount ?? 0);
    }, 0
    );
  });


  // CALCOLO DELL'IMPORTO RICHIESTO TOTALE
  readonly totalRequestedAmount = computed(() => {

    const request = this.request();

    if (!request) {
      return 0;
    }

    return request.expenses.reduce(
      (sum, expense) => sum + expense.requestedAmount,
      0
    );
  });


  // METODO PER INIZIARE LA REVISIONE DI UNA RICHIESTA
  startReview(): void {
    const request = this.request();  

    if (!request) {   
      return;      
    }

    this.reviewMode.set(true);  

    if (request.status === RequestStatus.PENDING) {  
      this.markAsInProgress(request);  
    }

  }


}
