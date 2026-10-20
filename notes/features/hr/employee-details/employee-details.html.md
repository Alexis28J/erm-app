# COMMENTI

```HTML

<!-- employee() significa che stiamo accedendo ai dettagli dell'impiegato corrente.
as employee significa che stiamo creando un alias locale per l'impiegato corrente.
Quindi "Se employee() è definito, allora possiamo accedere ai dettagli dell'impiegato tramite l'alias employee" -->
<!-- L'alias employee può essere utilizzato all'interno di questo blocco per accedere ai dettagli dell'impiegato corrente.
Questo ci permette di evitare di dover chiamare employee() ripetutamente all'interno del blocco. -->


@if (employee(); as employee) {
<!-- Se l'oggetto employee è disponibile. Può darsi che non lo sia ancora se i dati non sono stati caricati. -->
<!-- Questo controllo serve a evitare errori nel template quando i dati non sono ancora pronti. -->

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


<!-- STATISTICHE DEL DIPENDENTE (Employee Statistics) -->
<app-employee-statistics></app-employee-statistics>


<!-- STORICO DELLE RICHIESTE (Request History) -->
<app-employee-request-history></app-employee-request-history>

}

<button mat-raised-button color="accent" routerLink="/hr/employee-list">
    Back to Employee List
    <mat-icon>arrow_back</mat-icon>
</button>
```


<!-- ////////////////////////////////////////////////////////////////////////////////////////////////////////


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
``` -->