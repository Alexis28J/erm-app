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


    <!-- BARRA DI PROGRESSO TOTALE -->
    <mat-card class="space">

        <mat-card-header class="overview-header">
            <mat-card-title>
                Total Requested Amount
                <mat-icon>paid</mat-icon>
            </mat-card-title>
        </mat-card-header>

        <mat-card-content>
            <div class="expense-container">
                <app-total-progress-bar [requestedAmount]="totalRequestedAmount()"
                    [allowedAmount]="totalAllowedAmount()">
                </app-total-progress-bar>
            </div>
        </mat-card-content>

    </mat-card>


    <!-- AREA DI APPROVED TOTAL -->
    <mat-card>

        <mat-card-header class="overview-header">
            <mat-card-title>
                Total Approved Amount
                <mat-icon>check_circle</mat-icon>
            </mat-card-title>
        </mat-card-header>

        <mat-card-content>
            <div class="total-card">
                <!-- <div class="total-label">Approved Total:</div> -->
                <div class="total-amount">{{ approvedTotal() | number:'1.2-2' }} €</div>
            </div>
        </mat-card-content>

    </mat-card>


    <!-- PULSANTI ACTIONS -->
    <div class="actions">

        <!-- PULSANTI DI APPROVAZIONE E RIFIUTO VISIBILI SOLO IN MODALITÀ DI REVISIONE -->
        @if (reviewMode()) {

        <!-- <button mat-raised-button color="warn" (click)="rejectRequest()" class="reject-btn"
            [disabled]="request.status === 'REJECTED'">
            Reject
        </button> -->

        <!-- <button mat-raised-button color="warn" (click)="approveRequest()" class="approve-btn"
            [disabled]="request.status === 'APPROVED'">
            Approve
        </button> -->

        <!-- Per tornare al modo di visualizzazione normale, il pulsante "Return to View Mode" deve impostare reviewMode() a false -->
        <button mat-stroked-button (click)="reviewMode.set(false)">
            Return to View Mode
            <mat-icon>cancel</mat-icon>
        </button>

        <div class="reject-approve">
            <button mat-raised-button color="warn" (click)="rejectRequest()" class="reject-btn"
                [disabled]="request.status === 'REJECTED'">
                Reject
                <mat-icon>thumb_down</mat-icon>
            </button>

            <button mat-raised-button color="warn" (click)="approveRequest()" class="approve-btn"
                [disabled]="request.status === 'APPROVED'">
                Approve
                <mat-icon>thumb_up</mat-icon>
            </button>

        }


        <!-- PULSANTE DI MODIFICA DELLA REVIEW -->
        @if (
        request.status === 'APPROVED' ||
        request.status === 'PARTIAL_APPROVED' ||
        request.status === 'REJECTED'
        ) {

        <button mat-raised-button color="accent" (click)="startReview()" [hidden]="reviewMode()" class="edit-btn">

            Edit Review

            <mat-icon>
                edit
            </mat-icon>

        </button>

        }


        <!-- PULSANTE DI VERIFICA DELLA RICHIESTA -->
        @if (!reviewMode()) {

        <button mat-raised-button color="primary" (click)="startReview()"
            [hidden]="request.status === 'APPROVED' || request.status === 'PARTIAL_APPROVED' || request.status === 'REJECTED'" class="verify-btn">
            Verify Request

            <mat-icon>
                fact_check
            </mat-icon>

        </button>

        }

    </div>


</div>

}
```