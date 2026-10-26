# COMMENTI 

```HTML
<mat-card>

    <mat-card-header>
        <mat-card-title matTooltip="Manage expense limits and receipt requirements for each category"
            matTooltipPosition="right">
            Expense Limits
            <mat-icon>price_change</mat-icon>
        </mat-card-title>

        <button mat-raised-button color="primary" class="excel" (click)="fileInput.click()">
            Import Expense Limits
            <mat-icon>upload_file</mat-icon>
        </button>
        <input hidden #fileInput type="file" accept=".xlsx, .xls" (change)="importExpenseLimits($event)">
    </mat-card-header>


    <mat-card-content>

        <form [formGroup]="form">

            <table mat-table [dataSource]="expenseLimits.controls" class="equal-width-table">
                <!-- .controls sono i singoli form control per ogni riga della tabella -->
                <!-- Il dataSource è expenseLimits.controls che rappresenta i controlli del form array:
                     ogni riga della tabella corrisponde a un FormGroup all'interno del FormArray -->

                <ng-container matColumnDef="category">

                    <th mat-header-cell *matHeaderCellDef>
                        Category
                    </th>

                    <td mat-cell *matCellDef="let row">
                        {{ row.get('name')?.value }}
                    </td>

                </ng-container>


                <ng-container matColumnDef="maxAmount">

                    <th mat-header-cell *matHeaderCellDef matTooltip="Set the maximum amount for this category"
                        matTooltipPosition="above">
                        Max Amount
                    </th>

                    <td mat-cell *matCellDef="let row">
                        <input matInput type="number" [formControl]="row.get('maxAmount')">
                        <!-- row.get() indica che stiamo accedendo al controllo specifico all'interno del FormGroup della riga corrente -->
                         <!-- row indica il FormGroup corrente all'interno del FormArray -->
                    </td>

                </ng-container>

                <ng-container matColumnDef="receiptRequired">

                    <th mat-header-cell *matHeaderCellDef
                        matTooltip="Indicates if a receipt is required for this category" matTooltipPosition="above">
                        Receipt Required
                    </th>

                    <td mat-cell *matCellDef="let row">
                        <mat-checkbox [formControl]="row.get('receiptRequired')"></mat-checkbox>
                    </td>
                    <!-- Ricorda che i controlli del form sono quei singoli elementi all'interno di ogni FormGroup nel FormArray, e row.get('nomeControllo') ti permette di accedere a un controllo specifico all'interno del FormGroup corrente -->
                    <!-- Un FormGroup rappresenta una riga della tabella e contiene i controlli per quella riga -->

                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns">
                </tr>

            </table>

        </form>

    </mat-card-content>

</mat-card>


<div class="actions">
    <button mat-raised-button color="warn" routerLink="/hr/settings" class="cancel-btn">
        <mat-icon>cancel</mat-icon> Cancel
    </button>

    <button mat-raised-button color="primary" (click)="save()">
        <mat-icon>save</mat-icon> Save</button>
</div>
```