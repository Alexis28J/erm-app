# COMMENTI

```TYPESCRIPT
export class EmployeeDetails {

    constructor() {

    // EFFECT: aggiorna i dati della tabella ogni volta che le richieste cambiano
    effect(() => {
      this.dataSource.data = this.requests().filter(r => r.status !== 'DRAFT');
      // Aggiorna la tabella con le nuove richieste filtrate, escludendo quelle in stato 'DRAFT'.
    });

  }

  @ViewChild(MatSort)  // @ViewChild è un decoratore che permette di ottenere 
  // un riferimento a un elemento figlio del template, in questo caso il MatSort della tabella.
  // Questo permette di collegare il MatSort alla dataSource della tabella, abilitando l'ordinamento delle colonne.

  set sort(sort: MatSort) {  // Imposta il MatSort per la tabella e definisce l'accessor (funzione di accesso) dei dati per l'ordinamento delle colonne.

    if (!sort) {  // Se il MatSort non è disponibile, esci dalla funzione.
      return;
    }

    this.dataSource.sort = sort;  // Collega il MatSort alla dataSource della tabella per abilitare l'ordinamento delle colonne.

    this.dataSource.sortingDataAccessor = (  // sortingDataAccessor definisce come ottenere i valori delle proprietà per l'ordinamento delle colonne.
      item,  // L'elemento della tabella corrente.
      property  // La proprietà della colonna per cui stiamo ottenendo il valore.
    ) => {

      switch (property) {  // Quindi, in base alla proprietà della colonna, restituisce il valore corretto per l'ordinamento.

        // Questo blocco definisce l'accessor (funzione di accesso) dei dati per l'ordinamento delle colonne.
        // L'accessor dei dati viene utilizzato dalla tabella per determinare come ordinare i valori delle colonne.

        case 'creationDate':  // Ordina le righe in base alla data di creazione.
          return new Date(item.creationDate).getTime(); // Converte la data di creazione in millisecondi per l'ordinamento.
        // Date() è un oggetto JavaScript che rappresenta una data e un'ora. getTime() restituisce il numero di millisecondi trascorsi dal 1 gennaio 1970.

        case 'requestedAmount':  // Ordina le righe in base all'importo richiesto.
          return item.totalRequestedAmount;

        case 'approvedAmount':  // Ordina le righe in base all'importo approvato.
          return item.totalApprovedAmount ?? 0;

        default:   // Per tutte le altre proprietà, restituisce il valore corrispondente dell'elemento.
          return item[property as keyof RefundRequest] as any;
        // as keyof è un'asserzione di tipo che indica che la proprietà è una chiave valida dell'oggetto RefundRequest.
        // as any è un'asserzione di tipo che indica che il valore può essere di qualsiasi tipo.
        // Quindi, item[property as keyof RefundRequest] as any; significa che stiamo accedendo dinamicamente alla proprietà dell'oggetto RefundRequest 
        // e trattandola come un valore di qualsiasi tipo.
      }

    };

  
    // Ordinamento iniziale della tabella (dal più recente al meno recente)
    this.dataSource.sort.active = 'creationDate';
    this.dataSource.sort.direction = 'desc';
    this.dataSource.sort.sortChange.emit({
      active: 'creationDate',
      direction: 'desc'
    });

  }

  
  dataSource = new MatTableDataSource<RefundRequest>(); // Fonte dei dati per la tabella delle richieste di rimborso


  // INIEZIONE DELLE DIPENDENZE
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private requestService = inject(RefundRequestService);


  // SIGNAL PER L'ID DELL'IMPIEGATO
  employeeId = toSignal(
    this.route.paramMap.pipe(   // Ottieni i parametri della route corrente
      map(params => params.get('id') ?? '') // Estrai l'ID dell'impiegato dai parametri della route. Lascia una stringa vuota se non è presente.
    ),
    {
      initialValue: ''  // Valore iniziale per l'ID dell'impiegato
    }
  );


  // SIGNAL PER I DETTAGLI DELL'IMPIEGATO
  employee = toSignal(
    this.route.paramMap.pipe(  // Ottieni i parametri della route corrente per caricare i dettagli dell'impiegato
      switchMap(params =>
        this.userService.getUserById(params.get('id')!) // Carica i dettagli dell'impiegato utilizzando l'ID estratto dai parametri della route
      )
    ),
    {
      initialValue: undefined  // Valore iniziale per i dettagli dell'impiegato. undefined e non una stringa vuota, perché i dettagli sono un oggetto.
    }
  );


  // Il metodo switchMap è un metodo di RxJS che permette di mappare un Observable in un altro Observable, annullando le emissioni precedenti se ne arriva una nuova.
  // Ad esempio, se l'ID dell'impiegato cambia, tutte le richieste precedenti verranno annullate e verranno caricate solo le richieste relative al nuovo ID.
  // Senza questo metodo, tutte le richieste precedenti verrebbero eseguite anche se l'ID dell'impiegato cambia, causando possibili conflitti o dati obsoleti.


  // SIGNAL PER LE RICHIESTE DI RIMBORSO DELL'IMPIEGATO
  requests = toSignal(
    this.route.paramMap.pipe(  // Ottieni i parametri della route corrente per caricare le richieste di rimborso dell'impiegato
      switchMap(params =>
        this.requestService.getRequestsByUserId(params.get('id')!) // Carica le richieste di rimborso dell'impiegato utilizzando l'ID estratto dai parametri della route
        .pipe(catchError(error => {   // Gestione degli errori: se si verifica un errore durante il recupero delle richieste, viene loggato e viene restituito un array vuoto.
            console.error(error);
            return of([]);   // Restituisce un array vuoto in caso di errore. Questo è utile per evitare che l'applicazione si blocchi e in casi che non ci siano dati disponibili.
          }))
      ) // Ricorda che il metodo .pipe viene utilizzato per concatenare operatori RxJS al flusso di dati in modo che possano essere applicate trasformazioni, filtri o gestione degli errori.
    ),
    {
      initialValue: []  // Valore iniziale per le richieste di rimborso dell'impiegato. Un array vuoto perché inizialmente non ci sono richieste.
    }
  );


  // COMPUTED PER IL NUMERO TOTALE DI RICHIESTE
  totalRequests = computed(
    () => this.requests().length  // Restituisce il numero totale di richieste dell'impiegato
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE APPROVATE
  approvedRequests = computed(
    () => this.requests().filter(
      r => r.status === 'APPROVED'
    ).length  // Restituisce il numero di richieste approvate dell'impiegato
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE RIFIUTATE
  rejectedRequests = computed(
    () => this.requests().filter(
      r => r.status === 'REJECTED'
    ).length  // Restituisce il numero di richieste rifiutate dell'impiegato
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE IN ATTESA
  pendingRequests = computed(
    () => this.requests().filter(
      r => r.status === 'PENDING' ||
        r.status === 'IN_PROGRESS'
    ).length  // Restituisce il numero di richieste in attesa dell'impiegato
  );


  // COMPUTED PER L'IMPORTO TOTALE RICHIESTO
  totalRequestedAmount = computed(
    () => this.requests().reduce(
      (sum, request) => sum + request.totalRequestedAmount,
      0
    )  // Restituisce l'importo totale richiesto dall'impiegato
  );


  // COMPUTED PER L'IMPORTO TOTALE APPROVATO
  totalApprovedAmount = computed(
    () => this.requests().reduce(
      (sum, request) => sum + (request.totalApprovedAmount ?? 0),
      0
    )  // Restituisce l'importo totale approvato dall'impiegato 
  );


  // COLONNE DA VISUALIZZARE NELLA TABELLA DELLE RICHIESTE
  displayedColumns = [
    'referenceMonth',
    'creationDate',
    'status',
    'requestedAmount',
    'approvedAmount',
    'actions'
  ]

}
```