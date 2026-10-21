# COMMENTI

```HTML
    <!-- TEMPLATE ORIGINALE CHE ERA NEL COMPONENTE PADRE -->

    <!-- PULSANTI ACTIONS -->
    <div class="actions">

        <!-- PULSANTI DI APPROVAZIONE E RIFIUTO VISIBILI SOLO IN MODALITÀ DI REVISIONE -->
        @if (reviewMode()) {

        <!-- <button mat-raised-button color="warn" (click)="rejectRequest()" class="reject-btn"
            [disabled]="request.status === 'REJECTED'">
            Reject
        </button> -->

        <!-- <button mat-raised-button color="warn" (click)="approveRequest()" class="approve-btn"
            [disabled]="request.status === 'APPROVED'">
            Approve
        </button> -->

        <!-- Per tornare al modo di visualizzazione normale, il pulsante "Return to View Mode" deve impostare reviewMode() a false -->
        <button mat-stroked-button (click)="reviewMode.set(false)">
            Return to View Mode
            <mat-icon>cancel</mat-icon>
        </button>

        <div class="reject-approve">
            <button mat-raised-button color="warn" (click)="rejectRequest()" class="reject-btn"
                [disabled]="request.status === 'REJECTED'">
                Reject
                <mat-icon>thumb_down</mat-icon>
            </button>

            <button mat-raised-button color="warn" (click)="approveRequest()" class="approve-btn"
                [disabled]="request.status === 'APPROVED'">
                Approve
                <mat-icon>thumb_up</mat-icon>
            </button>

        }


        <!-- PULSANTE DI MODIFICA DELLA REVIEW -->
        @if (
        request.status === 'APPROVED' ||
        request.status === 'PARTIAL_APPROVED' ||
        request.status === 'REJECTED'
        ) {

        <button mat-raised-button color="accent" (click)="startReview()" [hidden]="reviewMode()" class="edit-btn">

            Edit Review

            <mat-icon>
                edit
            </mat-icon>

        </button>

        }


        <!-- PULSANTE DI VERIFICA DELLA RICHIESTA -->
        @if (!reviewMode()) {

        <button mat-raised-button color="primary" (click)="startReview()"
            [hidden]="request.status === 'APPROVED' || request.status === 'PARTIAL_APPROVED' || request.status === 'REJECTED'" class="verify-btn">
            Verify Request

            <mat-icon>
                fact_check
            </mat-icon>

        </button>

        }

    </div>
```



```HTML
<!-- VERSIONE LEGGERMENTE MODIFICATA PER IL COMPONENTE FIGLIO (DUMB COMPONENT) -->

<!-- PULSANTI ACTIONS -->
<div class="actions">

    <!-- PULSANTI DI APPROVAZIONE E RIFIUTO VISIBILI SOLO IN MODALITÀ DI REVISIONE -->
    @if (reviewMode()) {

    <button mat-stroked-button (click)="exitReview.emit()" aria-label="Return to View Mode">
        Return to View Mode
        <mat-icon>cancel</mat-icon>
    </button>

    <div class="reject-approve">
        <button mat-raised-button color="warn" (click)="reject.emit()" class="reject-btn"
            [disabled]="request().status === 'REJECTED'" aria-label="Reject this request">
            Reject
            <mat-icon>thumb_down</mat-icon>
        </button>

        <button mat-raised-button color="warn" (click)="approve.emit()" class="approve-btn"
            [disabled]="request().status === 'APPROVED'" aria-label="Approve this request">
            Approve
            <mat-icon>thumb_up</mat-icon>
        </button>
    </div>

    }


    <!-- CONTROLLO IN CASO DI NON MODALITÀ DI REVISIONE -->
    @if (!reviewMode()) {


    <!-- Pulsante per tornare alla lista delle richieste -->
    <button mat-raised-button color="primary" routerLink="/hr/request-list" aria-label="Go to Request List area">
        Request List
        <mat-icon>list</mat-icon>
    </button>


    <!-- Pulsante di verifica della richiesta -->
    <button mat-raised-button color="primary" (click)="startReview.emit()"
        [hidden]="request().status === 'APPROVED' || request().status === 'PARTIAL_APPROVED' || request().status === 'REJECTED'"
        class="verify-btn" aria-label="Verify Request">
        Verify Request

        <mat-icon>
            fact_check
        </mat-icon>
    </button>

    <!-- Pulsante di modifica della review -->
    @if (
    request().status === 'APPROVED' ||
    request().status === 'PARTIAL_APPROVED' ||
    request().status === 'REJECTED'
    ) {

    <button mat-raised-button color="accent" (click)="startReview.emit()" [hidden]="reviewMode()" class="edit-btn"
        aria-label="Edit Review">
        Edit Review
        <mat-icon>
            edit
        </mat-icon>
    </button>

    }


    <!-- Pulsante per accedere alla lista dei dipendenti -->
    <button mat-raised-button color="primary" routerLink="/hr/employee-list" aria-label="Go to Employee List area">
        Employee List
        <mat-icon>people</mat-icon>
    </button>

    }

</div>
```