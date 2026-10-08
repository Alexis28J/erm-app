# COMMENTI

Questo guard protegge le rotte che richiedono l'autenticazione. 

In questo modo, solo gli utenti loggati possono accedere a determinate pagine.


```TYPESCRIPT
export const authGuard: CanActivateFn = () => {  // Non usa nessun parametro della route perché controlla solo se l'utente è loggato
// CanActivateFn è una funzione che determina se una rotta può essere attivata o meno.

  const authService = inject(AuthService);
  // AuthService è un servizio personalizzato che gestisce l'autenticazione dell'utente.

  const router = inject(Router);
  // Il Router è un servizio di Angular che permette la navigazione tra le diverse pagine dell'applicazione.


  if (authService.isLoggedIn()) {  // Se l'utente è loggato, permette l'accesso.
    return true;     
  }

  return router.createUrlTree(['/login']);  // Se l'utente non è loggato, viene reindirizzato alla pagina di login.

  // Il metodo createUrlTree reindirizza l'utente alla pagina di login se non è autenticato.
  
  // Perché usare createUrlTree invece di router.navigate?
  // createUrlTree permette di restituire un oggetto URL che Angular può utilizzare per la navigazione,
  // mantenendo il flusso sincrono del guard.
  // In parole semplici, createUrlTree permette di dire ad Angular "se non sei loggato, vai a questa URL" 
  // senza dover eseguire una navigazione esplicita.

};
```
