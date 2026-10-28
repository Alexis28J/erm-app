# COMMENTI

```TYPESCRIPT
export class UserManagement {

  constructor() { 

    this.loadUsers(); // Carica gli utenti all'inizializzazione del componente

    // Sottoscrizione ai cambiamenti del controllo di ricerca per aggiornare il filtro degli utenti in tempo reale
    this.searchControl.valueChanges.subscribe(value => {  // Aggiorna il segnale di ricerca ogni volta che il valore del controllo di ricerca cambia
      this.search.set(value ?? '');
    })


    // EFFECT PER AGGIORNARE LA TABELLA QUANDO CAMBIANO I DATI O IL FILTRO DI RICERCA
    effect(() => {

      // Aggiorna i dati della tabella in base al filtro di ricerca corrente
      // Filtra gli utenti in base al termine di ricerca corrente e aggiorna i dati della tabella
      this.dataSource.data = this.filteredEmployees();

      // Se non ci sono risultati filtrati, esci dall'effetto
      if (!this.filteredEmployees() || this.filteredEmployees().length === 0) {
        return;
      }


      // Forza l'aggiornamento della vista per riflettere i cambiamenti nei dati della tabella
      this.cdr.detectChanges();


      // Se il sortingDataAccessor non è ancora stato impostato, impostalo ora
      if (!this.dataSource.sortingDataAccessor) {

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {  // Gestisce l'ordinamento in base alla proprietà specificata
            case "employeeCode": return item.employeeCode;
            case "name": return item.name;
            case "email": return item.email;
            default: return item[property as keyof User] as any; // Fallback per altre proprietà non specificate
            // Vuol dire che se la proprietà non è tra quelle specificate, si usa il valore corrispondente nell'oggetto User come fallback.
          }
        };

      }


      // Imposta il sorting della tabella se non è già stato impostato
      if (this.sortComponent && !this.dataSource.sort) {
        this.dataSource.sort = this.sortComponent;
      }


      // Imposta il paginatore della tabella se non è già stato impostato
      if (this.paginatorComponent && !this.dataSource.paginator) {
        this.dataSource.paginator = this.paginatorComponent;
      }


      // Applica il sorting iniziale della tabella se il sorting è già stato impostato
      if (this.dataSource.sort) {
        this.dataSource.sort.sort({ id: "employeeCode", start: "asc", disableClear: false })
      }

    });
    
    }  

  // REFERENZE AI COMPONENTI DELLA TABELLA (SORT E PAGINATOR)
  // Questi riferimenti ai componenti della tabella (sort e paginator) 
  // vengono utilizzati per collegare il MatSort e il MatPaginator alla dataSource della tabella.
  @ViewChild(MatSort) sortComponent!: MatSort;
  @ViewChild(MatPaginator) paginatorComponent!: MatPaginator;


  // DATA SOURCE DELLA TABELLA
  dataSource = new MatTableDataSource<User>();  // User indica il tipo di dati contenuti nella tabella (array di oggetti User)
  // Perché non scrivo User[]? Perché MatTableDataSource accetta un array di User come input, non un array di array di User (User[][]).
  // Quindi User senza [] è un array? Sì, MatTableDataSource<User> si aspetta un array di User come input, quindi User rappresenta il tipo degli elementi dell'array.
  // Con MatTableDataSource non è necessario specificare User[] perché il tipo generico indica già che si tratta di un array di User.


  // INIEZIONE DEI SERVIZI NECESSARI
  // Viene utilizzato il pattern inject per ottenere le istanze dei servizi UserService e Notification, 
  // e del ChangeDetectorRef per gestire il rilevamento dei cambiamenti nel componente.
  private readonly userService = inject(UserService);
  private readonly notification = inject(Notification);
  private cdr = inject(ChangeDetectorRef);


  // SEGNALE CHE CONTIENE LA LISTA DEGLI UTENTI FILTRATI
  users = signal<User[]>([]);  // User[] indica un array di oggetti User e ([]) indica che inizialmente è vuoto
  // Questo segnale prende i dati dal servizio utenti già filtrati in base ai criteri specificati (non di sistema e con ruolo EMPLOYEE) grazie al metodo loadUsers.
  // Questo segnale users è utile per mantenere uno stato reattivo degli utenti filtrati all'interno del componente, senza dover rifare il filtraggio ogni volta che i dati cambiano.


  // SEGNALE CHE CONTIENE LA LISTA COMPLETA DEGLI UTENTI OTTENUTI DAL SERVIZIO
  // Questo segnale contiene la lista completa degli utenti ottenuti dal servizio UserService, senza alcun filtraggio.
  // E' un segnale reattivo ma non è writable, quindi non può essere modificato direttamente. A differenza del segnale users, non può essere aggiornato manualmente all'interno del componente.
  usersResource = toSignal(
    this.userService.getUsers(),
    {
      initialValue: []
    }
  );


  // CONTROLLO DI RICERCA
  // Questo FormControl viene utilizzato per gestire l'input di ricerca dell'utente nella tabella.
  // Il valore di questo controllo viene utilizzato per aggiornare il segnale di ricerca e filtrare gli utenti in tempo reale.
  searchControl = new FormControl('');


  // SEGNALE DI RICERCA
  // Segnale che contiene il termine di ricerca corrente inserito dall'utente nel FormControl di ricerca.
  search = signal('');


  // COMPUTED CHE RESTITUISCE LA LISTA DEGLI UTENTI FILTRATI IN BASE ALLA RICERCA
  filteredEmployees = computed(() => {
    const term = this.search().toLowerCase();  // Converte il termine di ricerca in minuscolo per confronti case-insensitive

    return this.users().filter(u =>  // Quindi, filtra gli utenti in base al termine di ricerca confrontando nome, cognome ed email in modo case-insensitive
      u.name.toLowerCase().includes(term)
      || u.surname.toLowerCase().includes(term)
      || u.email.toLowerCase().includes(term)
    );
  });


  // METODO PER CARICARE GLI UTENTI DAL SERVIZIO
  // Questo metodo chiama il servizio UserService per ottenere la lista completa degli utenti,
  // filtra quelli non di sistema con ruolo EMPLOYEE e aggiorna il segnale users con i risultati.
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


  // METODO PER IMPORTARE GLI UTENTI ATTIVI DA UN FILE EXCEL
  // VEDI SOTTO SIA LA VERSIONE SENZA E CON forkJoin
}
```

