# COMMENTI

```TYPESCRIPT
  // INPUTS
    // Questi input rappresentano i dati che il componente riceve dal componente genitore.
  // In questo modo, il componente può accedere ai dati passati dal componente genitore e utilizzarli nella sua logica e nel template.
  // Quindi, non devo copiare tutta la logica o i dati nel componente figlio, ma posso semplicemente riceverli come input.
  request = input.required<RefundRequest>();  // Input che rappresenta l'intero oggetto request passato dal componente genitore. Obbligatorio.

  reviewMode = input(false);  // input che indica se siamo in modalità revisione o meno. Inizialmente impostato su false.

  formError = input('');  // Input che rappresenta eventuali errori del form. Inizialmente vuoto.

  expenseLimits = input.required<ExpenseLimit[]>();  // Input che rappresenta i limiti di spesa per le categorie. Obbligatorio.


  // OUTPUTS
  // Output che emette l'importo approvato per una determinata spesa. Contiene l'ID della spesa e il valore approvato.
  // Questo output viene utilizzato per notificare al componente genitore quando l'importo approvato di una spesa cambia.
  approvedAmountChanged = output<{ 
    expenseId: string;
    value: number;
  }>();


  // METODO DI SUPPORTO SOLO UI
  // Metodo di supporto cioè utile solo per la UI, per ottenere l'importo massimo consentito per una determinata categoria di spesa.
  // Il componente padre passa i limiti di spesa e questo metodo li utilizza per determinare l'importo massimo consentito per ciascuna categoria.
  getMaxAmount(categoryName: string): number {

    return this.expenseLimits()
      .find(limit => limit.name === categoryName)
      ?.maxAmount ?? 0;

  }
```