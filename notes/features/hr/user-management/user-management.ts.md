# COMMENTI

```TYPESCRIPT
export class UserManagement {

  constructor() { this.loadUsers() }  // Carica gli utenti all'inizializzazione del componente

  private readonly userService = inject(UserService); // Iniezione del servizio per la gestione degli utenti

  users = signal<User[]>([]);  // Segnale che contiene la lista degli utenti


  // METODO PER CARICARE GLI UTENTI DAL SERVIZIO
  loadUsers(): void {

    this.userService  // Chiamata al servizio per ottenere la lista degli utenti
      .getUsers()  // Ottiene la lista degli utenti dal server grazie al metodo getUsers del servizio
      .subscribe(users => {  // Aggiorna il segnale con la lista degli utenti filtrata
        this.users.set(
          users.filter(user => !user.systemConfig)  // Filtra gli utenti escludendo quelli con configurazione di sistema
        );
      });
  }


  // METODO PER ATTIVARE/DISATTIVARE GLI UTENTI
  toggleUsers(user: User): void {  // 

    const updateUser: User = {   // Crea un nuovo oggetto User con lo stato attivo/inattivo invertito rispetto all'utente originale
      ...user,  // Copia tutte le proprietà dell'utente originale con il metodo spread
      active: !user.active  // Inverte lo stato attivo/inattivo dell'utente originale
    };

    this.userService   // Chiamata al servizio per aggiornare lo stato attivo/inattivo dell'utente
      .updateUser(user.id, updateUser)  // Aggiorna lo stato attivo/inattivo dell'utente sul server
      .subscribe(savedUser => {  // Uso subscribe per gestire la risposta asincrona del server

        this.users.update(users =>  // Aggiorna la lista degli utenti locali 
          users.map(u =>  // Itera su ogni utente della lista locale
            u.id === savedUser.id  // Se l'ID dell'utente locale (u) corrisponde a quello dell'utente salvato dal server (savedUser)
              ? savedUser  //  Sostituisce l'utente locale con quello salvato dal server
              : u  // Altrimenti mantiene l'utente locale invariato
          )
        );
      });
  }


  // COLONNE DA VISUALIZZARE NELLA TABELLA DEGLI UTENTI
  displayedColumns = [
    'name',
    'email',
    'active'
  ]

}
```