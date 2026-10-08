# COMMENTI

Ho creato questo file `user-service.ts` per fornire un servizio che gestisce le operazioni relative agli utenti, come ottenere tutti gli utenti, ottenere un utente specifico in base all'ID o all'email, e restituire i dati degli utenti come oggetti User.

## Perché ho creato un servizio invece di scrivere direttamente le chiamate HTTP nei componenti? 
Perché i servizi sono una buona pratica in Angular per separare la logica di business dalla logica di presentazione, e per rendere il codice più modulare, riutilizzabile e testabile.


```TYPESCRIPT
// Responsabile delle chiamate verso /users.
export class UserService {

    private readonly apiUrl = `${environment.apiUrl}/users`;  // (1)
    
    constructor(private http: HttpClient) { }  // (2)

    // METODO PER OTTENERE TUTTI GLI UTENTI
    getUsers(): Observable<User[]>{   // (3)
      return this.http.get<User[]>(this.apiUrl)  
    }


    // METODO PER OTTENERE UN UTENTE SPECIFICO IN BASE ALL'ID
    getUserById(id: string): Observable<User>{  // (4)
      return this.http.get<User>(`${this.apiUrl}/${id}`); 
    }


    // METODO PER OTTENERE UN UTENTE SPECIFICO IN BASE ALL'EMAIL
    // NOTA: Anche se l'email dovrebbe essere unica, MockAPI restituisce comunque una lista.
    // getUserByEmail(email: string): Observable<User[]>{  // (5)
    //   return this.http.get<User[]>(`${this.apiUrl}?email=${email}`); 
    // }

      getUserByEmail(email: string): Observable<User | undefined> {
    // Perché User[] causa errore? Risposta: perché sto usando map per restituire solo il primo elemento della lista, 
    // quindi il tipo risultante è User | undefined, non User[] che è un array.
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}`)  // Restituisce un array di utenti che corrispondono all'email (anche se dovrebbe esserci solo uno)
      .pipe(map(users => users[0]))  // Il pipe serve per trasformare l'array di utenti in un singolo utente (il primo elemento)
    // users[0] è il primo elemento dell'array, che corrisponde all'utente con l'email specificata (se esiste perché potrebbe non esserci nessun utente con quell'email)
    // Quindi map(users => users[0]) serve per ottenere il primo utente dell'array, che è quello con l'email specificata.
  }  // Questo metodo mi sarà utile per implementare la funzionalità di reset della password basata sull'email dell'utente.


  // METODO PER OTTENERE I DIPENDENTI (EMPLOYEES)
  getEmployees(): Observable<User[]> {
    return this.getUsers().pipe(   // Il pipe serve per trasformare l'array di tutti gli utenti in un array contenente solo i dipendenti (employees)
      map(users =>  // Uso map per trasformare l'array di tutti gli utenti in un array contenente solo i dipendenti (employees)
        users.filter(user => user.role === UserRole.EMPLOYEE)  // Filtra gli utenti per ottenere solo quelli con il ruolo di dipendente (employee)
      )
    );
  }


  // METODO PER AGGIORNARE UN UTENTE
  // Questo metodo aggiorna un utente esistente in base all'ID fornito.
  updateUser(id: string, user: User): Observable<User> {  // I parametri sono l'ID dell'utente da aggiornare e l'oggetto User con i nuovi dati da aggiornare
    // Il valore di ritorno è l'utente aggiornato.
    return this.http.put<User>(  // Effettua una richiesta HTTP PUT per aggiornare l'utente con l'ID specificato
      `${this.apiUrl}/${id}`,  // URL dell'endpoint per aggiornare l'utente con l'ID specificato
      user   // user indica l'oggetto User con i nuovi dati da aggiornare
    );
  }

  // Ricorda: il metodo pipe viene utilizzato per trasformare i dati restituiti da un Observable in un formato desiderato, come ad esempio filtrare o mappare i dati.
  // Il metodo map viene utilizzato all'interno del pipe per trasformare i dati emessi dall'Observable. Ad esempio, nel metodo getUserByEmail, viene utilizzato per prendere il primo utente dall'array restituito dall'API.
  // Sia il metodo map che filter possono essere utilizzati all'interno del pipe per trasformare e filtrare i dati emessi dagli Observable. 
  // Il metodo pipe, invece, viene utilizzato per concatenare più operatori di trasformazione e filtraggio sugli Observable. 
  // Può essere utilizzato all'interno di map o filter? Risposta: No, il metodo pipe viene utilizzato sugli Observable, mentre map e filter sono operatori che vengono utilizzati all'interno del pipe per trasformare 
  // e filtrare i dati emessi dagli Observable.
  // Può essere utilizzato all'interno di un pipe INSIEME ad altri operatori come map e filter per creare catene di trasformazioni e filtri sugli Observable.

}
```


## (1)
- URL dell'API per gli utenti, ottenuta dall'environment di sviluppo.
- `/users` è l'endpoint dell'API che restituisce tutti gli utenti, e viene concatenato all'URL di base dell'API per formare l'URL completo per le richieste HTTP.


## (2)
- Inietto il servizio HttpClient nel costruttore per effettuare richieste HTTP al server.
- Una `richiesta HTTP` è un'operazione asincrona che richiede tempo per essere completata, quindi viene eseguita in background senza bloccare l'esecuzione del codice principale. Per gestire le richieste HTTP in Angular, si utilizza il modulo `HttpClient`, che fornisce metodi per inviare richieste HTTP e ricevere risposte dal server. Il costruttore della classe UserService accetta un'istanza di HttpClient come parametro, che viene utilizzata per inviare richieste HTTP al server.


## (3)

- Prende tutti gli utenti dal server e restituisce un array di oggetti User

- Con `: Observable<User[]>` sto dichiarando il tipo di ritorno e significa che il metodo restituisce un `Observable` che emette un array di oggetti User

- `Un'observable` è un flusso di dati asincrono a cui ci si può iscrivere per ricevere aggiornamenti. 
   In parole semplici, permette di gestire dati che arrivano nel tempo, come le risposte HTTP.

