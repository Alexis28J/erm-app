# COMMENTI

```HTML
    <mat-card-content>

        <table mat-table [dataSource]="dataSource" matSort>
        <!-- [dataSource] è la fonte dei dati per la tabella, in questo caso è collegata alla proprietà dataSource del componente. -->
        <!-- Quindi [dataSource]="dataSource" indica che la tabella utilizza la proprietà dataSource del componente come fonte dei dati. -->
        <!-- Mentre [dataSource]="requests()" utilizzerebbe direttamente il signal delle richieste come fonte dei dati. -->
        <!-- La differenza principale è che utilizzando dataSource si può sfruttare la funzionalità di ordinamento e filtraggio della tabella di Angular Material. -->

            <!-- Reference Month -->

            <ng-container matColumnDef="referenceMonth">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                    Month
                </th>

                <td mat-cell *matCellDef="let request">
                    {{ request.referenceMonth }}
                </td>
            </ng-container>

            <!-- Creation Date -->

            <ng-container matColumnDef="creationDate">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                    Creation Date
                </th>

                <td mat-cell *matCellDef="let request">
                    {{ request.creationDate | date:'yyyy-MM-dd' }}
                </td>
            </ng-container>

            <!-- Status -->

            <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                    Status
                </th>

                <td mat-cell *matCellDef="let request">

                    <span class="status-badge" [ngClass]="request.status.toLowerCase()">

                    @if (request.status === 'PARTIAL_APPROVED') {
                    Partial Approved
                    }
                    @if (request.status === 'APPROVED') {
                    Approved
                    }
                    @if (request.status === 'REJECTED') {
                    Rejected
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

            <!-- Requested Amount -->

            <ng-container matColumnDef="requestedAmount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header="requestedAmount">
                    Requested
                </th>

                <td mat-cell *matCellDef="let request">
                    {{ request.totalRequestedAmount | number:'1.2-2' }} €
                </td>
            </ng-container>

            <!-- Approved Amount -->

            <ng-container matColumnDef="approvedAmount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header="approvedAmount">
                    Approved
                </th>

                <td mat-cell *matCellDef="let request">
                    {{ request.totalApprovedAmount ?? 0 | number:'1.2-2' }} €
                </td>
            </ng-container>

            <!-- Actions -->

            <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>
                    Actions
                </th>

                <td mat-cell *matCellDef="let request">

                    <button mat-raised-button color="primary" [routerLink]="['/hr/request-details', request.id]">

                <!-- Perché routerLink ha bisogno delle parentesi quadre? Risposta: Le parentesi quadre indicano che stiamo passando un array di segmenti di percorso come input binding, permettendo di costruire dinamicamente l'URL. -->

                        View

                    </button>

                </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns">
            </tr>

            <tr mat-row *matRowDef="let row; columns: displayedColumns">
            </tr>

        </table>

        @if (requests().length === 0) {

        <div class="no-found">

            <p>No requests found❗</p>

        </div>

        }

    </mat-card-content>
```