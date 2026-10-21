# COMMENTI

```HTML
<!-- TEMPLATE ORIGINALE CHE ERA NEL COMPONENTE PADRE -->

    <!-- QUANTITÀ TOTALE RICHIESTA -->
    <mat-card class="space">

        <mat-card-header class="overview-header">
            <mat-card-title>
                Total Requested Amount
                <mat-icon>paid</mat-icon>
            </mat-card-title>
        </mat-card-header>

        <mat-card-content>
            <div class="expense-container">
                <app-total-progress-bar [requestedAmount]="totalRequestedAmount()"
                    [allowedAmount]="totalAllowedAmount()">
                </app-total-progress-bar>
            </div>
        </mat-card-content>

    </mat-card>


    <!--  QUANTITÀ TOTALE APPROVATA -->
    <mat-card>

        <mat-card-header class="overview-header">
            <mat-card-title>
                Total Approved Amount
                <mat-icon>check_circle</mat-icon>
            </mat-card-title>
        </mat-card-header>

        <mat-card-content>
            <div class="total-card">
                <!-- <div class="total-label">Approved Total:</div> -->
                <div class="total-amount">{{ approvedTotal() | number:'1.2-2' }} €</div>
            </div>
        </mat-card-content>

    </mat-card>
 ```


 ```HTML
<!-- VERSIONE LEGGERMENTE MODIFICATA PER IL COMPONENTE FIGLIO (DUMB COMPONENT) -->
     <!-- QUANTITÀ TOTALE RICHIESTA -->
    <mat-card class="space">

        <mat-card-header class="overview-header">
            <mat-card-title>
                Total Requested Amount
                <mat-icon>paid</mat-icon>
            </mat-card-title>
        </mat-card-header>

        <mat-card-content>
            <div class="expense-container">
                <app-total-progress-bar [requestedAmount]="requestedAmount()"
                    [allowedAmount]="allowedAmount()">
                </app-total-progress-bar>
            </div>
        </mat-card-content>

    </mat-card>


    <!-- QUANTITÀ TOTALE APPROVATA -->
    <mat-card>

        <mat-card-header class="overview-header">
            <mat-card-title>
                Total Approved Amount
                <mat-icon>check_circle</mat-icon>
            </mat-card-title>
        </mat-card-header>

        <mat-card-content>
            <div class="total-card">
                <div class="total-amount">{{ allowedAmount() | number:'1.2-2' }} €</div>
            </div>
        </mat-card-content>

    </mat-card>
  ```