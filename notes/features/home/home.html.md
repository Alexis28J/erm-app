# COMMENTI

```HTML
<!------------------- TOOLBAR ----------------------->
<mat-toolbar color="primary">

    <!-- Logo dell'applicazione -->
    <a routerLink="/login">
        <img src="https://techjobsfair.it/prod/wp-content/uploads/2022/10/DGS_logo.png" alt="ERM Logo" class="app-logo"
            matTooltip="BUILDING THE FUTURE" matTooltipPosition="right">
        <!-- Non aggiungo aria-label perché il tooltip fornisce già l'informazione, quindi sarebbe ridondante -->
    </a>


    <!-- Separatore -->
    <span class="spacer"></span>


    <!-- PULSANTE PER CAMBIARE LA LINGUA CORRENTE -->
    <button mat-icon-button (click)="languageService.toggleLanguage()" class="flag-btn"
        matTooltip="Change the language (Italian/English)" matTooltipPosition="left"
        aria-label="Click to change language. Available options: Italian and English">
        {{languageService.language() === 'it' ? '🇬🇧' : '🇮🇹'}}
    </button>


    <!-- Titolo dell'applicazione -->
    <h1 matTooltip="Service Mark" matTooltipPosition="right">J-E.R.M.℠</h1>


    <!-- Separatore -->
    <span class="spacer"></span>


    <!---------- PULSANTE "PERSONAL AREA" ----------->
    <button mat-button [matMenuTriggerFor]="loginMenu" class="personal-area" aria-label="Personal Area">
        <mat-icon>arrow_drop_down</mat-icon>
        <!-- Personal Area -->
        {{ 'home.navbar.personalArea' | translate }}
    </button>

</mat-toolbar>


<!-- MENU (TENDINA) DEL PULSANTE "PERSONAL AREA" -->
<mat-menu #loginMenu>

    <button mat-menu-item routerLink="/login" aria-label="Login">
        <mat-icon>login</mat-icon>
        <!-- Login -->
        {{ 'home.dashboard.login' | translate }}
    </button>

</mat-menu>


<!----------------------------------- CONTAINER DELLA HOME ------------------------------------>
<div class="home-container">

    <!----------------------------------- CARD PRINCIPALE ------------------------------------>
    <mat-card>

        <!---------- ICONA E TITOLO DELLA CARD ---------->
        <mat-card-header>
            <div class="card-icon">
                <mat-icon>request_page</mat-icon>
            </div>

            <mat-card-title>
                <!-- Expense Reimbursement Management -->
                {{ 'home.dashboard.title' | translate }}
            </mat-card-title>
        </mat-card-header>



        <!----------------------------- CONTENUTO DELLA CARD ------------------------------------>
        <mat-card-content>

            <!-- <p>This section allows employees to manage their expense reimbursement requests efficiently.</p>
            <p>Employees can submit requests, while the HR department can review and approve them.</p>
            <p>We hope this system will be beneficial for both employees and the HR department.</p> -->
            <!-- <p>Please, don't hesitate to provide feedback for further improvements.</p> -->
            <!-- <p>Thank you for using our system and have a great day!</p> -->

            <p>{{ 'home.dashboard.text1' | translate }}</p>
            <p>{{ 'home.dashboard.text2' | translate }}</p>
            <p>{{ 'home.dashboard.text3' | translate }}</p>
            <p>{{ 'home.dashboard.text4' | translate }}</p>

        </mat-card-content>

        <!----------------------------- AZIONI DELLA CARD ------------------------------------>
        <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/login" aria-label="Login (Start session)">
                <!-- Login -->
                {{ 'home.dashboard.login' | translate }}
                <mat-icon>login</mat-icon>
            </button>
        </mat-card-actions>

    </mat-card>


</div>
```