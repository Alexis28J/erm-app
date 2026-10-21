# COMMENTI

```TYPESCRIPT
export class RequestInfo {

  // INPUTS
  // Questi input vengono passati al componente per configurarne il comportamento e i dati da visualizzare.
  // In questo modo, il componente può ricevere i dati della richiesta e sapere se deve essere visualizzato in modalità revisione.

  request = input.required<RefundRequest>();  // Input che rappresenta la richiesta di rimborso da visualizzare. Obbligatorio

  reviewMode = input(false);  // Input che indica se la visualizzazione è in modalità revisione. Inizialmente impostato su false

}
```