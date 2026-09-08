# COMMENTI


```HTML
<!-- CONTROLLO SE LA VARIABILE "request" È DEFINITA PRIMA DI VISUALIZZARE I DETTAGLI -->
<!-- request() è il signal che contiene i dettagli della richiesta; as request indica che il valore del signal sarà assegnato alla variabile "request" -->
<!-- In parole povere, questa condizione verifica se il signal "request" ha un valore definito prima di mostrare i dettagli della richiesta -->
<!-- Per esempio, se request() non ha un valore definito, il contenuto all'interno di questo blocco non verrà visualizzato -->
@if (request(); as request) {

<!-- CARD PRINCIPALE CHE MOSTRA I DETTAGLI DELLA RICHIESTA -->
<mat-card>

    <!-- HEADER DELLA CARD -->
    <mat-card-header>

        <!-- TITOLO DELLA CARD -->
        <mat-card-title>
            Request Details
        </mat-card-title>

    </mat-card-header>


    <!-- CONTENUTO DELLA CARD -->
    <mat-card-content>

        <div class="details-grid">
        <!-- Perché utilizziamo una griglia per i dettagli? Per separare le etichette dai valori in spazi dedicati.
        Altrimenti le etichette e i valori sarebbero disallineati e difficili da leggere -->

            <span class="label">
                Reference Month
            </span>

            <span class="value">
                {{ request.referenceMonth }}
            </span>

            <span class="label">
                Status
            </span>

            <span [ngClass]="request.status.toLowerCase()">
                <!-- Perché metto .toLowerCase()? Risposta: per far corrispondere la classe CSS con lo status in minuscolo -->
                <!-- {{ request.status | toLowerCase }} -->
                <!-- se voglio sostituire PARTIAL_APPROVED CON Partial Approved, posso farlo qui  -->
                <!-- {{ request.status === 'PARTIAL_APPROVED' ? 'Partial Approved' : request.status }} -->
                <!-- Ma se voglio fare lo stesso per altri status, avrei bisogno di utilizzare @if -->

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

            </span>

            <span class="label">
                Requested Amount
            </span>

            <span class="value">
                {{ request.totalRequestedAmount }} €
            </span>

            <span class="label">
                Approved Amount
            </span>

            <span class="value">
                {{ request.totalApprovedAmount }} €
            </span>

            <span class="label">
                Creation Date
            </span>

            <span class="value">
                {{ request.creationDate }}
            </span>

            <span class="label">
                Last Update
            </span>

            <span class="value">
                {{ request.lastUpdateDate }}
            </span>

        </div>

    </mat-card-content>

</mat-card>

}
```