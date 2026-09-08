# COMMENTI

```TYPESCRIPT
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
  private fb = inject(FormBuilder);  // FormBuilder è un servizio di Angular che facilita la creazione di form reattivi.
  private authService = inject(AuthService);
  private refundRequestService = inject(RefundRequestService);
  private router = inject(Router);


  // FORM
  requestForm = this.fb.group({ // Creazione del FormGroup principale per la richiesta di rimborso.
    referenceMonth: ['', Validators.required],  //Valore obbligatorio
    noteEmployee: [''],
    //Gestione delle spese
    expenses: this.fb.array([])  //expenses sarà un FormArray che conterrà tutte le spese aggiunte dall'utente.
  });


  // GETTER PER LE SPESE
  // Questo getter permette di accedere facilmente all'array delle spese nel form.
  get expenses() {
    return this.requestForm.get('expenses') as FormArray; // Cast la proprietà 'expenses' a FormArray per accedere facilmente all'array delle spese nel form.
    // Questo permette di utilizzare this.expenses per manipolare direttamente l'array delle spese nel form.
    // Il cast a FormArray è necessario perché il metodo get() restituisce un AbstractControl, che non ha i metodi specifici di FormArray come push() o removeAt().
  }


  // METODO PER AGGIUNGERE UNA SPESA
  addExpense(): void {

    const expense = this.fb.group({
      date: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      requestedAmount: ['', Validators.required]
    });
    this.expenses.push(expense);  // Aggiunge expense (la nuova spesa) a expenses (array delle spese)

  }


  // METODO PER RIMUOVERE UNA SPESA
  removeExpense(index: number): void {  //index: number indica l'indice della spesa da rimuovere nell'array delle spese
    this.expenses.removeAt(index);  // RemoveAt(index) rimuove la spesa all'indice specificato
    // In altre parole, rimuove la spesa dall'array delle spese mantenendo l'integrità del form.
  }


  // GETTER PER IL TOTALE DELLE SPESE
  get totalAmount(): number {    // Questo getter calcola dinamicamente il totale delle spese presenti nell'array delle spese del form ogni volta che viene chiamato.

    
    return this.expenses.controls.reduce(  // expenses è trattata come un array di controlli del form
    // si usa .controls per accedere ai controlli dell'array delle spese, .reduce calcola il totale degli importi

      (total, control) => total + Number(control.get('requestedAmount')?.value || 0),
      0
      // (total, control) rappresentano rispettivamente il totale accumulato e il controllo (cioè la singola spesa) corrente dell'array delle spese.
      // control.get('requestedAmount')?.value rappresenta il valore dell'importo della singola spesa corrente. Se il valore è nullo o indefinito, viene utilizzato 0 grazie all'operatore || 0.
      // Number() converte il valore dell'importo in un numero, garantendo che il totale sia calcolato correttamente anche se il valore è una stringa.
      // Quindi total + Number(control.get('requestedAmount')?.value || 0) rappresenta l'aggiornamento del totale con l'importo della spesa corrente.
      // , 0 rappresenta il valore iniziale del totale prima di sommare gli importi delle spese.
      // In questo modo, il getter totalAmount restituisce sempre il totale aggiornato delle spese presenti nel form.
      // Per esempio, se ci sono tre spese con importi 10, 20 e 30, il getter restituirà 60.
    );

  }

  // RICORDA: Il getter è un metodo speciale che viene chiamato come una proprietà, quindi si utilizza this.totalAmount senza parentesi. Lo stesso vale per expenses.

  // METODO PER L'INVIO DEL FORM
  onSubmit(): void {

    //Controlla se il form è valido prima di procedere con l'invio
    if (this.requestForm.invalid) {  // se il form non è valido, segna tutti i campi come toccati per mostrare gli errori

      this.requestForm.markAllAsTouched();  // markAllAsTouched segna tutti i campi del form come toccati per mostrare gli errori di validazione
      
      return;  // interrompe l'invio del form se non è valido
    }

    // Ottieni l'utente corrente dall'authService
    const currentUser = this.authService.getCurrentUser();

    // Se non c'è un utente corrente, interrompi l'invio del form
    if (!currentUser) {
      return;
    }

    // Crea l'oggetto request da inviare al servizio, popolando i campi con i valori del form e le informazioni dell'utente corrente
    const request: RefundRequest = {

      userId: currentUser.id,

      referenceMonth: this.requestForm.value.referenceMonth!,

      noteEmployee: this.requestForm.value.noteEmployee || '',

      noteHr: "",

      expenses: (this.requestForm.value.expenses || []) as Expense[],  // Ottieni l'array delle spese dal form, se non ci sono spese utilizza un array vuoto, e castalo come Expense[]

      totalRequestedAmount: this.totalAmount,

      totalApprovedAmount: 0,  // Inizialmente l'importo approvato è 0, verrà aggiornato successivamente dall'amministratore

      status: RequestStatus.PENDING,  // Imposta lo stato della richiesta come "in attesa" inizialmente

      creationDate: new Date().toISOString(),

      lastUpdateDate: new Date().toISOString(),
    };


    // Invia la richiesta al servizio per la creazione di una nuova richiesta di rimborso
    this.refundRequestService.createRequest(request)
      .subscribe({
        next: () => this.router.navigate(['/employee/request-list'])
      });

  }
}

```