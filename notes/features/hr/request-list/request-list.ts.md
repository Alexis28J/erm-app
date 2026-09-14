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
    });

  }

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