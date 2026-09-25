# COMMENTI

```TYPESCRIPT
export class RequestDetails {

  // INIEZIONE DEI SERVIZI E RECUPERO DELL'ID DELLA RICHIESTA DI RIMBORSO
  private route = inject(ActivatedRoute); // ActivatedRoute è un servizio che fornisce informazioni sulla route attiva, inclusi i parametri della route
  private refundRequestService = inject(RefundRequestService);  // Servizio per interagire con le richieste di rimborso

  private requestId = this.route.snapshot.paramMap.get('id');  // utilizza il parametro 'id' della route per ottenere l'ID della richiesta di rimborso
  // snapshot è una proprietà di ActivatedRoute che rappresenta lo stato della route al momento dell'accesso, inclusi i parametri della route


  // CONVERSIONE DELL'OBSERVABLE IN SIGNAL
  request = toSignal<RefundRequest | null>(  // Converte l'Observable restituito dal servizio in un Signal, che è una rappresentazione reattiva dello stato della richiesta di rimborso
    // <RefundRequest | null> indica il tipo di valore che il Signal conterrà, in questo caso una richiesta di rimborso o null se non esiste
    this.refundRequestService   // Chiama il servizio per ottenere la richiesta di rimborso per l'ID specificato
      .getRequestById(this.requestId!),
    {
      initialValue: null  // Valore iniziale del Signal, utilizzato prima che l'Observable restituisca un valore
    }
  );


  // CALCOLO DELL'IMPORTO CONSENTITO TOTALE
  // Questo computed calcola l'importo consentito totale sommando gli importi massimi delle categorie delle spese della richiesta corrente.
  readonly totalAllowedAmount = computed(() => {

    const request = this.request();  // Recupera il segnale della richiesta corrente

    if (!request) {  // Se la richiesta non è disponibile, restituisce 0
      return 0;
    }

    return request.expenses.reduce((total, expense) => {  // Uso la funzione reduce per sommare gli importi massimi delle categorie
      const category = EXPENSE_CATEGORIES.find( // Trova la categoria corrispondente all'expense corrente
        c => c.name === expense.category
      );

      return total + (category?.maxAmount ?? 0);  // Se la categoria esiste, aggiunge il suo importo massimo, altrimenti aggiunge 0
    }, 0   // Valore iniziale della somma
    );
  });


  // CALCOLO DELL'IMPORTO RICHIESTO TOTALE
  // Questo computed calcola l'importo richiesto totale sommando gli importi richiesti di tutte le spese della richiesta corrente.
  readonly totalRequestedAmount = computed(() => {

    const request = this.request();  // Recupera il segnale della richiesta corrente

    if (!request) {  // Se la richiesta non è disponibile, restituisce 0
      return 0;
    }

    return request.expenses.reduce( // Uso la funzione reduce per sommare gli importi richiesti di tutte le spese
      (sum, expense) => sum + expense.requestedAmount,  // Somma l'importo richiesto di ogni spesa
      0   // Valore iniziale della somma
    );
  });

}


// La barra di progresso totale prende in input l'importo richiesto totale e l'importo consentito totale 
// grazie ai segnali totalRequestedAmount e totalAllowedAmount che permettono di aggiornare dinamicamente la barra di progresso totale.

// Ma come si comunica l'importo richiesto totale e l'importo consentito totale alla barra di progresso totale?
// Si passa come input le proprietà totalRequestedAmount e totalAllowedAmount al componente TotalProgressBar nel template HTML grazie alla sintassi di binding di Angular.
// Vedi questa riga:
// <app-total-progress-bar 
//     [totalRequestedAmount]="totalRequestedAmount()" 
//     [totalAllowedAmount]="totalAllowedAmount()">
// </app-total-progress-bar>

//Quindi, in questo modo, posso usare il componente TotalProgressBar nel template HTML del componente RequestDetails o in qualsiasi altro componente che necessiti di visualizzare la barra di progresso totale.



```