# COMMENTI

Ho creato questo servizio per gestire l'autenticazione degli utenti, inclusi login, logout e verifica dello stato di login.

In questo modo, posso centralizzare la logica di autenticazione e semplificare la gestione dell'utente corrente nell'applicazione.


```TYPESCRIPT
@Injectable({
    providedIn: 'root'   // significa che questo servizio sarà disponibile a livello globale nell'applicazione Angular.
})

// Per il login mock
export class AuthService {

    private readonly STORAGE_KEY = 'currentUser';  // Chiave sotto la quale memorizzare l'utente corrente nel localStorage.

    constructor(private userService: UserService) { }


    // METODO PER LOGGARSI
    login(email: string, password: string) {

        return this.userService.getUsers()  // Recupera tutti gli utenti dal servizio utente.

            .pipe(  // Uso il metodo pipe per applicare una serie di operatori RxJS agli utenti recuperati.
            // pipe mi permette di trasformare e gestire i dati emessi dall'Observable.
            
                map(users =>  // Trova l'utente che corrisponde all'email e alla password forniti.
                    users.find(
                        user =>
                            user.email.toLowerCase() === email.toLowerCase() &&  // Login case sensitive
                            user.password === password && // Nota: la password non dovrebbe essere memorizzata in chiaro cioè in plain text
                                // In un progetto reale, la password dovrebbe essere confrontata in modo sicuro, ad esempio tramite hashing. Di quello si occupa il backend.
                            user.active !== false // Verifica che l'utente sia attivo
                    )
                ),
                tap(user => {  // Se l'utente è stato trovato, memorizzalo nel localStorage.
                    // tap mi permette di eseguire effetti collaterali senza modificare i dati emessi dall'Observable.

                    if (user) {  // Se l'utente esiste, memorizzalo nel localStorage.
                        localStorage.setItem(

                            this.STORAGE_KEY,   // Chiave sotto la quale memorizzare l'utente nel localStorage.

                            JSON.stringify(user)  // Converte l'oggetto utente in una stringa JSON prima di memorizzarlo nel localStorage.
                        );
                    }
                })
            );

    }


    // METODO PER LOGOUT
    logout(){
        localStorage.removeItem(  // Uso il metodo removeItem per rimuovere l'utente corrente dal localStorage.
            this.STORAGE_KEY  // Chiave sotto la quale è memorizzato l'utente corrente nel localStorage.
        );
    }


    // METODO PER OTTENERE L'UTENTE CORRENTE DAL LOCALSTORAGE
    getCurrentUSer(): User | null {  // Restituisce l'utente corrente memorizzato nel localStorage, oppure null se non esiste.
        
        const user = 
        localStorage.getItem(   // Recupera l'utente corrente dal localStorage.
            this.STORAGE_KEY
        );

        return user      //  Se l'utente esiste nel localStorage, restituiscilo come oggetto JSON, altrimenti restituisci null.

        ? JSON.parse(user)  //  Converte la stringa JSON memorizzata nel localStorage di nuovo in un oggetto User. Questo permette di lavorare con l'utente come oggetto invece che come stringa.
        : null;

    }


    // METODO PER VERIFICARE SE L'UTENTE È LOGGATO
    isLoggedIn(): boolean {    // Restituisce true se l'utente è loggato, altrimenti false.
    
        return !!this.getCurrentUSer(); // Restituisce true se l'utente corrente esiste nel localStorage, altrimenti false.
        // Il doppio punto esclamativo (!!) converte il valore in un booleano. E' un modo comune per verificare l'esistenza di un oggetto.
    } 


    // METODO PER CONTROLLARE SE L'UTENTE CORRENTE È HR
    isHr(): boolean {  //funzione di tipo booleano per verificare se l'utente corrente è HR
        const user = this.getCurrentUser();  // Ottiene l'utente corrente dal localStorage

        return user?.role === UserRole.HR;  // Verifica se il ruolo dell'utente corrente è HR
        // Ritorna true se l'utente corrente è HR, altrimenti false
    }


    // METODO PER CONTROLLARE SE L'UTENTE CORRENTE È DIPENDENTE NORMALE (EMPLOYEE)
    isEmployee(): boolean {  //funzione di tipo booleano per verificare se l'utente corrente è DIPENDENTE
        const user = this.getCurrentUser();  // Ottiene l'utente corrente dal localStorage

        return user?.role === UserRole.EMPLOYEE;  // Verifica se il ruolo dell'utente corrente è DIPENDENTE
        // Ritorna true se l'utente corrente è DIPENDENTE, altrimenti false
    }
}
```