# COMMENTI

```TYPESCRIPT
export class ReviewActions {

  // INPUTS 
  // Questi input rappresentano i dati che il componente riceve dall'esterno.
  // In questo modo, il componente può ricevere i dati dall'esterno e reagire ai cambiamenti senza gestirli internamente.

  request = input.required<RefundRequest>();  // Il dettaglio della richiesta di rimborso da visualizzare o modificare. Obbligatorio.

  reviewMode = input.required<boolean>();  // Indica se il componente è in modalità di revisione o meno. Obbligatorio.


  // OUTPUTS 
  // Questi output rappresentano gli eventi che il componente può emettere verso l'esterno.
  // In questo modo, il componente può comunicare le azioni dell'utente senza gestirle internamente.
  approve = output<void>();  // Evento emesso quando l'utente approva la richiesta.

  reject = output<void>();  // Evento emesso quando l'utente rifiuta la richiesta.

  startReview = output<void>();  // Evento emesso quando l'utente avvia la revisione della richiesta.

  exitReview = output<void>();  // Evento emesso quando l'utente esce dalla modalità di revisione.

}

// Per usare gli input nel template è necessario accedere alle proprietà come metodi, ad esempio:
// request() invece di request
// reviewMode() invece di reviewMode


// Mentre gli output si usano come metodi per emettere gli eventi, ad esempio:
// approve.emit() invece di approve
// reject.emit() invece di reject
// startReview.emit() invece di startReview
// exitReview.emit() invece di exitReview
```