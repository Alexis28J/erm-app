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


                            <!-- METODO CON ROUTERLINK -->
                            <!-- <button mat-menu-item routerLink="/employee/request-details/{{request.id}}"> -->

                            <!-- O CON IL METODO VIEW DETAILS --> 
                            <button mat-menu-item (click)="viewDetails(request.id)">

                            View Details

                        </button>

                        
                        @if (request.status === 'DRAFT') {
                            
                        <button mat-raised-button [matMenuTriggerFor]="menu" color="primary">
                            Options <mat-icon>arrow_drop_down</mat-icon>
                        </button>

                        <mat-menu #menu="matMenu">

                            <button mat-menu-item>
                                View Details
                            </button>

                            <button mat-menu-item
                                    routerLink="/employee/edit-request/{{request.id}}">
                            <!-- Utilizzo {{}} per interpolare l'ID della richiesta nell'URL perché Angular non supporta la concatenazione diretta nelle direttive routerLink.
                                 Quindi sarebbe stato sbagliato concatenare direttamente l'ID nella direttiva routerLink: routerLink="/employee/edit-request/" + request.id -->
                            <!-- Se invece di utilizzare l'interpolazione avesse usato /:id nell'URL, avrebbe dovuto passare l'ID come parametro separato nel routerLink, ad esempio: routerLink="/employee/edit-request/:id" [queryParams]="{ id: request.id }". 
                                  Entrambe le soluzioni sono valide a seconda del contesto. Ad esempio, l'interpolazione è più semplice e diretta, mentre l'uso di /:id con queryParams può essere utile in scenari più complessi. -->
                                  
                                Edit
                            </button>

                            <button mat-menu-item
                                    color="warn"
                                    (click)="deleteRequest(request.id)">

                                Delete
                            </button>

                        </mat-menu>

                    }

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