```HTML
<!-- TEMPLATE ORIGINALE CHE ERA NEL COMPONENTE PADRE -->

    <!-- AREA DELLA LISTA DELLE SPESE -->
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

                <app-progress-bar [category]="expense.category" [amount]="expense.requestedAmount" [maxAmount]="getMaxAmount(expense.category)">
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
```


```HTML
<!-- VERSIONE LEGGERMENTE MODIFICATA PER IL COMPONENTE FIGLIO (DUMB COMPONENT) -->

 <mat-card>

    <mat-card-header>

        <mat-card-title>
            Expenses
            <mat-icon>receipt</mat-icon>
        </mat-card-title>

        @if (formError()) {
        <p class="form-error">
            {{ formError() }}
        </p>
        }

    </mat-card-header>

    <mat-card-content>

        <div class="expenses-list">

            @for (
            expense of request().expenses;
            track expense.id
            ) {

            <!-- Linea divisoria -->
            <mat-divider></mat-divider>

            <div class="expense-container">

                <app-progress-bar [category]="expense.category" [amount]="expense.requestedAmount"
                    [maxAmount]="getMaxAmount(expense.category)">
                </app-progress-bar>

                <div class="expense-row">

                    <div class="expense-input">
                        <strong>Category:</strong>
                        <div>{{ expense.category }}</div>
                    </div>

                    <div class="expense-input">
                        <strong>Description:</strong>
                        <div>
                            {{ expense.description || 'No Description' }}
                        </div>
                    </div>

                    <div class="expense-input">
                        <strong>Requested Amount:</strong>
                        <div>
                            {{ expense.requestedAmount | number:'1.2-2' }} €
                        </div>
                    </div>

                    <mat-form-field appearance="outline">

                        <mat-label>
                            Approved Amount
                        </mat-label>

                        <input matInput type="number" min="0" [disabled]="!reviewMode()"
                            [value]="expense.approvedAmount" (input)="approvedAmountChanged.emit({
                                expenseId: expense.id!,
                                value: +$any($event.target).value
                            })" aria-label="Input the amount that you want to approve or leave blank to reject">
                        <!-- L'input approvedAmountChanged emette l'evento quando l'importo approvato viene modificato dal revisore -->

                    </mat-form-field>

                </div>

                <div class="attachment-container">

                    <strong>Attachments:</strong>

                    <app-attachment-list [attachments]="expense.attachments ?? []" [truncateLength]="20"
                        matTooltip="Click to open file" matTooltipPosition="above">
                    </app-attachment-list>

                </div>

            </div>

            }

        </div>

    </mat-card-content>

</mat-card>
```