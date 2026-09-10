import { Service, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Service()
export class Notification {
    private snackBar = inject(MatSnackBar);


    // METODO PER MOSTRARE UNA NOTIFICA DI SUCCESSO
    success(message: string): void {

        this.snackBar.open(
            message,
            'Close',
            {
                duration: 3000,
                panelClass: ['success-snackbar']
            }
        );

    }

    // METODO PER MOSTRARE UNA NOTIFICA DI ERRORE
    error(message: string): void {

        this.snackBar.open(
            message,
            'Close',
            {
                duration: 5000,
                panelClass: ['error-snackbar']
            }
        )
    }
}
