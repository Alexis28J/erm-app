# COMMENTI

```HTML
<!-- employee() significa che stiamo accedendo ai dettagli dell'impiegato corrente.
         as employee significa che stiamo creando un alias locale per l'impiegato corrente.
         Quindi "Se employee() è definito, allora possiamo accedere ai dettagli dell'impiegato tramite l'alias employee" -->
<!-- L'alias employee può essere utilizzato all'interno di questo blocco per accedere ai dettagli dell'impiegato corrente.
          Questo ci permette di evitare di dover chiamare employee() ripetutamente all'interno del blocco. -->

@if (employee(); as employee) {

<mat-card class="employee-card">

    <mat-card-header>
        <mat-card-title>
            Employee Details
            <mat-icon>assignment_ind</mat-icon>
        </mat-card-title>
    </mat-card-header>


    <mat-card-content>

        <div class="employee-info">

            <!-- Codice del dipendente -->
            <p>
                <strong>Employee Code: </strong>
                {{ employee.employeeCode }}
            </p>


            <!-- Nome (e cognome) del dipendente -->
            <p>
                <strong>Name:</strong>
                {{ employee.name }}
                {{ employee.surname }}
            </p>


            <!-- Email -->
            <p>
                <strong>Email:</strong>
                {{ employee.email }}
            </p>


            <!-- Status -->
            <p>
                <strong>Status:</strong>
                <span class="badge" [class.active]="employee.active" [class.inactive]="!employee.active">
                    {{ employee.active ? 'Active' : 'Inactive' }}
                </span>
            </p>

        </div>

    </mat-card-content>

</mat-card>

<mat-card class="stats-card">

    <mat-card-header>
        <mat-card-title>
            Statistics
            <mat-icon>bar_chart</mat-icon>
        </mat-card-title>
    </mat-card-header>


    <mat-card-content>

        <div class="stats-grid">

            <!-- Richieste totali -->
            <div class="stat-item total-requests">
                <h3>{{ totalRequests() }}</h3>
                <p>Total Requests</p>
            </div>


            <!-- Richieste approvate -->
            <div class="stat-item approved-requests">
                <h3>{{ approvedRequests() }}</h3>
                <p>Approved Requests</p>
            </div>


            <!-- Richieste rifiutate -->
            <div class="stat-item rejected-requests">
                <h3>{{ rejectedRequests() }}</h3>
                <p>Rejected Requests</p>
            </div>


            <!-- Richieste in attesa -->
            <div class="stat-item pending-requests">
                <h3>{{ pendingRequests() }}</h3>
                <p>Pending Requests</p>
            </div>


            <!-- Quantità totale richiesta -->
            <div class="stat-item total-requested-amount">
                <h3>{{ totalRequestedAmount() | number: '1.2-2'}} €</h3>
                <p>Total Requested</p>
            </div>


            <!-- Quantità totale approvata -->
            <div class="stat-item total-approved-amount">
                <h3>{{ totalApprovedAmount() | number: '1.2-2'}} €</h3>
                <p>Total Approved</p>
            </div>

        </div>

    </mat-card-content>

</mat-card>


    <mat-card-content>

        <table mat-table [dataSource]="requests().filter(request => request.status !== 'DRAFT')" class="history-table">
        <!-- predicate value è un filtro per escludere le richieste con stato "DRAFT" -->
        <!-- In questo modo, nella tabella verranno visualizzate solo le richieste che non sono in stato "DRAFT" -->

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
                    {{ request.creationDate | date:'yyyy-MM-dd' }}
                </td>
            </ng-container>

            <!-- Status -->

            <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>
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
                <th mat-header-cell *matHeaderCellDef>
                    Requested
                </th>

                <td mat-cell *matCellDef="let request">
                    {{ request.totalRequestedAmount | number:'1.2-2' }} €
                </td>
            </ng-container>

            <!-- Approved Amount -->

            <ng-container matColumnDef="approvedAmount">
                <th mat-header-cell *matHeaderCellDef>
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

        <div class="empty-state">

            <mat-icon>receipt_long</mat-icon>

            <p>
                No reimbursement requests found
            </p>

        </div>

        }

    </mat-card-content>

</mat-card>

}


<button mat-raised-button color="accent" routerLink="/hr/employee-list">
    Back to Employee List
    <mat-icon>arrow_back</mat-icon>
</button>
```


////////////////////////////////////////////////////////////////////////////////////////////////////////


# MODIFICA SEZIONE "REQUEST HISTORY"

Ho deciso di sostituire il blocco di codice appartenente all'area Request History con altro che fa uso del componente MatTableModule. In questo modo ha coerenza visiva con il resto del sito.

``` HTML
<mat-card>

    <mat-card-header>
        <mat-card-title style="padding-bottom: 2rem;">
            Request History
            <mat-icon>history</mat-icon>
        </mat-card-title>
    </mat-card-header>


    <mat-card-content>
       <div class="request-history">
            @for (request of requests(); track request.id) {

            <!-- Escludo le richieste con stato 'DRAFT'. L'agente HR non dovrebbe visualizzarle -->
            @if (request.status !== 'DRAFT') {

            <div class="request-row">

                <span>{{ request.referenceMonth | date: 'yyyy-MM' }}</span>
                <span>{{ request.creationDate | date: 'yyyy-MM-dd' }}</span>

                <!-- <span>{{ request.status }}</span> -->
                <span class="status" [ngClass]="{
                'approved': request.status === 'APPROVED',
                'rejected': request.status === 'REJECTED',
                'pending': request.status === 'PENDING',
                'partial-approved': request.status === 'PARTIAL_APPROVED',
                'in-progress': request.status === 'IN_PROGRESS'
            }">
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

                <span>{{ request.totalRequestedAmount | number: '1.2-2'}} €</span>
                <span>{{ request.totalApprovedAmount | number: '1.2-2'}} €</span>

                <button mat-raised-button color="primary" [routerLink]="['/hr/request-details', request.id]">
                    View
                </button>
            <!-- Perché routerLink ha bisogno delle parentesi quadre? Risposta: Le parentesi quadre indicano che stiamo passando un array di segmenti di percorso come input binding, permettendo di costruire dinamicamente l'URL. -->

            </div>

            }

            }
            
        </div>

    </mat-card-content>

</mat-card>
```