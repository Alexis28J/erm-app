# COMMENTI

```TYPESCRIPT
export class EmployeeDetails {

  constructor() {

    // EFFECT PER AGGIORNARE I DATI DELLA TABELLA QUANDO LE RICHIESTE CAMBIANO
    effect(() => {

      const currentRequests = this.requestsResource();  // Ottiene le richieste correnti dal resource signal


      // Sia il metodo set che il metodo filter non possono essere usati direttamente sulle osservabili 
      // requestsResource è un observable convertito in signal tramite toSignal 
      // Il metodo set non può essere usato su requestsResource direttamente perché è un signal derivato da un observable, 
      // abbiamo quindi bisogno di un signal separato (this.requests) che possa essere aggiornato direttamente per memorizzare le richieste filtrate.
      // requestsResource contiene tutte le richieste, mentre this.requests conterrà solo quelle filtrate.
      this.requests.set(   // Esclude le richieste con stato "DRAFT"
        currentRequests.filter(  // Il metodo set aggiorna il signal con le richieste filtrate
          r => r.status !== "DRAFT" 
        )
      );

      // Aggiorna il dataSource della tabella con le richieste filtrate
      this.dataSource.data = this.requests();

      // Se non ci sono richieste filtrate, esce dall'effetto per evitare ulteriori operazioni
      if (!this.requests() || this.requests().length === 0) return;


      // Forza il rilevamento delle modifiche per aggiornare la vista con i nuovi dati della tabella
      this.cdr.detectChanges();

      // Imposta l'accessor per l'ordinamento dei dati nella tabella se non è già stato impostato
      // Il sortingDataAccessor definisce come i dati devono essere ordinati in base alle proprietà specificate.
      if (!this.dataSource.sortingDataAccessor) {
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case "referenceMonth": return item.referenceMonth;
            case "creationDate": return new Date(item.creationDate).getTime();
            case "status": return item.status;
            case "totalRequestedAmount": return item.totalRequestedAmount;
            case "totalApprovedAmount": return item.totalApprovedAmount ?? 0;
            default: return item[property as keyof RefundRequest] as any;
          }
        }
      }


      // Imposta il componente di ordinamento della tabella se non è già stato impostato
      if (this.sortComponent && !this.dataSource.sort) {  // Se il componente di ordinamento è presente e non è già stato impostato nel dataSource (dataSource.sort è undefined)
        this.dataSource.sort = this.sortComponent;

        this.sortComponent.active = "creationDate";
        this.sortComponent.direction = "desc";
      }


      // Imposta il componente di paginazione della tabella se non è già stato impostato
      if (this.paginatorComponent && !this.dataSource.paginator) {
        this.dataSource.paginator = this.paginatorComponent;
      }


      // Applica l'ordinamento iniziale della tabella se il componente di ordinamento è presente
      // Se prima abbiamo impostato il componente di ordinamento, perché dobbiamo scrivere doppio codice? 
      // Risposta: perché l'impostazione del componente di ordinamento non applica automaticamente l'ordinamento iniziale, quindi dobbiamo farlo manualmente.
      if (this.dataSource.sort) {
        this.dataSource.sort.sort({ id: "creationDate", start: "desc", disableClear: false });
      }  // Il primo .sort indica il componente di ordinamento della tabella, mentre il secondo .sort applica l'ordinamento iniziale.


    });

  }

  // CHANGE DETECTOR REF PER AGGIORNARE LA VISTA QUANDO NECESSARIO
  private cdr = inject(ChangeDetectorRef);


  // REFERENZE AI COMPONENTI DELLA TABELLA (SORT E PAGINATOR)
  @ViewChild(MatSort) sortComponent!: MatSort;
  @ViewChild(MatPaginator) paginatorComponent!: MatPaginator;


  // DATASOURCE PER LA TABELLA DELLE RICHIESTE
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


  //   Nel modello di Angular, i Signal si dividono in due categorie principali:
  // 1. Writable Signals (creati con signal()): rappresentano uno stato locale che puoi modificare direttamente usando .set(), .update(), o .asReadonly().
  // 2. Read-Only Signals (restituiti da computed() o toSignal()): rappresentano un valore che dipende da qualcos'altro. 
  // Non puoi forzarne il valore a mano, perché il loro compito è riflettere fedelmente la loro sorgente (in questo caso, il flusso del tuo Observable).


  // SIGNAL PER LE RICHIESTE DI RIMBORSO DELL'IMPIEGATO (WRITABLE SIGNAL) (NON FILTRATE)
  // A differenza di requestsResource, questo signal può essere modificato direttamente nel codice.
  // Ad esempio, è possibile aggiornare direttamente questo signal quando si aggiunge una nuova richiesta di rimborso.
  // Non è read-only, quindi può essere modificato direttamente.
  requests = signal<RefundRequest[]>([]);


  // SIGNAL PER LE RICHIESTE DI RIMBORSO DELL'IMPIEGATO  (READ-ONLY SIGNAL)
  // Questo signal è utilizzato per ottenere le richieste di rimborso dell'impiegato in modo reattivo
  // Ma è read-only cioè non può essere modificato direttamente tramite il codice, viene aggiornato solo quando i dati sottostanti cambiano
  // Ad esempio, quando vengono aggiornate le richieste di rimborso nel backend, questo signal rifletterà automaticamente tali cambiamenti.
  requestsResource = toSignal(
    this.route.paramMap.pipe(
      switchMap(params =>
        this.requestService.getRequestsByUserId(params.get('id')!)
          .pipe(catchError(error => {
            console.error(error);
            return of([]);
          }))
      )
    ),
    {
      initialValue: []
    }
  );

  // Il metodo switchMap è un metodo di RxJS che permette di mappare un Observable in un altro Observable, annullando le emissioni precedenti se ne arriva una nuova.
  // Ad esempio, se l'ID dell'impiegato cambia, tutte le richieste precedenti verranno annullate e verranno caricate solo le richieste relative al nuovo ID.
  // Senza questo metodo, tutte le richieste precedenti verrebbero eseguite anche se l'ID dell'impiegato cambia, causando possibili conflitti o dati obsoleti.


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

/////////////////////////////////////////////////////////////////////////////////////////////////////////

```TYPESCRIPT
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// BLOCCO CODICE CHE VENNE SOSTITUITO
////////////////////////////////////////////////////////////////////////////////////////////////////////
  constructor() {
    // EFFECT PER AGGIORNARE I DATI DELLA TABELLA QUANDO LE RICHIESTE CAMBIANO
    // EFFECT: aggiorna i dati della tabella ogni volta che le richieste cambiano
    effect(() => {
      this.dataSource.data = this.requests().filter(r => r.status !== 'DRAFT');
      // Aggiorna la tabella con le nuove richieste filtrate, escludendo quelle in stato 'DRAFT'.
    });

  }

  // VIEW CHILD PER IL MAT SORT (ORDINAMENTO DELLA TABELLA)
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// FINE DEL BLOCCO CODICE CHE VENNE SOSTITUITO
////////////////////////////////////////////////////////////////////////////////////////////////////////
```