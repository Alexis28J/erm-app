# COMMENTI

```TYPESCRIPT
export class TotalProgressBar {

  // SIGNALS PER GLI INPUT DELL'IMPORTO RICHIESTO E CONSENTITO
  requestedAmount = input.required<number>();  // Signal reattivo per l'importo richiesto
  allowedAmount = input.required<number>();  // Signal reattivo per l'importo consentito


  // COMPUTED PER LA PERCENTUALE DI UTILIZZO DELL'IMPORTO CONSENTITO
  percentage = computed(() => { // Calcola la percentuale di utilizzo dell'importo consentito

    const requested = this.requestedAmount();  // Ottiene il valore corrente dell'importo richiesto
    const allowed = this.allowedAmount();  // Ottiene il valore corrente dell'importo consentito

    if (!allowed) {  // Se l'importo consentito è 0, restituisce 0 per evitare divisioni per zero.
      return 0;
    }

    return Math.min(  // Limita la percentuale massima al 100%
      (requested / allowed) * 100,
      100
    );

  });
  
  // Non c'è bisogno di scrivere allowed ? Math.min(...) : 0 perché il controllo su allowed è già stato effettuato all'inizio della funzione.

  // COMPUTED PER LA CLASSE DI PROGRESSO IN BASE ALLA PERCENTUALE
  totalProgressClass = computed(() => {
    const percent = this.percentage();

    if (percent <= 50) {
      return 'safe';

    } else if (percent > 50 && percent <= 80) {
      return 'warning';

    } else {
      return 'danger';
    }
  });
  
}
```