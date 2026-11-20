# COMMENTI

Un resolver in Angular è una funzione o un servizio che viene eseguito prima che una rotta venga attivata, permettendo di recuperare i dati necessari per la rotta prima che il componente venga caricato.

Quindi è utile per garantire che i dati necessari siano disponibili prima che il componente della rotta venga visualizzato.

In sintesi, per questo resolver, prima che la rotta venga attivata, Angular recupera la richiesta di rimborso dal servizio RefundRequestService utilizzando l'id presente nei parametri della rotta.

NOTA: Questo significa che nel componente che utilizza questo resolver, POSSIAMO ACCEDERE alla richiesta già caricata tramite route.snapshot.data['request'] senza dover fare ulteriori chiamate al backend.

E' una specie di pre-caricamento dei dati, che evita di dover fare chiamate asincrone nel componente stesso.


```TYPESCRIPT
import { ResolveFn } from '@angular/router';
import { RefundRequest } from '../core/interfaces/refund-request';
import { inject } from '@angular/core';
import { RefundRequestService } from '../core/services/refund-request.service';

// ResolveFn è un tipo di funzione fornito da Angular Router che rappresenta un resolver. 
// La funzione deve restituire un valore o un Observable/Promise che risolve (fornisce) il valore necessario per la rotta.
// In questo caso, il resolver recupera i dettagli di una richiesta di rimborso basata sull'ID fornito nei parametri della rotta.

  const refundRequestService = inject(RefundRequestService); // Inietto il servizio per le richieste di rimborso

  const id = route.paramMap.get('id'); // Recupero l'ID della richiesta dai parametri della rotta

  if (!id) {   // Se l'ID non è presente nei parametri della rotta, genero un errore
    throw new Error('Request id not found');  // throw è un'istruzione che genera un'eccezione 
    // e interrompe l'esecuzione del codice corrente
  }

  return refundRequestService.getRequestById(id); // Chiamo il servizio per ottenere i dettagli della richiesta basata sull'ID
```

Ho creato questo resolver per recuperare i dettagli di una richiesta di rimborso basata sull'ID fornito nei parametri della rotta.

Se l'ID non è presente, viene generato un errore. Altrimenti, viene chiamato il servizio per ottenere i dati della richiesta.

In questo modo, il componente che utilizza questo resolver riceverà i dati della richiesta già pronti, evitando di dover gestire il caricamento dei dati manualmente.

# NOTA: Non dimenticare di aggiungere questo resolver alla configurazione delle rotte del componente che ne ha bisogno.