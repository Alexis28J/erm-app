import { Component, inject, computed } from '@angular/core';
import { Notification } from '../../../shared/notification-service/notification';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from '../../../core/services/auth.service';
import { RefundRequestService } from '../../../core/services/refund-request.service';
import { Router, RouterLink } from '@angular/router';
import { RefundRequest } from '../../../core/interfaces/refund-request';
import { RequestStatus } from '../../../core/interfaces/enum';
import { Expense } from '../../../core/interfaces/expense';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { CommonModule } from '@angular/common';
import { ProgressBar } from '../../../shared/progress-bar/progress-bar/progress-bar';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { EXPENSE_CATEGORIES } from '../../../core/constants/expense-categories.constant';
import { TotalProgressBar } from '../../../shared/total-progress-bar/total-progress-bar/total-progress-bar';


@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule,
    MatCardModule, MatSelectModule, MatIconModule,
    RouterLink, MatInputModule, MatOptionModule, CommonModule,
    ProgressBar, MatDivider, TotalProgressBar],
  selector: 'app-new-request',
  styleUrls: ['./new-request.scss'],
  templateUrl: './new-request.html',
})
export class NewRequest {

  // INIEZIONE DEI SERVIZI NECESSARI
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private refundRequestService = inject(RefundRequestService);
  private router = inject(Router);
  private notificationService = inject(Notification);


  // FORM
  requestForm = this.fb.group({
    referenceMonth: ['', Validators.required],
    noteEmployee: [''],
    expenses: this.fb.array([])
  });


  // GETTER PER LE SPESE
  get expenses() {
    return this.requestForm.get('expenses') as FormArray;
  }


  // METODO PER AGGIUNGERE UNA SPESA
  addExpense(): void {

    const expense = this.fb.group({
      id: [crypto.randomUUID(), Validators.required],
      date: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      requestedAmount: [null, Validators.required],
      approvedAmount: [0]
    });

    this.expenses.push(expense);
  }


  // METODO PER RIMUOVERE UNA SPESA
  removeExpense(index: number): void {
    this.expenses.removeAt(index);
  }


  // GETTER PER IL TOTALE DELLE SPESE
  get totalAmount(): number {

    return this.expenses.controls.reduce(
      (total, control) => total + Number(control.get('requestedAmount')?.value || 0),
      0
    );

  }


  // METODO PER SALVARE LA RICHIESTA COME BOZZA
  saveDraft(): void {

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return;
    }

    // Oggetto della richiesta di rimborso
    const request: RefundRequest = {

      userId: currentUser.id,

      referenceMonth: this.requestForm.value.referenceMonth!,

      noteEmployee: this.requestForm.value.noteEmployee || '',

      noteHr: "",

      expenses: (this.requestForm.value.expenses || []) as Expense[],

      totalRequestedAmount: this.totalAmount,

      totalApprovedAmount: 0,

      status: RequestStatus.DRAFT,

      creationDate: new Date().toISOString(),

      lastUpdateDate: new Date().toISOString(),

    };

    this.refundRequestService.
      createRequest(request)
      .subscribe({
        next: () => {
          this.notificationService.success('Request saved as draft successfully');
          this.router.navigate(['/employee/dashboard']);
        }
      });

  }


  // VARIABILE PER IL MESSAGGIO DI ERRORE DEL FORM
  formError = '';

  // METODO PER L'INVIO DEL FORM
  submitRequest(): void {

    const currentUser = this.authService.getCurrentUser();

    // Controllo se l'utente corrente esiste
    if (!currentUser) {
      return;
    }

    // Controllo se il form è valido e se ci sono spese aggiunte
    if (this.requestForm.invalid && this.expenses.length === 0) {
      this.requestForm.markAllAsTouched();
      this.formError = 'Please fill in all required fields';
      return;
    }

    // Controllo se ci sono spese aggiunte
    if (this.requestForm.valid && this.expenses.length === 0) {
      this.formError = 'Please add at least one expense';
      return;
    }

    // Controllo se tutte le spese sono valide
    if (this.expenses.controls.some(expense => !expense.valid)) {
      this.formError = 'Please fill in all required fields for each expense';
      return;
    }


    // Oggetto della richiesta di rimborso
    const request: RefundRequest = {

      userId: currentUser.id,

      referenceMonth: this.requestForm.value.referenceMonth!,

      noteEmployee: this.requestForm.value.noteEmployee || '',

      noteHr: "",

      expenses: (this.requestForm.value.expenses) as Expense[],

      totalRequestedAmount: this.totalAmount,

      totalApprovedAmount: 0,

      status: RequestStatus.PENDING,

      creationDate: new Date().toISOString(),

      lastUpdateDate: new Date().toISOString(),

    };


    // Invio della richiesta al servizio
    this.refundRequestService.createRequest(request)
      .subscribe({
        next: () => {
          this.notificationService.success('Request submitted successfully');
          this.router.navigate(['/employee/dashboard']);
        }
      });

  }

  // SIGNAL PER TENERE TRACCIA DEI VALORI DELLE SPESE
  expensesValue = toSignal(   // Converto l'Observable delle spese in un Signal in modo da poterlo utilizzare reattivamente nel template e nel codice TypeScript
    this.expenses.valueChanges.pipe(  // Il metodo valueChanges mi permette di osservare i cambiamenti nei valori delle spese in tempo reale mentre .pipe viene utilizzato per applicare operatori RxJS come startWith
      startWith(this.expenses.getRawValue()) // startWith viene utilizzato per emettere immediatamente il valore iniziale delle spese in modo che il Signal abbia un valore iniziale corretto
    ),
    { initialValue: [] }  // Valore iniziale del Signal, utilizzato prima che l'Observable emetta il primo valore (cioè quando il form è appena caricato)
  )


  // COMPUTED PER OTTENERE I DATI DI PROGRESSO DELLE SPESE
  expenseProgressData = computed(() => {   // Dopo averlo convertito in Signal, posso calcolare i dati di progresso delle spese in modo reattivo
    return this.expensesValue().map((expense: Expense) => ({
      category: expense.category ?? '',
      amount: Number(expense.requestedAmount ?? 0)
    }));
  });


  // COMPUTED PER OTTENERE IL TOTALE MASSIMO CONSENTITO DELLE SPESE
  readonly totalAllowedAmount = computed(() => {

    const request = this.expensesValue();

    if (!request || request.length === 0) {
      return 0;
    }

    return request.reduce((total: number, expense: Expense) => {
      const category = EXPENSE_CATEGORIES.find(
        c => c.name === expense.category
      )
      return total + (category?.maxAmount ?? 0);
    }, 0
    )
  })


  // COMPUTED PER OTTENERE IL TOTALE DELLE SPESE RICHIESTE
  readonly totalRequestedAmount = computed(() => {

    const request = this.expensesValue();

    if (!request || request.length === 0) {
      return 0;
    }

    return request.reduce(
      (total: number, expense: Expense) => {
        return total + (expense.requestedAmount ?? 0);
      },
      0
    )

  })

  

}