///////////////////////////////////////////////////////////////////////////////////////////////////////


# METODO PER IMPORTARE GLI UTENTI ATTIVI DA UN FILE EXCEL

```TYPESCRIPT

////////////////////////////////////////////////////////////////////////////////////////////////////////
// VERSIONE SENZA forkJoin
// Questo metodo importa gli utenti attivi da un file Excel e aggiorna lo stato "active" degli utenti esistenti.
////////////////////////////////////////////////////////////////////////////////////////////////////////

  importActiveUsers(event: Event): void {

    const file = (event.target as HTMLInputElement).files?.[0];  // Prende il primo file selezionato dall'input file

    if (!file) {  // Se non è stato selezionato alcun file, esce dal metodo
      return;
    }

    const reader = new FileReader();  // Crea un nuovo oggetto FileReader per leggere il contenuto del file Excel

    // Il metodo onload dell'oggetto FileReader serve a gestire il momento in cui la lettura di un file è stata completata con successo.
    // In questo caso, viene utilizzato per leggere il contenuto del file Excel e convertirlo in un array di oggetti.
    reader.onload = (e) => {

      try {  // try block per gestire eventuali errori durante la lettura e l'elaborazione del file Excel

        const arrayBuffer = e.target?.result as ArrayBuffer;  // Converte il risultato della lettura del file in un ArrayBuffer

        const workbook = XLSX.read(  // Legge il contenuto del file Excel e crea un oggetto workbook
          arrayBuffer,  // ArrayBuffer contenente i dati del file Excel
          {
            type: 'array'  // Specifica che il tipo di input è un array di byte (ArrayBuffer)
          }
        );

        const worksheet = workbook.Sheets[  // Prende il primo foglio di lavoro del file Excel
          workbook.SheetNames[0]
        ];

        const rawData = XLSX.utils.sheet_to_json(  // Converte il foglio di lavoro in un array di oggetti JSON (questo processo si chiama parsing)
          worksheet
        );

        console.log(rawData);  // Stampa i dati raw importati dal file Excel nel console log per il debug


        // CONVERSIONE DEI DATI RAW IN OGGETTI DI TIPO IMPORTED USER
        // E' necessario convertire i dati raw in oggetti di tipo ImportedUser per poterli utilizzare nel merge con gli utenti esistenti
        const importedUsers = rawData.map(   // Mappa ogni riga dei dati raw in un oggetto ImportedUser
          (row: any) => ({  // row rappresenta una riga del file Excel convertita in oggetto JSON

            employeeCode: row.EmployeeCode?.trim(), // Il metodo trim() rimuove eventuali spazi bianchi all'inizio e alla fine della stringa
            fullName: row.Name?.trim(),
            active: row.Active === true ||  // Controlla se il valore della colonna Active è true (booleano) o 'true' (stringa). Se è uno di questi casi, l'utente è considerato attivo
              row.Active === 'true'

          })
        );

        console.log('IMPORTED USERS', importedUsers);  // Stampa gli utenti importati nel console log per il debug


        // VALIDAZIONE DEI DATI IMPORTATI
        const invalidRows = importedUsers.some(  // Creo un flag (cioè una variabile booleana) che indica se ci sono righe non valide nei dati importati
          user =>
            !user.employeeCode ||  // || = oppure "OR"
            !user.fullName
        );

        if (invalidRows) {  // Se ci sono righe non valide, mostro un messaggio di errore e interrompo l'importazione 
          this.notification.error('The excel file contains invalid data');
          return;
        }


        // MERGE DEGLI UTENTI IMPORTATI CON GLI UTENTI ESISTENTI
        // Per ogni utente esistente, cerco se esiste un corrispondente utente importato. Se esiste, aggiorno lo stato attivo dell'utente esistente con quello dell'utente importato. Altrimenti, lo ignoro.
        const usersToUpdate =  // Creo un array di utenti esistenti che devono essere aggiornati con i dati importati
          this.users()  // Ottengo la lista degli utenti esistenti
            .map(existingUser => {  // Per ogni utente esistente, cerco se esiste un corrispondente utente importato
              const importedUser = importedUsers.find(
                user =>  // Controlla se l'utente importato corrisponde all'utente esistente confrontando il codice dipendente e il nome completo
                  user.employeeCode ===
                  existingUser.employeeCode &&
                  user.fullName ===
                  `${existingUser.name} ${existingUser.surname}`
              );

              if (!importedUser) {  // Se non esiste un utente importato corrispondente, ritorno null
                return null;
              }

              return {  // Altrimenti, ritorno l'utente esistente aggiornato con lo stato attivo dell'utente importato
                ...existingUser,
                active: importedUser.active
              };
            }).filter(Boolean) as User[];  // Boolean è una funzione che converte i valori in true o false, quindi filtra solo quelli "veri" (non nulli) cioè gli utenti non importati  

        console.log('USERS TO UPDATE', usersToUpdate);  // Stampa gli utenti che devono essere aggiornati nel console log per il debug 


        //UPDATE DEGLI UTENTI
        // Per ogni utente che deve essere aggiornato, chiamo il servizio per aggiornare l'utente nel backend
        usersToUpdate.forEach(user => {  // Per ogni utente che deve essere aggiornato, eseguo l'update tramite il servizio
          this.userService  // Chiamo il servizio per aggiornare l'utente nel backend
            .updateUser(user.id, user)  // Il metodo updateUser aggiorna l'utente con l'ID specificato utilizzando i dati forniti per aggiornare l'utente nel backend.
            .subscribe({  // con subscribe gestisco la risposta asincrona dell'update dell'utente per aggiornare la UI e notificare l'utente

              next: () => {  // Gestisce il caso in cui l'update dell'utente è avvenuto con successo
                console.log('Update:', user.employeeCode);
                console.log('Update:', `${user.name} ${user.surname}`),
                  console.log('Active:', user.active);
                this.notification.success(
                  `User ${user.name} ${user.surname} updated successfully`
                );

                this.loadUsers();  // Ricarica la lista degli utenti per riflettere le modifiche effettuate

              },
              error: error => {  // Gestisce il caso in cui si verifica un errore durante l'update dell'utente
                console.error(error);
                this.notification.error(
                  'Error while importing users'
                );
              }
            });
        });

      }

      catch (error) {  // Gestisce il caso in cui si verifica un errore durante la lettura del file Excel
        console.log(error);
        this.notification.error('Unable to read the Excel file');
      }
    };

    reader.readAsArrayBuffer(file);  // Legge il file Excel come ArrayBuffer per poterlo elaborare successivamente
  }


///////////////////////////////////////////////////////////////////////////////////////////////////////
// VERSIONE CON forkJoin PER AGGIORNARE TUTTI GLI UTENTI INSIEME
// A differenza della versione precedente, questa utilizza forkJoin per aggiornare tutti gli utenti insieme.
// Questo mi permette di gestire gli aggiornamenti in modo più efficiente e di ricevere una notifica solo quando tutti gli aggiornamenti sono completati.
///////////////////////////////////////////////////////////////////////////////////////////////////////

  importActiveUsers(event: Event): void {

    const file = (event.target as HTMLInputElement).files?.[0];
    // HTMLInputElement.files contiene la lista dei file selezionati dall'utente

    // La stringa event.target as HTMLInputElement serve a fare un type assertion (ovvero una conversione forzata del tipo o "casting").
    // Significa: "Caro TypeScript, io so che l'elemento che ha scatenato questo evento (event.target) è specificamente un campo di input HTML (HTMLInputElement), quindi trattalo come tale".

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {

      try {

        const arrayBuffer = e.target?.result as ArrayBuffer;
        // Un ArrayBuffer è un contenitore di byte: È una sequenza pura di dati binari (0 e 1) allocata in memoria.
        // Non modificabile direttamente: Non puoi leggere o scrivere i byte dentro un ArrayBuffer usando le normali parentesi quadre (buffer[0]) o metodi degli array JavaScript classici.

        const workbook = XLSX.read(
          arrayBuffer,
          {
            type: 'array'
          }
        );

        const worksheet = workbook.Sheets[
          workbook.SheetNames[0]
        ];

        const rawData = XLSX.utils.sheet_to_json(
          worksheet
        );


        // CONVERSIONE: Trasforma i dati grezzi del foglio Excel in oggetti utente con proprietà specifiche
        const importedUsers = rawData.map(
          (row: any) => ({

            employeeCode: row.EmployeeCode.trim(),
            fullName: row.Name.trim(),
            active: row.Active === true || row.Active === 'true'
          })
        );


        // VALIDAZIONE: Controlla che tutti gli utenti importati abbiano codice dipendente e nome completo validi
        const hasInvalidRows = importedUsers.some(
          user =>
            !user.employeeCode ||
            !user.fullName
        )

        if (hasInvalidRows) {
          this.notification.error('The Excel file contains invalid data');
          return;
        }


        // VALIDAZIONE: Controlla che tutti gli utenti importati esistano già nel sistema
        const unknownEmployees = importedUsers.filter(  // Filtra gli utenti importati che non esistono nel sistema
          imported => !this.users().some( // Il metodo some verifica se esiste almeno un utente esistente con lo stesso codice dipendente e nome completo
            existing => existing.employeeCode === imported.employeeCode &&
              `${existing.name} ${existing.surname}` === imported.fullName
          )
        );

        if (unknownEmployees.length > 0) {  // Se ci sono utenti sconosciuti, mostra un errore e interrompi l'importazione
          this.notification.error('The Excel file contains unknown employees.');
          return;
        }


        // MERGE: Aggiorna lo stato degli utenti esistenti con i dati importati
        const usersToUpdate = this.users()
          .map(existingUser => {

            const importedUser = importedUsers.find(
              user => user.employeeCode === existingUser.employeeCode &&
                user.fullName === `${existingUser.name} ${existingUser.surname}`
            );

            if (!importedUser) {
              return null;
            }

            return {
              ...existingUser,
              active: importedUser.active
            };


          })
          .filter(Boolean) as User[];


        // CHIAMATE HTTP: Invia richieste di aggiornamento per gli utenti modificati
        // PREPARAZIONE (updatedRequests): Crea un array di richieste HTTP per aggiornare gli utenti modificati
        // updatedRequests conterrà le chiamate HTTP per aggiornare ciascun utente modificato
        const updatedRequests = usersToUpdate.map(
          user =>
            this.userService.updateUser(
              user.id,
              user
            )
        );

        if (updatedRequests.length === 0) {  // Se non ci sono utenti da aggiornare, mostra un errore e interrompi l'importazione
          this.notification.error(
            'Not matching users found.'
          );
          return;
        }


        // ESECUZIONE: Invia tutte le richieste di aggiornamento in parallelo e gestisce il risultato
        // forkJoin: Combina tutte le richieste HTTP in un'unica osservabile che emette quando tutte le richieste sono completate
        forkJoin(updatedRequests)  // Invia tutte le richieste HTTP in parallelo 
          .subscribe({  // Gestisce il risultato delle richieste HTTP combinate
            next: () => {  // Gestisce il caso in cui tutte le richieste HTTP siano completate con successo
              this.notification.success(
                'Users imported succesfully.'
              );

              this.loadUsers();  // Ricarica la lista degli utenti dopo l'aggiornamento
            },

            error: () => {  // Gestisce il caso in cui si verifichi un errore durante l'importazione degli utenti
              this.notification.error(
                'Error importing users.'
              );
            }
          });

      }

      catch (error) {  // Gestisce il caso in cui si verifichi un errore durante la lettura del file Excel
        console.error(error);
        this.notification.error(
          'Unable to read the Excel file'
        );
      }


    };

    reader.readAsArrayBuffer(file);  // Avvia la lettura del file Excel come array di byte
    // Questo passaggio è necessario per leggere correttamente il contenuto del file Excel come array di byte, che verrà poi elaborato per aggiornare gli utenti.
    // Senza questa lettura, non sarebbe possibile ottenere correttamente i dati dal file Excel.


  }

```