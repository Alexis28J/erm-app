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
    getUsers(){   // (3)
      return this.http.get<User[]>(this.apiUrl)  
    }


    // METODO PER OTTENERE UN UTENTE SPECIFICO IN BASE ALL'ID
    getUserById(id: string){  // (4)
      return this.http.get<User>(`${this.apiUrl}/${id}`); 
    }


    // METODO PER OTTENERE UN UTENTE SPECIFICO IN BASE ALL'EMAIL
    getUserByEmail(email: string){  // (5)
      return this.http.get<User>(`${this.apiUrl}?email=${email}`); 
    }
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


## (4)
- Prende un utente specifico dal server in base all'ID fornito e restituisce un oggetto User


## (5)
- Prende un utente specifico dal server in base all'email fornita e restituisce un oggetto User.

- Perché si usa `?email=${email}` invece di `/${email}`? 
  perché l'email non è un identificatore univoco come l'ID, quindi si usa una query string per filtrare gli utenti in base all'email
   
  Una `query string` è una parte dell'URL che contiene parametri e valori separati da & e preceduti da ?, e viene utilizzata per inviare dati al server in modo dinamico. In questo caso, la query string `?email=${email}` viene utilizzata per filtrare gli utenti in base all'email fornita.