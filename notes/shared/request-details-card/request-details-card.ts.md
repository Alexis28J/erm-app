```TYPESCRIPT
export class RequestDetailsCard {

  form = input.required<FormGroup>();

  request = input<RefundRequest | null>(null);

}

// Questo componente mostra i dettagli di una richiesta di rimborso. 
// Può essere utilizzato sia nel contesto di una nuova richiesta (new request) che nella modifica di una richiesta esistente (edit request).
// Riceve un FormGroup "form" e nel caso del componente edit request anche un oggetto "request" di tipo RefundRequest come input.
// Mostra le informazioni della richiesta solo se l'oggetto "request" non è nullo.
```