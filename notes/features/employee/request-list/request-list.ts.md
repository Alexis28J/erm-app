# COMMENTI:

Questo componente mostra la lista delle richieste di rimborso dell'utente corrente. 

Mostra le colonne: Mese di riferimento, Data di creazione, Stato, Importo richiesto e Importo approvato.

Utilizza il servizio AuthService per ottenere l'utente corrente e il servizio RefundRequestService per caricare le richieste di rimborso associate all'utente.

I dati vengono visualizzati in una tabella utilizzando il componente MatTable di Angular Material.


```TYPESCRIPT
export class RequestList {

  constructor() {

    // UNICO EFFETTO PER GESTIRE DATI E COLLEGAMENTI
    effect(() => {

      const currentRequests = this.requests();
      
      // 1. Aggiorno i dati 
      this.dataSource.data = currentRequests;

      // 2. Se non ci sono i dati ci fermiamo
      if (!currentRequests || currentRequests.length === 0) return;

      // 3. Forzo Angular a renderizzare il DOM della tabella 
      // (risolve il problema dell'@if che quando l'app parte, se requests() è inizialmente vuoto, 
      // la tabella non esiste nel DOM a causa di @if.)
      this.cdr.detectChanges();  // detectChanges è un metodo di ChangeDetectorRef che forza Angular a rilevare le modifiche e aggiornare il DOM immediatamente.

      // 4. Configura il sortingDataAccessor se non è già stato fatto
      if (!this.dataSource.sortingDataAccessor) {
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case "referenceMonth": return item.referenceMonth;
            case "creationDate": return new Date(item.creationDate).getTime();
            case "totalRequestedAmount": return item.totalRequestedAmount;
            case "totalApprovedAmount": return item.totalApprovedAmount ?? 0;
            default: return item[property as keyof RefundRequest] as any;
          }
        };
      }

      // 5. Collego Sort e Paginator se presenti nel DOM (cioè se i componenti sono stati renderizzati)
      if (this.sortComponent && !this.dataSource.sort) {  // Se il componente sort è presente nel DOM e non è ancora collegato al dataSource
        this.dataSource.sort = this.sortComponent;  // Collego il componente sort al dataSource

        // Imposta l'ordinamento iniziale sul componente visivo
        this.sortComponent.active = 'creationDate';
        this.sortComponent.direction = 'desc';
      }

      if (this.paginatorComponent && !this.dataSource.paginator) {  // Se il componente paginator è presente nel DOM e non è ancora collegato al dataSource
        this.dataSource.paginator = this.paginatorComponent;  // Collego il componente paginator al dataSource
      }

      // 6. Forza l'ordinamento iniziale sui dati effettivi
      // Perché Angular potrebbe non aver ancora applicato l'ordinamento iniziale al componente visivo (per esempio, se il DOM non è ancora completamente renderizzato), lo forziamo sui dati effettivi 
      // In questo modo ci assicuriamo che i dati siano ordinati correttamente fin dall'inizio
      if (this.dataSource.sort) {  // Se il componente sort è presente, forziamo l'ordinamento iniziale sui dati effettivi
        this.dataSource.sort.sort({ id: 'creationDate', start: 'desc', disableClear: false });
        // Perché ho applicato 2 ordinamenti?
        // Il primo sort applicato ai dati effettivi garantisce che l'ordinamento iniziale sia rispettato anche se il componente visivo non ha ancora completato il rendering.
        // Il secondo sort applicato al componente visivo garantisce che l'interfaccia utente rifletta correttamente l'ordinamento iniziale.
        // In sintesi, il primo sort garantisce la correttezza dei dati, il secondo sort garantisce la correttezza dell'interfaccia utente.
        // Questo approccio garantisce che l'ordinamento iniziale sia coerente sia nei dati che nell'interfaccia utente.
        
        // disableClear: false serve per evitare che l'utente possa rimuovere l'ordinamento iniziale cliccando sulla colonna, per mantenere sempre visibile l'ordinamento iniziale
        // disableClear: true serve per permettere all'utente di rimuovere l'ordinamento iniziale cliccando sulla colonna
      }

    });

  }


  private cdr = inject(ChangeDetectorRef);  // Serve per forzare il controllo del DOM dopo il cambio dati
  // In altre parole, il ChangeDetectorRef viene utilizzato per forzare il rilevamento dei cambiamenti nel DOM quando i dati della tabella vengono aggiornati.

  // Riferimenti classici (non più setter complessi)
  // Con questi riferimenti classici, possiamo collegare facilmente il sort e il paginator al dataSource senza dover usare setter complessi
  @ViewChild(MatSort) sortComponent!: MatSort;   //  sortComponent è il riferimento al componente MatSort presente nel DOM
  // sortComponent!: MatSort indica che questa proprietà sarà inizializzata con il riferimento al componente MatSort presente nel DOM
  @ViewChild(MatPaginator) paginatorComponent!: MatPaginator;   //  paginatorComponent è il riferimento al componente MatPaginator presente nel DOM
  // paginatorComponent!: MatPaginator indica che questa proprietà sarà inizializzata con il riferimento al componente MatPaginator presente nel DOM

  // Ricorda che il DOM è l'elemento HTML che si crea quando Angular renderizza la pagina web e che i componenti Angular come MatSort e MatPaginator devono essere collegati al DOM per funzionare correttamente.
  // Il DOM è quindi l'insieme degli elementi HTML che vengono creati e aggiornati da Angular durante il rendering della pagina web.

  // FONTE DEI DATI PER LA TABELLA DELLE RICHIESTE DI RIMBORSO
  dataSource = new MatTableDataSource<RefundRequest>();  // Fonte dei dati per la tabella delle richieste di rimborso

  
  // INIEZIONE DEI SERVIZI
  private authService = inject(AuthService);
  private refundRequestService = inject(RefundRequestService);
  private router = inject(Router); // Servizio per la navigazione tra le pagine dell'applicazione


  // UTENTE CORRENTE E RICHIESTE DI RIMBORSO
  currentUser: User = this.authService.getCurrentUser()!; // Recupera l'utente corrente dal servizio di autenticazione
  // il simbolo "!" indica che ci aspettiamo che il valore non sia mai null o undefined


  // RICHIESTE DI RIMBORSO DELL'UTENTE CORRENTE
  requests = toSignal(  // Converte l'Observable restituito dal servizio getRequestsByUserId in un Signal, che è una rappresentazione reattiva dello stato delle richieste di rimborso dell'utente corrente
    this.refundRequestService
      .getRequestsByUserId(this.currentUser.id), // Prende le richieste di rimborso dell'utente corrente
    {
      initialValue: []  // Valore iniziale del Signal, utilizzato prima che l'Observable restituisca un valore
    }
  )


  // COLONNE DELLA TABELLA
  displayedColumns: string[] = [   // Colonne della tabella delle richieste di rimborso
    'referenceMonth',   // Ogni colonna rappresenta un attributo della richiesta di rimborso
    'creationDate',
    'status',
    'totalRequestedAmount',
    'totalApprovedAmount',
    'actions'
  ];


  // FONTE DATI PER LA TABELLA DELLE RICHIESTE DI RIMBORSO
  dataSource = new MatTableDataSource<RefundRequest>()  // Inizializza la fonte dati per la tabella delle richieste di rimborso
  // MatTableDataSource è una classe fornita da Angular Material per gestire i dati della tabella, quindi dataSource utilizza questa classe per mantenere e aggiornare i dati visualizzati nella tabella
  // In parole semplici, dataSource contiene i dati che vengono visualizzati nella tabella delle richieste di rimborso
  // Senza dataSource, la tabella non avrebbe alcun dato da visualizzare


  // METODO PER VISUALIZZARE I DETTAGLI DI UNA RICHIESTA DI RIMBORSO
  viewDetails(requestId: string): void {  
    this.router.navigate([
      '/employee/request-details',
      requestId
    ]);

  // Perché non utilizzare direttamente il routerLink nell'HTML invece di questo metodo?
  // Risposta: Utilizzare il routerLink direttamente nell'HTML è più semplice e leggibile,
  // ma questo metodo può essere utile se è necessario eseguire ulteriori logiche prima della navigazione.
  // Ad esempio, si potrebbe voler registrare un evento di analytics (cioè un tracking dell'azione dell'utente) prima della navigazione.


  // METODO PER ELIMINARE UNA RICHIESTA DI RIMBORSO (BOZZA)
  deleteRequest(requestId: string): void {

    const dialogRef = this.dialog.open(  // Apre il dialogo di conferma per l'eliminazione della richiesta.
      ConfirmAction,  // Componente del dialogo di conferma per l'eliminazione della richiesta.
      {
        data: {   // Dati da passare al dialogo di conferma per l'eliminazione della richiesta.
          title: 'Delete Request', // Il titolo e il messaggio del dialogo di conferma vengono visualizzati all'utente tramite il template di ConfirmAction.
          message: 'Are you sure you want to delete this request?'
        },
        width: '400px'
      }
    );

    dialogRef.afterClosed().subscribe(  // Gestisce il risultato del dialogo di conferma per l'eliminazione della richiesta.
      confirmed => {   
        if (!confirmed) {   // Se l'utente non ha confermato l'eliminazione, esce dal metodo.
          return;
        }

        this.refundRequestService   // Chiama il servizio per eliminare la richiesta di rimborso.
          .deleteRequest(requestId)  // Effettua la chiamata al backend per eliminare la richiesta di rimborso.
          .subscribe({   // Subscrive al risultato dell'eliminazione della richiesta di rimborso per gestire il successo o l'errore.
            next: () => {  // In caso di successo dell'eliminazione della richiesta di rimborso.
              this.notificationService.success('Request deleted successfully'); // Notifica all'utente che la richiesta è stata eliminata con successo.
              this.loadRequests();  // Poi ricarica le richieste di rimborso per aggiornare la tabella.
            },

            error: (err) => {
              this.notificationService.error('Error during request deletion'); // Notifica all'utente che si è verificato un errore durante l'eliminazione della richiesta.
              console.error(
                'Error during request deletion:',
                err
              );
            }
          })
      }
    )

  }


  // METODO PER CARICARE LE RICHIESTE DI RIMBORSO DELL'UTENTE CORRENTE
  loadRequests(): void {

    const currentUser =
      this.authService.getCurrentUser(); // Recupera l'utente corrente dal servizio di autenticazione.

    if (!currentUser) {   // Se non c'è un utente corrente, esce dal metodo.
      return;   // Può succedere che un utente non sia autenticato o la sessione sia scaduta.
    }

    this.refundRequestService  // Chiama il servizio per ottenere le richieste di rimborso dell'utente corrente.
      .getRequestsByUserId(currentUser.id) // Recupera le richieste di rimborso dell'utente corrente dal backend.
      .subscribe({  // Poi gestisce il risultato della chiamata per aggiornare la tabella delle richieste.

        next: (requests) => {   // In caso di successo del recupero delle richieste di rimborso dell'utente corrente.
          this.dataSource.data = requests; // Aggiorna la tabella delle richieste di rimborso con i dati recuperati.
        }
        // this.dataSource.data è l'array di richieste di rimborso visualizzate nella tabella.
        // requests è l'array di richieste di rimborso recuperate dal backend.
        // Quindi this.dataSource.data viene aggiornato con le richieste recuperate dal backend.

      });

  }
}

}
```


