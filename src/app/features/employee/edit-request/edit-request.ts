import { Component, effect, inject } from '@angular/core';
import { Notification } from '../../../shared/notification-service/notification';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RefundRequestService } from '../../../core/services/refund-request.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RefundRequest } from '../../../core/interfaces/refund-request';
import { Expense } from '../../../core/interfaces/expense';
import { RequestStatus } from '../../../core/interfaces/enum';
import { MatOption } from "@angular/material/select";
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule,
    DatePipe, CurrencyPipe, MatOption, MatSelectModule, MatIconModule],
  selector: 'app-edit-request',
  styleUrls: ['./edit-request.scss'],
  templateUrl: './edit-request.html',
})
export class EditRequest {

  constructor() {

    effect(() => {

      const request = this.request();

      if (!request || this.formInitialized) {
        return;
      }

      this.populateForm(request);
      this.formInitialized = true;

    })


  }

  // INIEZIONE DELLE DIPENDENZE 
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private refundRequestService = inject(RefundRequestService);
  private notificationService = inject(Notification);


  // INIZIALIZZAZIONE DELLE VARIABILI

  // Variabile che indica se il form è stato inizializzato.
  private formInitialized = false;


  // Variabile che contiene l'ID della richiesta corrente.
  private requestId = this.route.snapshot.paramMap.get('id');


  // Variabile che rappresenta il form reattivo per la richiesta di rimborso.
  requestForm = this.fb.group({
    referenceMonth: ['', Validators.required],
    noteEmployee: [''],
    expenses: this.fb.array([])
  });


  // Variabile che rappresenta il segnale della richiesta di rimborso corrente.
  request = toSignal(
    this.refundRequestService.getRequestById(
      this.requestId ?? ''
    ),
    {
      initialValue: null
    }
  );


  // GETTER PER L'ARRAY DELLE SPESE DEL FORM
  get expenses(): FormArray {

    return this.requestForm.get(
      'expenses'
    ) as FormArray;

  }


  // GETTER PER IL TOTALE DELLE SPESE DEL FORM
  get totalAmount(): number {
    return this.expenses.controls.reduce(
      (total, control) => total + Number(
        control.get('requestedAmount')
          ?.value || 0
      ),
      0
    )
  }


  // METODO PRIVATO PER POPOLARE IL FORM CON I DATI DELLA RICHIESTA CORRENTE (SI USA QUANDO SI CARICA UNA RICHIESTA ESISTENTE)
  private populateForm(request: RefundRequest): void {

    this.requestForm.patchValue({

      referenceMonth: request.referenceMonth,

      noteEmployee: request.noteEmployee ?? ''

    });

    this.expenses.clear();

    request.expenses.forEach(expense => {

      this.expenses.push(
        this.fb.group({
          date: [expense.date, Validators.required],
          category: [expense.category, Validators.required],
          description: [expense.description],
          requestedAmount: [expense.requestedAmount, Validators.required]
        })
      );
    });

  }


  // METODO PER AGGIUNGERE UNA NUOVA SPESA AL FORM
  addExpense(): void {
    this.expenses.push(
      this.fb.group({
        date: ['', Validators.required],
        category: ['', Validators.required],
        description: [''],
        requestedAmount: ['', Validators.required]
      })
    );
  }


  // METODO PER RIMUOVERE UNA SPESA DAL FORM
  removeExpense(index: number): void {
    this.expenses.removeAt(index);
  }


  // METODO PER SALVARE LA RICHIESTA COME BOZZA
  saveDraft(): void {

    const currentRequest = this.request();

    if (!currentRequest) {
      return;
    }


    // Oggetto che rappresenta la richiesta aggiornata da salvare come bozza.
    const updatedRequest: RefundRequest = {

      ...currentRequest,

      referenceMonth: this.requestForm.value.referenceMonth ?? '',
      noteEmployee: this.requestForm.value.noteEmployee ?? '',
      expenses: (this.requestForm.value.expenses ?? []) as Expense[],
      totalRequestedAmount: this.totalAmount,
      status: RequestStatus.DRAFT,
      lastUpdateDate: new Date().toISOString()

    };

    this.refundRequestService
      .updateRequest(
        currentRequest.id!,
        updatedRequest
      )
      .subscribe({

        next: () => {

          this.notificationService.success('Request saved as draft successfully');

          this.router.navigate([
            'employee/request-list'
          ]);
        }

      })

  }


  // METODO PER INVIARE LA RICHIESTA
  submitRequest(): void {

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    const currentRequest = this.request();

    if (!currentRequest) {
      return;
    }

    const updatedRequest: RefundRequest = {

      ...currentRequest,

      referenceMonth: this.requestForm.value.referenceMonth ?? '',
      noteEmployee: this.requestForm.value.noteEmployee ?? '',
      expenses: (this.requestForm.value.expenses ?? []) as Expense[],
      totalRequestedAmount: this.totalAmount,
      status: RequestStatus.PENDING,
      lastUpdateDate: new Date().toISOString()

    };

    this.refundRequestService
      .updateRequest(
        currentRequest.id!,
        updatedRequest
      )
      .subscribe({
        next: () => {

          this.notificationService.success('Request submitted successfully');

          this.router.navigate([
            '/employee/request-list'
          ]);
        }
      });

  }

}


