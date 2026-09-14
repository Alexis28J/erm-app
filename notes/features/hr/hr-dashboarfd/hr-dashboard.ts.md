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

    this.authService.logout();  // Chiama il metodo di logout del servizio di autenticazione per disconnettere l'utente corrente
    this.router.navigate(['/login']);  // Reindirizza l'utente alla pagina di login dopo il logout

  }

}
```