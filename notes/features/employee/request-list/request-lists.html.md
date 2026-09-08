# COMMENTI

``` HTML
<!-- CONTAINER PRINCIPALE -->
<div class="container">

    <!-- CARD PRINCIPALE CHE CONTIENE LA TABELLA DELLE RICHIESTE DI RIMBORSO -->
    <mat-card>

        <!--  HEADER DELLA CARD -->
        <mat-card-header>

            <!-- TITOLO DELLA CARD -->
            <mat-card-title>
                My Refund Requests
            </mat-card-title>

        </mat-card-header>


        <!-- CONTENUTO DELLA CARD -->
        <mat-card-content>

            <!-- Verifica se ci sono richieste di rimborso -->
            @if (requests().length > 0) {

            <table mat-table [dataSource]="dataSource">

                <!-- Reference Month -->
                <ng-container matColumnDef="referenceMonth">

                    <th mat-header-cell *matHeaderCellDef>

                        Month

                    </th>

                    <td mat-cell *matCellDef="let request">

                        {{ request.referenceMonth }}

                    </td>

                </ng-container>


                <!-- Creation Date -->
                <ng-container matColumnDef="creationDate">

                    <th mat-header-cell *matHeaderCellDef>

                        Creation Date

                    </th>

                    <td mat-cell *matCellDef="let request">

                        {{ request.creationDate }}

                    </td>

                </ng-container>


                <!-- Status -->
                <ng-container matColumnDef="status">

                    <th mat-header-cell *matHeaderCellDef>

                        Status

                    </th>

                    <td mat-cell *matCellDef="let request">

                        <span [ngClass]="request.status.toLowerCase()">
                            <!-- Perché metto .toLowerCase()? Risposta: per far corrispondere la classe CSS con lo status in minuscolo -->
                            <!-- {{ request.status | toLowerCase }} -->
                            <!-- se voglio sostituire PARTIAL_APPROVED CON Partial Approved, posso farlo qui  -->
                            <!-- {{ request.status === 'PARTIAL_APPROVED' ? 'Partial Approved' : request.status }} -->
                            <!-- Ma se voglio fare lo stesso per altri status, avrei bisogno di utilizzare @if -->

                            @if (request.status === 'PARTIAL_APPROVED') {
                            'Partial Approved'
                            }

                            @if (request.status === 'APPROVED') {
                            'Approved'
                            }
                            @if (request.status === 'REJECTED') {
                            'Rejected'
                            }
                            @if (request.status === 'DRAFT') {
                            'Draft'
                            }
                            @if (request.status === 'PENDING') {
                            'Pending'
                            }

                        </span>

                    </td>

                </ng-container>


                <!-- Requested Amount -->
                <ng-container matColumnDef="totalRequestedAmount">

                    <th mat-header-cell *matHeaderCellDef>

                        Requested Amount

                    </th>

                    <td mat-cell *matCellDef="let request">

                        {{ request.totalRequestedAmount }} €

                    </td>

                </ng-container>


                <!-- Approved Amount -->
                <ng-container matColumnDef="totalApprovedAmount">

                    <th mat-header-cell *matHeaderCellDef>

                        Approved Amount

                    </th>

                    <td mat-cell *matCellDef="let request">

                        {{ request.totalApprovedAmount }} €

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


                <!-- RIGA DELL'HEADER DELLA TABELLA -->
                <tr mat-header-row *matHeaderRowDef="displayedColumns">
                    <!-- *matHeaderRowDef è una direttiva strutturale utilizzata per definire la riga di intestazione (header row) di una tabella.
                     Quindi "displayedColumns" definisce quali colonne devono essere visualizzate nell'header della tabella e il loro ordine (da sinistra a destra). -->
                </tr>

                <!-- RIGA DEI DATI DELLA TABELLA -->
                <tr mat-row *matRowDef="
                            let row;
                            columns: displayedColumns
                        ">
                </tr>

            </table>

            } @else {

            <p>
                No reimbursement requests found.
            </p>

            }

        </mat-card-content>

    </mat-card>

</div>
```