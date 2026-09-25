# COMMENTI

```HTML
<!-- CONTAINER PRINCIPALE -->
<div class="page-container">

    <!-- CARD PRINCIPALE -->
    <mat-card>

        <!-- HEADER DELLA CARD -->
        <mat-card-header>
            <mat-card-title>
                New Refund Request
                <mat-icon>receipt</mat-icon>
            </mat-card-title>

            <!-- Messaggio di errore quando il form non è valido -->
            <!-- Se formError è valorizzato (cioè se si verifica uno degli errori nel form), viene visualizzato il messaggio di errore -->
            @if (formError) {
            <span class="error-message">{{ formError }}</span>
            }
        </mat-card-header>


        <!-- CONTENUTO DELLA CARD -->
        <mat-card-content>

            <mat-card-subtitle>
                Request Details
                <mat-icon>info</mat-icon>
            </mat-card-subtitle>

            <form [formGroup]="requestForm">

                <!-- DATI DELLA RICHIESTA -->
                <div class="form-section">

                    <!-- Mese di riferimento -->
                    <mat-form-field appearance="outline">

                        <mat-label>Reference Month</mat-label>
                        <input matInput type="month" formControlName="referenceMonth">
                        <!-- formControlName è utilizzato per collegare il campo del form al FormGroup corrispondente. 
                         In questo caso, collega l'input "referenceMonth" al FormGroup "requestForm". -->

                    </mat-form-field>


                    <!-- Note del dipendente -->
                    <mat-form-field appearance="outline">

                        <mat-label>Employee Note</mat-label>
                        <textarea matInput rows="3" formControlName="noteEmployee">
                        <!-- rows indica il numero di righe visibili del textarea -->
                    </textarea>

                    </mat-form-field>

                    
                    <!-- Linea divisoria -->
                    <mat-divider></mat-divider>


                    <!-- SPESE -->
                    <div class="expenses-header">

                        <h3>Expenses</h3>
                        <button mat-raised-button color="primary" type="button" (click)="addExpense()">
                            Add Expense
                        </button>

                    </div>

                    <!-- La differenza tra formControlName e formArrayName è che formControlName viene utilizzato per collegare un singolo controllo del form a un FormGroup, mentre formArrayName viene utilizzato per collegare un array di controlli del form a un FormArray all'interno del FormGroup. -->

                    <div formArrayName="expenses" class="expenses-section">

                        @for (expense of expenses.controls;
                        track expense) {
                        <!-- "track expense": Poiché ogni FormGroup è un oggetto diverso, Angular riuscirà a identificare correttamente quale elemento è stato eliminato. -->


                        <div class="expense-grid">

                            <app-progress-bar [category]="expenseProgressData()[$index]?.category"
                                [amount]="expenseProgressData()[$index]?.amount || 0"></app-progress-bar>


                            <div [formGroupName]="$index" class="expenses-card">

                                <!-- Data della spesa -->
                                <mat-form-field appearance="outline">

                                    <mat-label>Date</mat-label>
                                    <input matInput type="date" formControlName="date">

                                </mat-form-field>


                                <!-- Categoria della spesa -->
                                <mat-form-field appearance="outline">

                                    <mat-label>Category</mat-label>

                                    <mat-select formControlName="category">

                                        <mat-option value="TAXI">Taxi</mat-option>
                                        <mat-option value="TRAIN">Train</mat-option>
                                        <mat-option value="MEAL">Meal</mat-option>
                                        <mat-option value="HOTEL">Hotel</mat-option>
                                        <mat-option value="FUEL">Fuel</mat-option>
                                        <mat-option value="OTHER">Other</mat-option>

                                    </mat-select>

                                </mat-form-field>


                                <!-- Descrizione della spesa -->
                                <mat-form-field appearance="outline">

                                    <mat-label>Description</mat-label>
                                    <textarea matInput formControlName="description" rows="1">
                                    </textarea>
                                    <!-- Posso usare input type="text" al posto del textarea se voglio che la descrizione sia su una sola riga -->


                                </mat-form-field>


                                <!-- Importo richiesto -->
                                <mat-form-field appearance="outline">

                                    <mat-label>Amount (€)</mat-label>
                                    <input matInput type="number" formControlName="requestedAmount" min="0">

                                </mat-form-field>

                                <!-- Pulsante per rimuovere la spesa corrente -->
                                <button mat-icon-button color="warn" type="button" (click)="removeExpense($index)"
                                    matTooltip="Remove Expense" matTooltipPosition="above" class="remove-btn">
                                    <mat-icon>delete</mat-icon>
                                </button>
                            </div>
                        </div>

                        }
                    </div>


                    <!-- Linea divisoria -->
                    <mat-divider></mat-divider>


                    <!-- TOTAL -->
                    <div class="total-section">

                        <mat-card-subtitle>
                            Total Requested
                            <mat-icon>payments</mat-icon>
                        </mat-card-subtitle>

                        <strong>
                            {{ totalAmount | number: '1.2-2' }} €
                        </strong>
                    </div>

                    <div class="expense-grid">
                        <app-total-progress-bar [allowedAmount]="totalAllowedAmount()"
                            [requestedAmount]="totalRequestedAmount()"></app-total-progress-bar>
                    </div>


                    <!-- ACTIONS -->
                    <div class="actions">

                        <button mat-stroked-button routerLink="/employee/dashboard" class="cancel-btn">
                            Cancel
                        </button>

                        <button mat-stroked-button type="button" (click)="saveDraft()">
                            Save Draft
                        </button>

                        <button mat-raised-button color="primary" (click)="submitRequest()">
                            Submit Request
                        </button>

                    </div>
                </div>

            </form>

        </mat-card-content>

    </mat-card>
</div>
```