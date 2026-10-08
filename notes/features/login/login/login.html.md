# COMMENTI

```HTML
<div class="login-container">

    <mat-card>

        <!-- HEADER DEL LOGIN CARD -->
        <mat-card-header>

            <!-- TITOLO E SOTTOTITOLO DEL LOGIN CARD -->
            <mat-card-title>
                Login to
            </mat-card-title>

            <mat-card-subtitle matTooltip="Service Mark" matTooltipPosition="above">
                J - E. R. M.℠
            </mat-card-subtitle>

            <span>Application</span>

        </mat-card-header>


        <!----------- CONTENUTO DEL LOGIN CARD ------------>
        <mat-card-content>

            <!----------------- FORM PER IL LOGIN --------------->
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">

                <!------------- CAMPO EMAIL --------------->
                <mat-form-field appearance="outline">

                    <mat-label>Email</mat-label>

                    <input matInput type="email" formControlName="email">

                    <!-- Controllo errori per il campo email con @if  -->

                    @if (loginForm.get('email')?.hasError('required')) {
                    <mat-error>Email is required</mat-error>
                    <!-- loginForm.get('email')? controlla se il controllo del campo email esiste -->
                    <!-- hasError('required') verifica se il campo email ha l'errore 'required' -->
                    } @else if (loginForm.get('email')?.hasError('email')) {
                    <mat-error>Please enter a valid email address</mat-error>
                    <!-- loginForm.get('email')? controlla se il controllo del campo email esiste -->
                    <!-- hasError('email') verifica se il campo email ha l'errore 'email' -->
                    <!-- Il controllo @else if evita di eseguire inutilmente il secondo controllo se il campo è già vuoto. -->
                    <!-- In sintesi, questo blocco mi dice che se il campo email è vuoto, mostra l'errore "Email is required", altrimenti se il campo non è un'email valida, mostra l'errore "Please enter a valid email address". -->

                    }

                </mat-form-field>


                <!------------- CAMPO PASSWORD ------------------>
                <mat-form-field appearance="outline" class="password-field">

                    <mat-label>Password</mat-label>

                    <!-- <input matInput type="password" formControlName="password"> -->
                    <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">

                    <!-- formControlName, in parole semplici, collega l'input al controllo del form corrispondente nel FormGroup. 
                     "password" è il nome del controllo del form corrispondente. -->


                    @if (loginForm.get('password')?.hasError('required')) {
                    <mat-error>Password is required</mat-error>
                    }

                    <!-- Pulsante per mostrare/nascondere la password -->
                    <button mat-icon-button type="button" (click)="togglePasswordVisibility()" matTooltip="{{ hidePassword ? 'Show Password' : 'Hide Password' }}" matTooltipPosition="below">
                        <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>

                </mat-form-field>

                <!-- MESSAGGIO DI ERRORE GENERALE -->
                @if (errorMessage) {
                <p class="error-messagge">
                    {{errorMessage}}
                </p>
                }

                <!-- PULSANTE DI LOGIN -->
                <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">
                    Login
                </button>

            </form>

            <!-- AZIONI DEL LOGIN CARD -->
            <mat-card-actions>

                <!-- PULSANTE PER TORNARE ALLA HOME -->
                <button mat-raised-button routerLink="">
                    <mat-icon>home</mat-icon>
                    Back to Home
                </button>

                <!-- PULSANTE PER RIPRISTINARE LA PASSWORD -->
                <button mat-raised-button routerLink="/reset-password">
                    <mat-icon>lock_reset</mat-icon>
                    Reset Password
                </button>

            </mat-card-actions>

        </mat-card-content>

    </mat-card>

</div>
```