# COMMENTI

Questo guard protegge le rotte che richiedono l'autenticazione. 

In questo modo, solo gli utenti loggati possono accedere a determinate pagine.


```TYPESCRIPT
export const authGuard: CanActivateFn = () => {  // Non usa nessun parametro della route perché controlla solo se l'utente è loggato

  const authService = inject(AuthService);
  // AuthService è un servizio personalizzato che gestisce l'autenticazione dell'utente.

  const router = inject(Router);
  // Il Router è un servizio di Angular che permette la navigazione tra le diverse pagine dell'applicazione.


  if (authService.isLoggedIn()) {  // Se l'utente è loggato, permette l'accesso.
    return true;     
  }

  return router.createUrlTree(['/login']);  // Se l'utente non è loggato, viene reindirizzato alla pagina di login.
  // Il metodo createUrlTree reindirizza l'utente alla pagina di login se non è autenticato.

};
```
