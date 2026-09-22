# COMMENTI

```HTML
<div class="container">

    <mat-card>

        <!--  HEADER DELLA CARD -->
        <mat-card-header>

            <!-- TITOLO DELLA CARD -->
            <mat-card-title>
                Refund Requests
                <mat-icon>list</mat-icon>
            </mat-card-title>

        </mat-card-header>


        <mat-card-content>

            @if(requests().length === 0) {

            <!-- Messaggio visualizzato quando non ci sono richieste -->
            <div class="no-found">
                <span> No requests found❗</span>
            </div>

            } @else {

            <table mat-table [dataSource]="dataSource" matSort>
                <!-- [dataSource] è la fonte dei dati per la tabella, in questo caso è collegata alla proprietà dataSource del componente. -->
                <!-- Quindi [dataSource]="dataSource" indica che la tabella utilizza la proprietà dataSource del componente come fonte dei dati. -->
                <!-- Mentre [dataSource]="requests()" utilizzerebbe direttamente il signal delle richieste come fonte dei dati. -->
                <!-- La differenza principale è che utilizzando dataSource si può sfruttare la funzionalità di ordinamento e filtraggio della tabella di Angular Material. -->

                <!-- Mese di riferimento -->
                <ng-container matColumnDef="month">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>
                        Month
                    </th>

                    <td mat-cell *matCellDef="let request">
                        {{ request.referenceMonth }}
                    </td>
                </ng-container>

                <!-- Data di creazione -->
                <ng-container matColumnDef="creationDate">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>
                        Creation Date
                    </th>

                    <td mat-cell *matCellDef="let request">
                        {{ request.creationDate | date:'yyyy-MM-dd' }}
                    </td>
                </ng-container>

                <!-- Importo totale richiesto -->
                <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header="amount">
                        Requested Amount
                    </th>

                    <td mat-cell *matCellDef="let request">
                        {{ request.totalRequestedAmount }} €
                    </td>
                </ng-container>

                <!-- Status -->
                <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>
                        Status
                    </th>

                    <td mat-cell *matCellDef="let request">
                        <span [ngClass]="request.status.toLowerCase()">

                            @if (request.status === 'PARTIAL_APPROVED') {
                            Partial Approved
                            }

                            @if (request.status === 'APPROVED') {
                            Approved
                            }
                            @if (request.status === 'REJECTED') {
                            Rejected
                            }
                            @if (request.status === 'DRAFT') {
                            Draft
                            }
                            @if (request.status === 'PENDING') {
                            Pending
                            }
                            @if( request.status === 'IN_PROGRESS') {
                            In Progress
                            }

                        </span>
                    </td>
                </ng-container>

                <!-- Actions -->
                <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>
                        Actions
                    </th>

                    <td mat-cell *matCellDef="let request">
                        <button mat-raised-button color="primary" (click)="viewDetails(request.id)">
                            View Details
                        </button>
                    </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns">
                </tr>

                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            </table>

            }

        </mat-card-content>

    </mat-card>

    <div class="navigation-buttons">
        <button mat-raised-button color="accent" routerLink="/hr/dashboard">
            Back to the Dashboard
            <mat-icon>arrow_back</mat-icon>
        </button>

        <button mat-raised-button color="accent" routerLink="/hr/employee-list">
            See the Employee List
            <mat-icon>arrow_forward</mat-icon>
        </button>
    </div>

</div>
```
