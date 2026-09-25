# COMMENTI

```HTML
<!-- CONTROLLA SE LA RICHIESTA ESISTE -->
<!-- Può essere necessario controllare se la richiesta esiste prima di visualizzare il modulo -->
@if (request(); as requestData) {

<!-- CONTENITORE PRINCIPALE -->
<div class="page-container">

  <!-- TITOLO DELLA PAGINA -->
  <div class="edit-request-header">

    <mat-card-title>Edit Request</mat-card-title>
    <mat-icon>edit_document</mat-icon>

    @if (formError) {
    <span class="error-message">{{ formError }}</span>
    }

  </div>


  <!---------------------------- SEZIONE DI DETTAGLI DELLA RICHIESTA -------------------------->
  <!---------------------------- SEZIONE DI DETTAGLI DELLA RICHIESTA -------------------------->
  <form [formGroup]="requestForm">

    <div class="form-section">

      <!-- CARD DI EDIT REQUEST -->
      <mat-card>

        <mat-card-subtitle>
          Request Details
          <mat-icon>info</mat-icon>
        </mat-card-subtitle>

        <mat-card-content>

          <!-- Mese di riferimento della richiesta -->
          <mat-form-field appearance="outline">

            <mat-label>Reference Month</mat-label>
            <input matInput type="month" formControlName="referenceMonth">

          </mat-form-field>

          <!-- Note del dipendente -->
          <mat-form-field appearance="outline">

            <mat-label>Employee Notes</mat-label>
            <textarea matInput rows="4" formControlName="noteEmployee">
            </textarea>

          </mat-form-field>

          <!-- Informazioni sulla richiesta -->
          <div class="request-info">

            <p>
              <strong>Status:</strong>
              {{ requestData.status }}
            </p>

            <p>
              <strong>Created:</strong>
              {{ requestData.creationDate | date:'yyyy-MM-dd' }}
            </p>

            <p>
              <strong>Last Update:</strong>
              {{ requestData.lastUpdateDate | date:'yyyy-MM-dd' }}
            </p>

          </div>

        </mat-card-content>

      </mat-card>


      <!---------------------------------- SEZIONE DELLE SPESE ------------------------------------->
      <mat-card>

        <div formArrayName="expenses">

          <div class="expenses-header">

            <mat-card-subtitle>Expenses
              <mat-icon>receipt</mat-icon>
            </mat-card-subtitle>

            <!-- Pulsante per aggiungere una nuova spesa -->
            <button mat-raised-button color="primary" type="button" (click)="addExpense()">
              Add Expense
            </button>

          </div>


          <div class="expenses-list">

            <!-- CICLO SULLE SPESE DEL FORM -->
            <!-- Per ogni spesa nel form, viene generata una card con i dettagli della spesa. 
             track $index indica l'indice corrente della spesa nel ciclo. Ad esempio, 
             $index può essere utilizzato per identificare univocamente ogni spesa all'interno del form array. -->

            <!-- CICLO SULLE SPESE DEL FORM -->
            @for (expense of expenses.controls; track $index) {

            <!-- CARD DI OGNI SINGOLA SPESA -->
            <div class="expense-grid">

              <app-progress-bar [category]="expenseProgressData()[$index]?.category"
                [amount]="expenseProgressData()[$index]?.amount || 0"></app-progress-bar>

              <div [formGroupName]="$index" class="expenses-input">

                <!-- Data della spesa -->
                <mat-form-field appearance="outline">

                  <mat-label>Date</mat-label>

                  <input matInput type="date" formControlName="date">

                </mat-form-field>

                <!-- Categoria della spesa -->
                <mat-form-field appearance="outline">

                  <mat-label>Category</mat-label>

                  <mat-select formControlName="category">
                    <!-- per evitare l'autofocus automatico sul primo elemento della select, aggiungo un'opzione vuota -->
                    <mat-option value="" disabled>Select a category</mat-option>
                    <mat-option value="TAXI">Taxi</mat-option>
                    <mat-option value="TRAIN">Train</mat-option>
                    <mat-option value="MEAL">Meal</mat-option>
                    <mat-option value="HOTEL">Hotel</mat-option>
                    <mat-option value="FUEL">Fuel</mat-option>
                    <mat-option value="OTHER">Other</mat-option>

                  </mat-select>

                </mat-form-field>


                <!-- Campo per la descrizione della spesa -->
                <mat-form-field appearance="outline">

                  <mat-label>Description</mat-label>
                  <textarea matInput formControlName="description" rows="1">
                    <!-- Posso usare input type="text" al posto del textarea se voglio che la descrizione sia su una sola riga -->
                  </textarea>

                </mat-form-field>

                <mat-form-field appearance="outline">

                  <!-- Campo per l'importo richiesto -->
                  <mat-label>Amount</mat-label>
                  <input matInput type="number" formControlName="requestedAmount" min="0">

                </mat-form-field>

                <!-- Pulsante per rimuovere la spesa corrente -->
                <button mat-icon-button color="warn" type="button" (click)="removeExpense($index)" class="remove-btn"
                  matTooltip="Remove Expense" matTooltipPosition="above">
                  <mat-icon>delete</mat-icon>
                </button>

              </div>

            </div>

            }

          </div>

        </div>

      </mat-card>


      <!-------------------------------- SEZIONE DI RIEPILOGO DEL TOTALE RICHIESTO --------------------------------->
      <mat-card>

        <div class="total-amount">
          <mat-card-subtitle>
            Total Requested Amount
            <mat-icon>payments</mat-icon>
          </mat-card-subtitle>

          <span>
            {{ totalRequestedAmount() | number:'1.2-2' }} €
          </span>
        </div>

        <div class="total-expense-container">

          <div class="total-expense-grid">

            <app-total-progress-bar [allowedAmount]="totalAllowedAmount()" [requestedAmount]="totalRequestedAmount()">
            </app-total-progress-bar>

          </div>

        </div>

      </mat-card>

      <div class="actions">

        <!-- Pulsante per tornare indietro -->
        <div class="back-btn">
          <button mat-stroked-button color="primary" type="button" routerLink="/employee/request-list">
            Back to Request List
            <mat-icon>arrow_back</mat-icon>
          </button>
        </div>

        <!-- Pulsante per salvare la richiesta come bozza -->
        <!-- Il tipo mat-stroked-button indica che il pulsante avrà uno stile con bordo tratteggiato -->
        <button mat-stroked-button color="primary" type="button" (click)="saveDraft()">

          Save Draft

        </button>

        <!-- Pulsante per inviare la richiesta -->
        <!-- Il tipo mat-raised-button indica che il pulsante avrà uno stile con bordo pieno -->
        <!-- Questo dettaglio è utile per distinguere visivamente i pulsanti di invio dalle altre azioni -->
        <button mat-raised-button color="accent" type="button" (click)="submitRequest()">

          Submit Request

        </button>

      </div>

    </div>

  </form>

</div>

} @else {

<div class="loading-spinner centered-spinner">
  <mat-spinner></mat-spinner>
</div>

}
```