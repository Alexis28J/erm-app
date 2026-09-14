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
            </mat-card-title>
        </mat-card-header>


        <!-- CONTENUTO -->
        <mat-card-content>

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

            </div> <!-- fine .request-info -->

        </mat-card-content>

    </mat-card>

    <mat-card>

        <mat-card-header>
            <mat-card-title>
                Employee Note
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
            </mat-card-title>
        </mat-card-header>


        <!-- CONTENUTO -->
        <mat-card-content>

            <div class="expenses-container">

                @for (expense of request.expenses; track expense.id) {
                    <!-- Ciclo attraverso tutte le spese della richiesta di rimborso corrente.
                     track expense.id significa che Angular utilizza l'ID della spesa come chiave unica per ottimizzare il rendering della lista.
                     In altre parole, aiuta Angular a identificare in modo univoco ogni elemento della lista per migliorare le prestazioni del rendering. -->

                <div class="expense-row">

                    <div>
                        <strong>Category:</strong>
                        <div>{{expense.category}}</div>
                    </div>

                    <div>
                        <strong>Description:</strong>
                        <div>{{expense.description || 'No Description'}}</div>
                    </div>

                    <div>
                        <strong>Requested Amount:</strong>
                        <div>{{expense.requestedAmount | number:'1.2-2'}} €</div>
                    </div>

                    <mat-form-field appearance="outline">

                        <mat-label>
                            Amount
                        </mat-label>

                        <!-- Per rendere obbligatorio l'inserimento di un importo approvato, puoi aggiungere l'attributo "required" all'input -->
                        <input matInput type="number" min="0" required [value]="expense.approvedAmount"
                            (input)="updatedApprovedAmount(expense.id!, +$any($event.target).value)">
                        <!-- +$any($event.target).value significa che il valore dell'input viene convertito in numero. 
                     Questo è necessario perché l'input HTML restituisce sempre una stringa. -->

                    </mat-form-field>

                </div>

                }

            </div> <!-- .expenses-container -->
        </mat-card-content>

    </mat-card>


    <!-- AREA DELLE NOTE DI HR -->
    <mat-card>

        <mat-card-header>
            <mat-card-title>
                HR Note
            </mat-card-title>
        </mat-card-header>

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

    </mat-card>


    <!-- AREA DI APPROVED TOTAL -->

    <mat-card>

        <mat-card-content>

            <div class="total-card">
                <div class="total-label">Approved Total:</div>
                <div class="total-amount">{{ approvedTotal() | number:'1.2-2' }} €</div>
            </div>

        </mat-card-content>

    </mat-card>


    <!-- PULSANTI ACTIONS -->
    <div class="actions">
        <button mat-raised-button color="warn" (click)="approveRequest()" class="approve-btn"
            [disabled]="request.status === 'APPROVED'">
            Approve
        </button>

        <button mat-raised-button color="warn" (click)="rejectRequest()" class="reject-btn"
            [disabled]="request.status === 'REJECTED'">
            Reject
        </button>

        <button mat-stroked-button routerLink="/hr/request-list">
            Back
        </button>
    </div>


</div>

}
```