```typescript
import { RequestStatus } from "./enum";
import { Expense } from "./expense";

export interface RefundRequest {
    id: string;
    userId: string;
    referenceMonth: string;  //mese di riferimento della richiesta di rimborso, formato YYYY-MM
    creationDate: string;  // data di creazione della richiesta
    lastUpdateDate: string;  // data dell'ultimo aggiornamento della richiesta, quindi può essere la data di approvazione o di rifiuto della richiesta
    status: RequestStatus;
    totalRequestedAmount: number;
    totalApprovedAmount?: number;  //quando il dipendente invia la richiesta, l'importo approvato è nullo. Quando l'HR approva la richiesta, l'importo approvato viene aggiornato.
    noteEmployee?: string;
    noteHr?: string;
    expenses: Expense[]; // prenderà tutti gli expense associati a questa richiesta di rimborso
}
```

## NB:
Uso stringa e non Date per evitare problemi di serializzazione/deserializzazione con JSON poiché quest'ultimo non supporta direttamente il tipo Date, quindi è più semplice gestire le date come stringhe in formato ISO 8601 (ad esempio "2023-06-15T00:00:00Z") per garantire la compatibilità tra client e server.

In un progetto reale, potrei considerare l'uso di un tipo più specifico o di una libreria per la gestione delle date, come moment.js o date-fns, per garantire una gestione coerente delle date in tutto il progetto.