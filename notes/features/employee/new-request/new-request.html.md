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
        </mat-card-header>


        <!-- CONTENUTO DELLA CARD -->
        <mat-card-content>

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
                        <input matInput formControlName="description">

                    </mat-form-field>


                    <!-- Importo richiesto -->
                    <mat-form-field appearance="outline">

                        <mat-label>Amount (€)</mat-label>
                        <input matInput type="number" formControlName="requestedAmount" min="0">
                    
                    </mat-form-field>


                    <!-- Pulsante per rimuovere la spesa corrente -->
                    <button mat-icon-button color="warn" type="button" (click)="removeExpense($index)">
                        <mat-icon>delete</mat-icon>
                    </button>

                </div>

                }

            </div>


            <!-- TOTAL -->
            <div class="total-section">

                <span>Total Requested: </span>

                <strong>
                    {{ totalAmount }} €
                </strong>

            </div>


            <!-- ACTIONS -->
            <div class="actions">

                <button mat-stroked-button routerLink="/employee/request-list">
                    Cancel
                </button>


                <button mat-raised-button color="primary" (click)="onSubmit()">
                    Save Requests
                </button>

            </div>

                </div>

            </form>



        </mat-card-content>

    </mat-card>

</div>
```