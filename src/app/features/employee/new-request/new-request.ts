import { Component, inject } from '@angular/core';
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



@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule,
    MatCardModule, MatSelectModule, MatIconModule,
    RouterLink, MatInputModule, MatOptionModule],
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
      date: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      requestedAmount: ['', Validators.required]
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


  // METODO PER L'INVIO DEL FORM
  onSubmit(): void {

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

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

      status: RequestStatus.PENDING,

      creationDate: new Date().toISOString(),

      lastUpdateDate: new Date().toISOString(),

    };


    // Invio della richiesta al servizio
    this.refundRequestService.createRequest(request)
      .subscribe({
        next: () => this.router.navigate(['/employee/request-list'])
      });

  }
}
