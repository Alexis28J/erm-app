# COMMENTI

```TYPESCRIPT
export class EmployeeDetails {

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
      )
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

}
```