# COMMENTI

```TYPESCRIPT
export class TotalRequestedApproved {
  
  // INPUTS
  // Questi input rappresentano gli importi totali richiesti, consentiti e approvati.
  // In questo modo, il componente può ricevere i valori dall'esterno tramite gli input senza doverli calcolare internamente.
  
  requestedAmount = input.required<number>();  // Importo totale richiesto. Obbligatorio

  allowedAmount = input.required<number>();  // Importo totale consentito. Obbligatorio

  approvedAmount = input.required<number>();  // Importo totale approvato. Obbligatorio
  
}
```