# COMMENTI

Questa guardia di ruolo verifica se l'utente corrente ha il ruolo atteso per accedere a una determinata route.

Se l'utente ha il ruolo corretto, la guardia restituisce true, consentendo l'accesso alla route.

Se l'utente non ha il ruolo corretto o non è autenticato, la guardia restituisce un UrlTree che rappresenta la route di login, impedendo l'accesso alla route protetta.


```TYPESCRIPT
export const roleGuard: CanActivateFn = (route) => {  
// Si usa il parametro route per ottenere le informazioni sulla route attuale, inclusi i parametri e i dati associati.
// ActivateRouteSnapshot rappresenta lo snapshot della route attuale, utile per ottenere i dati della route e i parametri.
// route: ActivatedRouteSnapshot rappresenta lo snapshot della route attuale, utile per ottenere i dati della route e i parametri.
// Da dove viene il parametro route? Viene passato automaticamente dal framework Angular quando la guardia viene invocata durante la navigazione verso una route.

  
const authService = inject(AuthService);

const router = inject(Router);

const currentUser = authService.getCurrentUser();

const expectedRole = route.data?.['role'];  // .data contiene i dati associati alla route, come il ruolo atteso.
//.data? significa che i dati della route potrebbero essere undefined, quindi si usa l'operatore opzionale ?. per evitare errori.
//.[<key>] permette di accedere a un valore specifico nei dati della route, dove <key> è il nome della proprietà desiderata.
// In questo caso, si sta cercando di ottenere il ruolo atteso per la route corrente.

if (currentUser && currentUser.role === expectedRole) {
  return true;
}

return router.createUrlTree(['/login']);

// La differenza tra il metodo router.navigate e router.createUrlTree è che router.navigate effettua una navigazione immediata verso una nuova route,
// mentre router.createUrlTree crea un oggetto UrlTree che rappresenta la nuova route senza effettuare la navigazione immediata.
// In questo caso, si utilizza router.createUrlTree per creare un UrlTree che rappresenta la route di login, senza effettuare la navigazione immediata.
// Questo approccio è utile nelle guardie di route, dove si vuole determinare se l'utente può accedere a una determinata route senza effettuare una navigazione immediata.
// Se usassimo router.navigate invece di router.createUrlTree, la navigazione verso la route di login avverrebbe immediatamente, interrompendo il flusso della guardia.
// Si può quindi utilizzare router.createUrlTree nelle guardie di route per gestire i casi in cui l'accesso non è consentito, senza interrompere immediatamente il flusso della navigazione.

};
```