# COMMENTI

```HTML
<div class="login-container">

    <mat-card>

        <mat-card-header>

            <mat-card-title>
                Login
            </mat-card-title>

            <mat-card-subtitle>
                Expense Reimbursement Management
            </mat-card-subtitle>

        </mat-card-header>


        <mat-card-content>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">

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


                <mat-form-field appearance="outline">

                    <mat-label>Password</mat-label>

                    <input matInput type="password" formControlName="password">
                    <!-- formControlName, in parole semplici, collega l'input al controllo del form corrispondente nel FormGroup. 
                     "password" è il nome del controllo del form corrispondente. -->

                    @if (loginForm.get('password')?.hasError('required')) {
                    <mat-error>Password is required</mat-error>
                    }

                </mat-form-field>

                @if (errorMessage) {
                <p class="error-messagge">
                    {{errorMessage}}
                </p>
                }

                <button mat-raised-button color="primary" type="submit">
                    Login
                </button>

            </form>

        </mat-card-content>

    </mat-card>

</div>
```