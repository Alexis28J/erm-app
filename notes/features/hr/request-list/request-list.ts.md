# COMMENTI

```TYPESCRIPT
export class RequestList {

  constructor() {

    // DEFINIZIONE DEL FILTRO DI RICERCA PERSONALIZZATO PER LA TABELLA
    this.dataSource.filterPredicate = (request, filter) => {  // filterPredicate è la funzione di Angular Material utilizzata per determinare se una riga della tabella corrisponde al filtro di ricerca

      const searchableText = [
        request.referenceMonth,
        request.creationDate,
        request.status,
        request.totalRequestedAmount,
        // request.totalApprovedAmount ?? 0,
      ].join(' ').toLowerCase();  // Il metodo join concatena tutti gli elementi dell'array in una singola stringa, e toLowerCase converte tutto in minuscolo per facilitare la ricerca case-insensitive.

      return searchableText.includes(filter);  // Verifica se il testo concatenato contiene il filtro di ricerca (case-insensitive)

      // Perché non metto il filterPredicate dentro l'effect? Perché il filterPredicate deve essere definito una sola volta, non ogni volta che i dati cambiano.
    };


    // effect si esegue automaticamente quando il segnale 'requestResource' cambia, 
    // per esempio quando i dati delle richieste di rimborso vengono aggiornati nel backend 
    // a causa di modifiche esterne o altre operazioni asincrone.
    effect(() => {

      const req = this.requestResource();  // La variabile 'req' contiene il valore corrente del segnale 'requestResource'

      this.requests.set(   // Aggiorna il segnale 'requests' con le richieste filtrate che non sono in stato 'DRAFT'
        req.filter(
          request => request.status !== 'DRAFT'
        ));
        
      this.dataSource.data = this.requests();  // Aggiorna la dataSource della tabella con le richieste filtrate.
    }); // this.requests() contiene le richieste di rimborso filtrate, escluse quelle in stato 'DRAFT'.


    
      this.dataSource.filter = this.filterValue().trim().toLowerCase(); // Applica il filtro di ricerca alla tabella

  }

  
  @ViewChild(MatSort)  // @ViewChild è un decoratore che permette di ottenere un riferimento a un elemento figlio del template, in questo caso il MatSort della tabella.
  // Questo permette di collegare il MatSort alla dataSource della tabella, abilitando l'ordinamento delle colonne. 
  set sort(sort: MatSort) {  // Imposta il MatSort per la tabella e definisce l'accessor (funzione di accesso) dei dati per l'ordinamento delle colonne.
    if (!sort) {  // Se il MatSort non è disponibile, esci dalla funzione.
      return;
    }

    this.dataSource.sort = sort;  // Collega il MatSort alla dataSource della tabella per abilitare l'ordinamento delle colonne.

    this.dataSource.sortingDataAccessor = (item, property) => {

      // Questo blocco definisce l'accessor (funzione di accesso) dei dati per l'ordinamento delle colonne.
      // L'accessor dei dati viene utilizzato dalla tabella per determinare come ordinare i valori delle colonne.
      switch (property) {
        case 'month': return item.referenceMonth;
        case 'creationDate': return new Date(item.creationDate).getTime();
        case 'amount': return item.totalRequestedAmount;
        default: return item[property as keyof RefundRequest] as any;
      }
    };

    // Ordinamento iniziale

    this.dataSource.sort.active = 'creationDate';
    this.dataSource.sort.direction = 'desc';
    this.dataSource.sort.sortChange.emit({
      active: 'creationDate',
      direction: 'desc'
    });
  }


  // COLLEGAMENTO DEL MATPAGINATOR ALLA DATASOURCE DELLA TABELLA
  //MatPaginator è un componente che gestisce la paginazione della tabella
  //Viene collegato alla datasource della tabella tramite il setter paginator
  @ViewChild(MatPaginator)  
  set paginator(paginator: MatPaginator) {   // uso il setter per collegare il MatPaginator alla datasource della tabella

    if (!paginator) {   // Se il paginator non è ancora disponibile, esci dal setter
      return;
    }
    //Cosa vuol dire "se non c'è paginator"? Risposta: significa che il componente MatPaginator non è ancora stato inizializzato o non è presente nel template. In tal caso, non possiamo assegnarlo al dataSource, quindi usciamo dal metodo.

    this.dataSource.paginator = paginator;   // Collega il paginator alla datasource della tabella
  }


  // FONTE DEI DATI PER LA TABELLA DELLE RICHIESTE DI RIMBORSO
  dataSource = new MatTableDataSource<RefundRequest>();  // Fonte dei dati per la tabella delle richieste di rimborso


  // INIEZIONI DI SERVIZI
  private refundRequestService = inject(RefundRequestService);
  private router = inject(Router);

  // Segnale per memorizzare le richieste di rimborso
  requests = signal<RefundRequest[]>([]);

  // Segnale per memorizzare la risorsa delle richieste di rimborso
  requestResource = toSignal(
    this.refundRequestService.getAllRequests(),
    {
      initialValue: [] // Valore iniziale vuoto per il segnale 'requestResource' per garantire che ci sia sempre un array disponibile anche prima che l'Observable emetta il primo valore.
    }
  );

  // Qual'è la differenza tra 'requests' e 'requestResource'
  // 'requests' è un segnale che memorizza direttamente le richieste di rimborso filtrate, 
  // escludendo quelle in stato 'DRAFT' (vedi l'effect nel costruttore).
  // 'requestResource' è un segnale derivato da un Observable che rappresenta la risorsa delle richieste di rimborso, con un valore iniziale. 
  // Contiene tutte le richieste di rimborso, comprese quelle in stato 'DRAFT'.

  // Quindi requests mi serve per avere una versione filtrata delle richieste di rimborso, 
  // escludendo quelle in stato 'DRAFT', mentre requestResource contiene tutte le richieste.
  // Inoltre, essendo 'requests' un signal, può essere utilizzato direttamente nei template Angular per aggiornare automaticamente la vista quando il suo valore cambia.
  // Invece, 'requestResource' è utile quando si vuole accedere a tutte le richieste di rimborso, comprese quelle in stato 'DRAFT'.



  // METODO PER VISUALIZZARE I DETTAGLI DI UNA RICHIESTA DI RIMBORSO
  viewDetails(id: string): void {

    this.router.navigate([
      '/hr/request-details', id
    ]);

  }


  // COLONNE DELLA TABELLA
  displayedColumns = [
    'month',
    'creationDate',
    'amount',
    'status',
    'actions'
  ];


  // SEGNALE PER MEMORIZZARE IL VALORE DEL FILTRO DI RICERCA
  // Segnale che memorizza il valore corrente del filtro di ricerca. Viene aggiornato ogni volta che l'utente digita nel campo di ricerca.
  filterValue = signal('');


  // METODO PER AGGIORNARE IL FILTRO DI RICERCA
  // Questo metodo viene chiamato quando l'utente digita nel campo di ricerca e aggiorna il filtro della tabella.
  updateFilter(event: Event): void {  

    this.filterValue.set(   // Aggiorna il segnale con il nuovo valore del filtro di ricerca
      (event.target as HTMLInputElement).value  // Ottiene il valore digitato dall'utente nel campo di ricerca
    )
    // event contiene l'evento di input generato dall'utente.
    // .target è l'elemento HTML che ha generato l'evento, in questo caso l'input di ricerca.
    // as HTMLInputElement serve a TypeScript per sapere che l'elemento HTML è un input di testo.
    // value è il valore digitato dall'utente nel campo di ricerca.

    // In sintesi, questo metodo aggiorna il segnale `filterValue` con il nuovo valore del filtro di ricerca ogni volta che l'utente digita nel campo di ricerca.

  }

      // Quindi, se dobbiamo ripassare i passaggi per FILTRARE LA TABELLA, il flusso è il seguente:
      // 1. L'utente digita nel campo di ricerca.
      // 2. Il valore del campo di ricerca viene memorizzato nel segnale `filterValue`.
      // 3. L'effetto viene eseguito e aggiorna `this.dataSource.filter` con il valore corrente di `filterValue`.
      // 4. Angular Material utilizza `filterPredicate` per determinare quali righe della tabella corrispondono al filtro.
}
```