////////////////////////////////////////////////////////////////////////////////////////////////////////

```TYPESCRIPT
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// BLOCCO CODICE CHE VENNE SOSTITUITO
///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // COSTRUTTORE DEL COMPONENTE CHE INIZIALIZZA LA TABELLA DELLE RICHIESTE DI RIMBORSO
  constructor() {  // Il costruttore permette di inizializzare la tabella delle richieste di rimborso

    // EFFETTO CHE AGGIORNA LA TABELLA QUANDO LE RICHIESTE CAMBIANO
    effect(() => {   // effect è una funzione reattiva che esegue il codice al suo interno ogni volta che i segnali utilizzati cambiano

      this.dataSource.data =  // quindi aggiorna i dati della tabella con le richieste correnti
        this.requests();

    });  // Questo effetto si assicura che la tabella venga aggiornata ogni volta che le richieste cambiano ad esempio quando l'utente effettua una nuova richiesta o una richiesta esistente viene modificata

    // PROBLEMA: matSort smette di funzionare correttamente (soprattutto all'avvio o quando la lista cambia) quando si utilizza questo effetto separato cioè fuori dall'effetto principale che gestisce i dati e i collegamenti.
  }

    // Perché succede questo: 
    // 1. Quando l'app parte, se requests() è inizialmente vuoto, la tabella non esiste nel DOM a causa di @if.
    // 2. I setter @ViewChild(MatSort) e @ViewChild(MatPaginator) non vengono attivati (ricevono undefined o non scattano proprio).
    // 3. Quando il Signal requests() riceve i dati, l'effect() aggiorna this.dataSource.data. Subito dopo, Angular crea la tabella nel DOM grazie ad @if.
    // 4. A questo punto scattano i setter di sort e paginator. Tuttavia, l'ordinamento iniziale che ho programmato (sortChange.emit) 
    // avviene PRIMA che la tabella sia pronta a renderizzare i dati ordinati, oppure il dataSource non recepisce correttamente la mutazione in quell'ordine di micro-task.

    // Quindi, per risolvere questo problema, utilizzo un unico effetto che gestisce sia l'aggiornamento dei dati sia il collegamento di sort e paginator  

  // 
  // CONFIGURAZIONE DELL'ORDINAMENTO DELLA TABELLA
  // Questo metodo viene chiamato automaticamente quando la vista del componente è inizializzata
  // e permette di configurare l'ordinamento della tabella delle richieste di rimborso.
  @ViewChild(MatSort)
  set sort(sort: MatSort) {

    if (!sort) {
      return;
    }

    this.dataSource.sort = sort;

    this.dataSource.sortingDataAccessor = (item, property) => {

      switch (property) {
        case 'referenceMonth': return item.referenceMonth;
        case 'creationDate': return new Date(item.creationDate).getTime();
        case 'totalRequestedAmount': return item.totalRequestedAmount;
        case 'totalApprovedAmount': return item.totalApprovedAmount ?? 0;
        default: return item[property as keyof RefundRequest] as any;
      }
    }

    //Ordinamento iniziale
    this.dataSource.sort.active = 'creationDate';
    this.dataSource.sort.direction = 'desc';
    this.dataSource.sort.sortChange.emit({
      active: 'creationDate',
      direction: 'desc'
    })
  }

  
  // COLLEGAMENTO DEL MATPAGINATOR ALLA DATASOURCE DELLA TABELLA
  //MatPaginator è un componente che gestisce la paginazione della tabella
  //Viene collegato alla datasource della tabella tramite il setter paginator
  @ViewChild(MatPaginator)  
  set paginator(paginator: MatPaginator) {   // uso il setter per collegare il MatPaginator alla datasource della tabella

    if (!paginator) {   // Se il paginator non è ancora disponibile, esci dal setter
      return;
    }
    //cosa vuol dire "se non c'è paginator"? Risposta: significa che il componente MatPaginator non è ancora stato inizializzato o non è presente nel template. In tal caso, non possiamo assegnarlo al dataSource, quindi usciamo dal metodo.

    this.dataSource.paginator = paginator;   // Collega il paginator alla datasource della tabella
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FINE DEL BLOCCO CHE VENNE SOSTITUITO
//////////////////////////////////////////////////////////////////////////////////////////////////////////
```