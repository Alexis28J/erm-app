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



  // METODO PER IMPORTARE GLI UTENTI ATTIVI DA UN FILE EXCEL

  // VERSIONE SENZA forkJoin
  // Questo metodo importa gli utenti attivi da un file Excel e aggiorna lo stato "active" degli utenti esistenti.
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

}
```