# COMMENTI

```TYPESCRIPT

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


  // COMPUTED PER L'IMPORTO TOTALE RICHIESTO (SOMMA DI TUTTE LE RICHIESTE NON IN BOZZA)
  totalRequestedAmount = computed(
    () => this.requestsResource().filter(
      r => r.status !== 'DRAFT'
    ).reduce(
      (sum, request) => sum + request.totalRequestedAmount,
      0
    )
  );


  // COMPUTED PER L'IMPORTO TOTALE APPROVATO
  totalApprovedAmount = computed(
    () => this.requests().reduce(
      (sum, request) => sum + (request.totalApprovedAmount ?? 0),
      0
    )  // Restituisce l'importo totale approvato dall'impiegato 
  );
```