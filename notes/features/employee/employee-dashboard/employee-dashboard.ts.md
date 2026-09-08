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

    this.authService.logout();
    this.router.navigate(['/login']);

  }

}
  ```