# COMMENTI

```HTML
<!---------------------------------------- SEZIONE DELLE SPESE ---------------------------------------->
<mat-card #focusCard tabindex="-1" role="section">
        <!-- #focusCard è il riferimento al titolo della card, usato per il focus -->
        <!-- Il focus può essere impostato su questo elemento quando si salta al contenuto principale. In questo caso, il focus sarà sul titolo della card -->
        <!-- tabindex="-1" permette di rendere l'elemento focusabile tramite script (ad esempio con element.focus()) ma non tramite tabulazione (tasto Tab) -->
        <!-- role="section" indica che questo elemento rappresenta una sezione della pagina -->

    <div [formGroup]="form()">

        <div formArrayName="expenses">

            <div class="expenses-header">

                <mat-card-subtitle>Expenses
                    <mat-icon>receipt</mat-icon>
                </mat-card-subtitle>

                <!-- Pulsante per aggiungere una nuova spesa -->
                <button mat-raised-button color="primary" type="button" (click)="addExpense.emit()">
                    Add Expense
                    <mat-icon>add</mat-icon>
                </button>

            </div>


            <div class="expenses-list">

                <!-- CICLO SULLE SPESE DEL FORM -->
                @for (expense of expenses().controls; track $index; let expenseIndex = $index) {

                <!-- CARD DI OGNI SINGOLA SPESA -->
                <div class="expense-grid">

                    <app-progress-bar [category]="expenseProgressData()[$index]?.category"
                        [amount]="expenseProgressData()[$index]?.amount || 0" [maxAmount]="getMaxAmount(expenseProgressData()[$index]?.category ?? '')"></app-progress-bar>
                    <!-- [$index] viene preso dall'iterazione sul form array delle spese. Le parentesi quadre indicano l'indice corrente della spesa all'interno dell'array. -->

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
                                <mat-option value="" disabled>Select a category</mat-option>
                                <!-- <mat-option value="TAXI">Taxi</mat-option>
                                <mat-option value="TRAIN">Train</mat-option>
                                <mat-option value="MEAL">Meal</mat-option>
                                <mat-option value="HOTEL">Hotel</mat-option>
                                <mat-option value="FUEL">Fuel</mat-option>
                                <mat-option value="OTHER">Other</mat-option> -->
                                @for (
                                category of expenseCategories();
                                track category.id
                                ) {

                                <mat-option [value]="category.name">
                                    {{ category.name }}
                                </mat-option>
                                
                                }
                            </mat-select>

                        </mat-form-field>


                        <!-- Campo per la descrizione della spesa -->
                        <mat-form-field appearance="outline">

                            <mat-label>Description</mat-label>
                            <textarea matInput formControlName="description" rows="1">
                  </textarea>

                        </mat-form-field>

                        <mat-form-field appearance="outline">

                            <!-- Campo per l'importo richiesto -->
                            <mat-label>Amount</mat-label>
                            <input matInput type="number" formControlName="requestedAmount" min="0">

                        </mat-form-field>

                        <!-- Pulsante per rimuovere la spesa corrente -->
                        <button mat-icon-button color="warn" type="button" (click)="removeExpense.emit($index)"
                            class="remove-btn" matTooltip="Remove all" matTooltipPosition="above">
                            <mat-icon>delete</mat-icon>
                        </button>

                    </div>


                    <!-- PULSANTE ALLEGA FILE -->
                    <div class="attachment-btn">

                        <button mat-raised-button type="button" color="primary" (click)="fileInput.click()">
                            Attach File
                            <mat-icon>attach_file</mat-icon>
                        </button>

                        <input hidden #fileInput type="file" multiple (change)="filesSelected.emit(
                    {
                        event: $event, 
                        index: $index
                    })" accept=".pdf,.jpg,.jpeg,.png">

                    </div>


                    <!-- Elenco dei file allegati per la spesa corrente -->
                    @for(
                    attachment of expenses().at(expenseIndex).value.attachments ?? [];
                    track attachment.fileName;
                    let attachmentIndex = $index;
                    ) {

                    <div class="file-row">

                        <app-attachment-list [attachments]="[attachment]"
                            matTooltip="Click in to view the attached file"
                            matTooltipPosition="right"></app-attachment-list>

                        <!-- Pulsante per rimuovere il file allegato corrente -->
                        <button mat-icon-button color="warn" type="button" (click)="removeAttachment.emit({
                    expenseIndex,
                    attachmentIndex
                  })" matTooltip="Remove file" matTooltipPosition="left" class="remove-btn">
                            <mat-icon>cancel</mat-icon>
                        </button>

                    </div>

                    <!-- Linea divisoria per gli allegati -->
                    <div class="attachment-divider"></div>

                    }

                </div>

                }

            </div>

        </div>
    </div>
</mat-card>
```