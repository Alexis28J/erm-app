# COMMENTI

```TYPESCRIPT
export class HrDashboard {


  // INIEZIONI DI DIPENDENZE
  private authService = inject(AuthService);  // Servizio per l'autenticazione e gestione dell'utente corrente
  private router = inject(Router);  // Servizio per la navigazione tra le pagine


  // VARIABILE CHE CONTIENE L'UTENTE CORRENTE (OTTENUTO DAL SERVIZIO DI AUTENTICAZIONE) 
  currentUser: User | null = this.authService.getCurrentUser();  // L'utente può essere null se non è autenticato


  // METODO PER EFFETTUARE IL LOGOUT DELL'UTENTE CORRENTE
  logout(): void {   

    // this.authService.logout();  
    // this.router.navigate(['/login']);  

    // Mostra una finestra di dialogo di conferma prima di effettuare il logout (uso il servizio MatDialog)
    const dialogRef = this.dialog.open(ConfirmAction, {  // Apre il dialogo di conferma logout. ConfirmAction è il componente del dialogo.
      data: {  // Dati da passare al dialogo di conferma, come il titolo e il messaggio.
        title: 'Logout',  // Titolo del dialogo di conferma logout
        message: 'Are you sure you want to log out?' // Messaggio del dialogo di conferma logout
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {   // Gestisce il risultato del dialogo di conferma logout. 
      if (result === true) {  // Se l'utente ha confermato il logout
        this.authService.logout();  // Effettua il logout dell'utente corrente
        this.router.navigate(['/login']); // Reindirizza l'utente alla pagina di login dopo il logout
        this.notificationService.success('Successfully logged out');  // Mostra una notifica di successo dopo il logout. 
        // L'opzione "Cancel" viene gestita automaticamente dal dialogo ("ConfirmAction").
      } 
    }); 

}
```