- In parole semplici, permette di gestire dati che arrivano nel tempo, come le risposte HTTP.
  
  In questo caso, l'Observable emetterà (cioè invierà a chi si è iscritto all'Observable) l'array di utenti una volta che la richiesta HTTP sarà completata.
  
  Per il momento, non ci sono iscritti all'Observable, ma chiunque si iscriverà riceverà l'array di utenti quando la richiesta HTTP sarà completata.


## (4)
- Prende un utente specifico dal server in base all'ID fornito e restituisce un oggetto User
  Ritorna un array con l'utente corrispondente all'ID specificato malgrado ci si aspetti un singolo utente.
  Se avessi scritto senza l'array, ci sarebbe stato un errore perché l'API ritorna sempre un array anche per un singolo utente.


## (5)
- Prende un utente specifico dal server in base all'email fornita e restituisce un oggetto User.

- Perché si usa `?email=${email}` invece di `/${email}`? 
  perché l'email non è un identificatore univoco come l'ID, quindi si usa una query string per filtrare gli utenti in base all'email
   
  Una `query string` è una parte dell'URL che contiene parametri e valori separati da & e preceduti da ?, e viene utilizzata per inviare dati al server in modo dinamico. In questo caso, la query string `?email=${email}` viene utilizzata per filtrare gli utenti in base all'email fornita.



  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

DICHIARAZIONE DEL TIPO DI RITORNO 

## Quando mettere : Observable<...>
Tutte le volte che la funzione restituisce il risultato di una chiamata HTTP.

ESEMPIO:

```TYPESCRIPT
  getUsers(): Observable<User[]> {
  return this.http.get<User[]>(this.apiUrl);
}

getUserById(id: string): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/${id}`);
}

createRequest(request: RefundRequest): Observable<RefundRequest> {
  return this.http.post<RefundRequest>(
    this.apiUrl,
    request
  );
}
```
Questa è probabilmente la situazione più comune nei service Angular.



## Quando mettere : User, : boolean, ecc.
Quando la funzione restituisce direttamente un valore.

ESEMPIO:

(1)
```TYPESCRIPT
getCurrentUser(): User | null {
  const user = localStorage.getItem(this.STORAGE_KEY);

  return user
    ? JSON.parse(user)
    : null;
}
```
Qui non restituisci un Observable.
Restituisci direttamente:  User | null


(2)
```TYPESCRIPT
isLoggedIn(): boolean {
  return !!this.getCurrentUser();
}
```
Qui il ritorno è: boolean


(3)
```TYPESCRIPT
isHr(): boolean {
  return this.getCurrentUser()?.role === UserRole.HR;
}
```
Anche qui: boolean


## Quando usare : void
Quando una funzione non restituisce nulla.


ESEMPIO:
```TYPESCRIPT
logout(): void {
  localStorage.removeItem(this.STORAGE_KEY);
}

// oppure

onSubmit(): void {
  console.log('Invio form');
}
```


## Nei componenti
Anche qui conviene dichiarare il tipo.


ESEMPIO:
```TYPESCRIPT
onSubmit(): void {
  if (this.loginForm.valid) {
    console.log(this.loginForm.value);
  }
}

// oppure

loadUser(): void {
  this.userService
    .getUserById('1')
    .subscribe(user => {
      this.user = user;
    });
}
```


## Quando può essere omesso?
Tecnicamente puoi scrivere:

```TYPESCRIPT
isLoggedIn() {
  return !!this.getCurrentUser();
}
```
TypeScript capisce che restituisce un boolean.

OPPURE:

```TYPESCRIPT
getUsers() {
  return this.http.get<User[]>(this.apiUrl);
}
```
e capisce che il tipo è: Observable<User[]>


# Ma nei progetti professionali è preferibile essere espliciti