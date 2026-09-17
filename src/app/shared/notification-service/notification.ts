import { Service, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Service()
export class Notification {
    private snackBar = inject(MatSnackBar);


    // METODO PER MOSTRARE UNA NOTIFICA DI SUCCESSO
    success(message: string): void {

        this.snackBar.open(
            message,
            '',  
            {   
                duration: 3000,
                panelClass: ['success-snackbar'] // NON USATO AL MOMENTO
            }
        );

    }

    // METODO PER MOSTRARE UNA NOTIFICA DI ERRORE
    error(message: string): void {

        this.snackBar.open(
            message,
            '',
            {
                duration: 5000,
                panelClass: ['error-snackbar'] // NON USATO AL MOMENTO
            }
        )
    }
}
