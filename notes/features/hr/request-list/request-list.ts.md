# COMMENTI

```TYPESCRIPT
export class RequestList {

  constructor() {

    // effect si esegue automaticamente quando il segnale 'requestResource' cambia, 
    // per esempio quando i dati delle richieste di rimborso vengono aggiornati nel backend 
    // a causa di modifiche esterne o altre operazioni asincrone.
    effect(() => {

      const requests = this.requestResource();  // La variabile 'requests' contiene il valore corrente del segnale 'requestResource'

      this.requests.set(   // Aggiorna il segnale 'requests' con le richieste filtrate che non sono in stato 'DRAFT'
        requests.filter(
          request => request.status !== 'DRAFT'
        ));
      this.dataSource.data = this.requests();  // Aggiorna la dataSource della tabella con le richieste filtrate.
    }); // this.requests() contiene le richieste di rimborso filtrate, escluse quelle in stato 'DRAFT'.

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


  dataSource = new MatTableDataSource<RefundRequest>();  // Fonte dei dati per la tabella delle richieste di rimborso


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
}
```