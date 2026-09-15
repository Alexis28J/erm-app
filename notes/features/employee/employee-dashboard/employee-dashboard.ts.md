# COMMENTI

```TYPESCRIPT
export class EmployeeDashboard {

  // INIEZIONI DELLE DIPENDENZE
  private authService = inject(AuthService);
  private router = inject(Router);


  // UTENTE CORRENTE
  // currentUser è una proprietà che rappresenta l'utente attualmente loggato.
  currentUser: User | null = this.authService.getCurrentUser();  
  // Perché null? Perché l'utente potrebbe non essere loggato, e pertanto la pagina deve essere protetta o reindirizzare al login.
  // Perché non mettiamo solo User senza null? Perché l'utente potrebbe non essere loggato e quindi currentUser sarebbe undefined.
  // Deve essere gestito correttamente per evitare errori quando l'utente non è loggato.


  // LOGOUT DELL'UTENTE
  logout(): void {

    const dialogRef = this.dialog.open(ConfirmAction, {  // Apre il dialogo di conferma logout. ConfirmAction è il componente del dialogo.
      data: {   // Dati da passare al dialogo di conferma logout, come il titolo e il messaggio.
        title: 'Logout',  // Titolo del dialogo di conferma logout
        message: 'Are you sure you want to log out?' // Messaggio del dialogo di conferma logout
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {  // Gestisce il risultato del dialogo di conferma logout. Se l'utente conferma, effettua il logout.
      if (result === true) {   // Se l'utente ha confermato il logout
        this.authService.logout();  // Effettua il logout dell'utente corrente
        this.router.navigate(['/login']); // Reindirizza l'utente alla pagina di login dopo il logout
        this.notificationService.success('Successfully logged out');  // Mostra una notifica di successo dopo il logout. 
        // L'opzione "Cancel" viene gestita automaticamente dal dialogo ("ConfirmAction").
      }
    });

}
  ```