# COMMENTI

```HTML
@if (request(); as request) {

<div class="page-container">

    <!-- AREA DELL'INFORMAZIONE DELLA RICHIESTA -->
    <mat-card>

        <!-- HEADER -->
        <mat-card-header>
            <mat-card-title>
                Request Details
                <mat-icon>description</mat-icon>
            </mat-card-title>
        </mat-card-header>


        <!-- CONTENUTO -->
        <mat-card-content>

            @if (!reviewMode()) {

            <div class="review-banner">

                <strong>
                    <mat-icon>
                        visibility
                    </mat-icon>
                    VIEWING MODE</strong>

                <span>
                    <mat-icon>arrow_downward</mat-icon>
                    Go below to:
                </span>

                <span>
                    • Click "Verify Request" to start the review process <br>
                    • Click "Edit Review" to modify an existing review.
                </span>

            </div>

            }


            <div class="request-info">

                <p class="info-item">
                    <span class="info-label">Month:</span>
                    <span class="info-value">{{ request.referenceMonth }}</span>
                </p>

                <p class="info-item">
                    <span class="info-label">Creation Date:</span>
                    <span class="info-value">{{ request.creationDate | date: 'yyyy-MM-dd' }}</span>
                </p>

                <p class="info-item">
                    <span class="info-label">Last Update:</span>
                    <span class="info-value">{{ request.lastUpdateDate | date: 'yyyy-MM-dd' }}</span>
                </p>

                <p class="info-item">
                    <span class="info-label">Requested Amount:</span>
                    <span class="info-value">{{ request.totalRequestedAmount | number: '1.2-2' }} €</span>
                    <!-- Mostra l'importo totale richiesto formattato con due decimali.
                     Ad esempio, 123.45 € o 0.00 € -->
                </p>

                <p class="info-item">
                    <!-- Applica una classe CSS basata sullo stato della richiesta per colorare il testo -->
                    <!-- .toLowerCase() viene usato per convertire lo stato in minuscolo, in modo che corrisponda alle classi CSS definite nello stylesheet -->
                    <span class="info-label">Status:</span>
                    <span [ngClass]="request.status.toLowerCase()" class="status-badge">
                        {{ request.status === 'APPROVED' ? 'Approved'
                        : request.status === 'REJECTED' ? 'Rejected'
                        : request.status === 'PENDING' ? 'Pending'
                        : request.status === 'PARTIAL_APPROVED' ? 'Partial Approved'
                        : request.status === 'DRAFT' ? 'Draft'
                        : request.status === 'IN_PROGRESS' ? 'In Progress'
                        : request.status }}
                    </span>
                </p>

            </div> <!-- fine request-info -->

        </mat-card-content>

    </mat-card>


    <mat-card>

        <mat-card-header>
            <mat-card-title>
                Employee Note
                <mat-icon>notes</mat-icon>
            </mat-card-title>
        </mat-card-header>


        <!-- AREA NOTE DIPENDENTE -->
        <mat-card-content>
            <p>{{ request.noteEmployee || 'No Employee Note.' }}</p>
            <!-- Mostra le note del dipendente, se presenti. Oppure un messaggio che indica che non ci sono note. -->
        </mat-card-content>

    </mat-card>

    <!-- AREA DELLA TABELLA DELLE SPESE -->
    <mat-card>

        <!-- HEADER -->
        <mat-card-header>
            <mat-card-title>
                Expenses
                <mat-icon>receipt</mat-icon>
            </mat-card-title>
        </mat-card-header>


        <!-- CONTENUTO -->
        <mat-card-content>

            <div class="expenses-list">

                @for (expense of request.expenses; track expense.id) {
                    <!-- Ciclo attraverso tutte le spese della richiesta di rimborso corrente.
                     track expense.id significa che Angular utilizza l'ID della spesa come chiave unica per ottimizzare il rendering della lista.
                     In altre parole, aiuta Angular a identificare in modo univoco ogni elemento della lista per migliorare le prestazioni del rendering. -->

                <!-- Linea divisoria -->
                <mat-divider></mat-divider>

            <div class="expense-container">

                <app-progress-bar [category]="expense.category" [amount]="expense.requestedAmount">
                </app-progress-bar>


                <div class="expense-row">

                    <div class="expense-input">
                        <strong>Category:</strong>
                        <div>{{expense.category}}</div>
                    </div>

                    <div class="expense-input">
                        <strong>Description:</strong>
                        <div>{{expense.description || 'No Description'}}</div>
                    </div>

                    <div class="expense-input">
                        <strong>Requested Amount:</strong>
                        <div>{{expense.requestedAmount | number:'1.2-2'}} €</div>
                    </div>

                    <mat-form-field appearance="outline">

                        <mat-label>
                            Amount
                        </mat-label>


                        <input matInput type="number" min="0" required [value]="expense.approvedAmount"
                            (input)="updatedApprovedAmount(expense.id!, +$any($event.target).value)">

                    </mat-form-field>

                </div>

<!-- [value] è l'importo approvato corrente della spesa mentre che (input) rappresenta il nuovo valore inserito dall'utente HR -->
<!-- Per chiarire: Quando l'utente apre la richiesta in modalità di revisione, approvedAmount è inizializzato come 0 perché non ci sono ancora importi approvati -->
<!-- Quindi value mostra l'importo approvato corrente della spesa, che può essere modificato dall'utente HR in modalità di revisione grazie all'input -->

<!-- L'attributo "required" rende obbligatorio l'inserimento di un importo approvato -->
<!-- +$any($event.target).value significa che il valore dell'input viene convertito in numero. 
Questo è necessario perché l'input HTML restituisce sempre una stringa. -->

          </div> <!-- fine di expenses-container -->
               
                }

          </div>  <!-- fine di expenses-list -->
        
        </mat-card-content>

    </mat-card>


    <!-- AREA DELLE NOTE DI HR -->
    <mat-card>

        <mat-card-header>
            <mat-card-title>
                HR Note
                <mat-icon>edit</mat-icon>
            </mat-card-title>
        </mat-card-header>

        @if (reviewMode()) {
            
        <mat-card-content>

            <form [formGroup]="form">
                <mat-form-field appearance="outline" class="full-width">

                    <mat-label>
                        HR Notes
                    </mat-label>

                    <textarea matInput rows="5" formControlName="noteHr">
                    </textarea>

                </mat-form-field>
            </form>

        </mat-card-content>

        } @else if (request.noteHr) {

        <mat-card-content>
            {{request.noteHr}}
        </mat-card-content>

        } @else if (request.status !== 'PENDING' && request.noteHr === '') {

        <mat-card-content>
            No HR Notes
        </mat-card-content>

        } @else {

        <mat-card-content>
            <div class="review-banner">
                <span>
                    Click on "Verify Request" to add HR Notes
                </span>
            </div>
        </mat-card-content>

        }

    </mat-card>


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

        <div class="back-btn">
            <button mat-stroked-button routerLink="/hr/request-list">
                Request List
                <mat-icon>arrow_back</mat-icon>
            </button>

            <button mat-stroked-button [routerLink]="['/hr/employee-details', request.userId]">
                Employee Details
                <mat-icon>arrow_back</mat-icon>
            </button>
        </div>


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

        <button mat-raised-button color="warn" (click)="rejectRequest()" class="reject-btn">
            Reject
        </button>

        <button mat-raised-button color="warn" (click)="approveRequest()" class="approve-btn">
            Approve
        </button>

        }


        <!-- PULSANTE DI MODIFICA DELLA REVIEW -->
        @if (
        request.status === 'APPROVED' ||
        request.status === 'PARTIAL_APPROVED' ||
        request.status === 'REJECTED'
        ) {

        <button mat-raised-button color="accent" (click)="startReview()" [hidden]="reviewMode()">

            Edit Review

            <mat-icon>
                edit
            </mat-icon>

        </button>

        }


        <!-- PULSANTE DI VERIFICA DELLA RICHIESTA -->
        @if (!reviewMode()) {

        <button mat-raised-button color="primary" (click)="startReview()"
            [hidden]="request.status === 'APPROVED' || request.status === 'PARTIAL_APPROVED' || request.status === 'REJECTED'">
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