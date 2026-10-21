# COMMENTI

```TYPESCRIPT
export class HrNotes {

  // INPUTS
  // Questi input provengono dal componente genitore e vengono utilizzati per gestire il modulo, la modalità di revisione e la richiesta di rimborso.
  // In questo modo, il componente può ricevere i dati necessari dal genitore e utilizzarli correttamente nel template e nella logica del componente.

  form = input.required<FormGroup>(); // Input per il modulo del componente. Obbligatorio

  reviewMode = input.required<boolean>(); // Input per la modalità di revisione. Obbligatorio

  request = input.required<RefundRequest>(); // Input per la richiesta di rimborso. Obbligatorio

}
```