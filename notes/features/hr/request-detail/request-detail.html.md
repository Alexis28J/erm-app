# COMMENTI

```HTML
@if (request(); as request) {

<div class="page-container">

    <!-- AREA DELL'INFORMAZIONE DELLA RICHIESTA -->
    <app-request-info [request]="request" [reviewMode]="reviewMode()"></app-request-info>


    <!-- AREA NOTE DIPENDENTE -->
    <app-employee-note [note]="request.noteEmployee!"></app-employee-note>
    <!-- [note] è la nota del dipendente associata alla richiesta
     Il componente padre passa la nota del dipendente al componente figlio EmployeeNote -->


    <!-- AREA DELLA LISTA DELLE SPESE (COMPONENTE FIGLIO "EXPENSE LIST") -->
    <app-expense-list [request]="request" [reviewMode]="reviewMode()" [formError]="formError"
        [expenseLimits]="expenseCategories()" (approvedAmountChanged)="updatedApprovedAmount(
        $event.expenseId,
        $event.value
    )">
    </app-expense-list>

    <!-- Perché passo a [request] l'intero oggetto request invece request()? 
     Risposta: perché l'intero oggetto request contiene tutte le informazioni necessarie, mentre request() restituirebbe solo il valore attuale della funzione input ad esempio request().totalRequestedAmount.
     In altre parole, passo l'intero oggetto per avere accesso a tutte le proprietà necessarie all'interno del componente figlio.
     -->


    <!-- AREA DELLE NOTE DI HR -->
    <app-hr-notes [form]="form" [reviewMode]="reviewMode()" [request]="request"></app-hr-notes>


    <!-- QUANTITÀ TOTALE RICHIESTA E APPROVATA -->
    <app-total-requested-approved [requestedAmount]="totalRequestedAmount()" [allowedAmount]="totalAllowedAmount()"
    [approvedAmount]="approvedTotal()!"></app-total-requested-approved>


    <!-- PULSANTI ACTIONS -->
    <app-review-actions [request]="request" [reviewMode]="reviewMode()" (approve)="approveRequest()"
        (reject)="rejectRequest()" (startReview)="startReview()" (exitReview)="reviewMode.set(false)">
    </app-review-actions>

</div>

}
```