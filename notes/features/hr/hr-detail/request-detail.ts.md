# COMMENTI

```TYPESCRIPT
export class RequestDetail {

  constructor() {

    // EFFECT: Monitora i cambiamenti della risorsa della richiesta di rimborso e aggiorna lo stato della richiesta corrente di conseguenza.
    effect(() => {

      const request = this.requestResource();  // Ottieni la risorsa grezza della richiesta di rimborso corrente

      if (!request) {  // Se la risorsa della richiesta di rimborso non è disponibile, esci dall'effetto.
        return;
      }

      this.request.set(request);  // Aggiorna la richiesta corrente con la risorsa grezza ottenuta

      if (request.status === RequestStatus.PENDING &&  //  Se la richiesta è in stato PENDING e non è ancora stata revisionata dall'HR
        !this.alreadyReviewed) {   
          this.alreadyReviewed = true;   // Segna la richiesta come già revisionata dall'HR
          this.markAsInProgress(request);  // Segna la richiesta come "in corso" nell'HR
      }

    })

  }

  // INIEZIONI DI DIPENDENZE
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private refundRequestService = inject(RefundRequestService);
  private fb = inject(FormBuilder);


  // VARIABILE CHE CONTIENE L'ID DELLA RICHIESTA DI RIMBORSO (PRESA DALL'URL)
  requestId = this.route.snapshot.paramMap.get('id') ?? '';


  // VARIABILE CHE CONTIENE LA RISORSA (OGGETTO GREZZO) DELLA RICHIESTA DI RIMBORSO (OTTENUTA DAL SERVIZIO)
  requestResource = toSignal(
    this.refundRequestService.getRequestById(this.requestId!),  // Ottieni la risorsa grezza della richiesta di rimborso dal servizio. ! indica che requestId non è null o undefined.
    { 
      initialValue: null 
    }  // Imposta il valore iniziale della signal a null. Questo garantisce che la signal abbia sempre un valore definito, anche prima che la risorsa grezza sia disponibile.
  );


  // VARIABILE CHE CONTIENE LA RICHIESTA DI RIMBORSO CORRENTE (AGGIORNATA IN BASE ALLA RISORSA)
  request = signal<RefundRequest | null>(null);  

  // A differenza della risorsa grezza, questa variabile contiene la richiesta di rimborso corrente aggiornata in base ai cambiamenti della risorsa.



  // FORM PER LE NOTE DELLA RISORSA HR
  form = this.fb.group({
    noteHr: ['']   // Campo per le note della risorsa HR. Aggiornabile tramite il form.
  });


  // VARIABILE COMPUTED CHE CONTIENE L'IMPORTO TOTALE APPROVATO DI TUTTE LE SPESE
  approvedTotal = computed(() => {

    const request = this.request();

    if (!request) {  // Se la richiesta non è disponibile, restituisci undefined.
      return;
    }

    return request.expenses.reduce(  // altrimenti somma gli importi approvati di tutte le spese  
      (sum, expense) => sum + (expense.approvedAmount ?? 0),  // parametro sum accumula la somma degli importi approvati, expense rappresenta ogni singola spesa
      0
    );
    // expense.approvedAmount viene considerato solo se definito (cioè non null o undefined), altrimenti si usa 0
    // , 0 rappresenta il valore iniziale della somma
  });


  // METODO PER AGGIORNARE L'IMPORTO APPROVATO DI UNA SINGOLA SPESA
  updatedApprovedAmount(expenseId: string, value: number): void {   // value rappresenta il nuovo importo approvato per la spesa specificata

    const request = this.request();  // Ottieni la richiesta di rimborso corrente

    if (!request) {   // Se la richiesta non è disponibile, esci dal metodo
      return;
    }


    // Se la richiesta non presenta spese approvate (caso provvisorio in fase di sviluppo), 
    // potrebbe essere necessario gestirlo qui (ad esempio mostrare un messaggio di avviso)
    if (this.approvedTotal() === 0) {
      this.formError = 'No expenses have been approved for this request!';
      return;
    }
    /////


    const updatedRequest: RefundRequest = {   // crea un nuovo oggetto RefundRequest aggiornato con l'importo approvato modificato per la spesa specificata
      
      ...request,   // Copia tutte le proprietà esistenti della richiesta corrente
      expenses: request.expenses.map(expense =>  // Aggiorna l'importo approvato solo per la spesa specificata
        expense.id === expenseId
        ? {  // Se l'ID della spesa corrisponde a quello specificato, aggiorna l'importo approvato
          ...expense,
          approvedAmount: value
        }
        : expense   // Se l'ID della spesa non corrisponde, mantieni la spesa invariata
      )
    };  // In questo modo viene creato un nuovo oggetto RefundRequest aggiornato con l'importo approvato modificato per la spesa specificata

    this.request.set(updatedRequest);   // Aggiorna la richiesta corrente con l'oggetto aggiornato
  }


  // METODO PER APPROVARE LA RICHIESTA DI RIMBORSO
  approveRequest(): void {   // Non accetta parametri, approva la richiesta corrente

    const request = this.request();  // Ottieni la richiesta di rimborso corrente

    if (!request) {   // Se la richiesta non è disponibile, esci dal metodo
      return;
    }

    const updatedRequest: RefundRequest = {   // Crea un nuovo oggetto RefundRequest aggiornato con lo stato approvato e le informazioni dal form

      ...request,  // uso il metodo spread per copiare tutte le proprietà esistenti della richiesta corrente

      status: RequestStatus.APPROVED,
      noteHr: this.form.value.noteHr ?? '',
      totalApprovedAmount: this.approvedTotal(),  // Calcola l'importo totale approvato sommando gli importi approvati di tutte le spese
      lastUpdateDate: new Date().toISOString()
    };  // Chiudi l'oggetto aggiornato con le nuove informazioni della richiesta


    this.request.set(updatedRequest);

    this.refundRequestService
      .updateRequest(updatedRequest.id!, updatedRequest)  // Invia la richiesta aggiornata al servizio per salvarla nel backend
      .subscribe({
        next: () => {
          this.router.navigate(['/hr/request-list']);
        }
      });
  }


  // METODO PER RIFIUTARE LA RICHIESTA DI RIMBORSO
  rejectRequest(): void {   // Non accetta parametri, rifiuta la richiesta corrente

    const request = this.request();  // Ottieni la richiesta di rimborso corrente

    if (!request) {   // Se la richiesta non è disponibile, esci dal metodo
      return;
    }

    const updatedRequest: RefundRequest = {   // Crea un nuovo oggetto RefundRequest aggiornato con lo stato rifiutato e le informazioni dal form

      ...request,

      status: RequestStatus.REJECTED,
      noteHr: this.form.value.noteHr ?? '',
      totalApprovedAmount: 0,  // Imposta l'importo totale approvato a zero poiché la richiesta è stata rifiutata
      lastUpdateDate: new Date().toISOString()
    };  // Chiudi l'oggetto aggiornato con le nuove informazioni della richiesta


    this.request.set(updatedRequest);

    this.refundRequestService
      .updateRequest(updatedRequest.id!, updatedRequest)  // Invia la richiesta aggiornata al servizio per salvarla nel backend
      .subscribe({
        next: () => {
          this.router.navigate(['/hr/request-list']);
        }
      });

  }


  // METODO PRIVATO PER MARCARE UNA RICHIESTA COME IN CORSO
  private markAsInProgress(request: RefundRequest): void {

    if (request.status !== RequestStatus.PENDING) {  // Se lo stato della richiesta non è "PENDING", esci dal metodo
      return;
    }

    const updatedRequest: RefundRequest = { // Crea un nuovo oggetto RefundRequest aggiornato con lo stato "IN_PROGRESS" e le informazioni esistenti della richiesta
      ...request,
      status: RequestStatus.IN_PROGRESS,
      lastUpdateDate: new Date().toISOString()
    };

    this.request.set(updatedRequest);   // Aggiorna la richiesta corrente con l'oggetto aggiornato


    this.refundRequestService  // Chiama il servizio per aggiornare la richiesta nel backend
      .updateRequest(request.id!, updatedRequest)  // Invia la richiesta aggiornata al servizio per salvarla nel backend
      .subscribe(); // subscribe serve per eseguire effettivamente la richiesta HTTP, anche se non facciamo nulla con la risposta
      // Non serve ripetere il metodo updateRequest poiché la richiesta HTTP è già stata inviata e subscribe la esegue.
  }
  
  
  // VARIABILE CHE INDICA SE LA RICHIESTA È GIÀ STATA REVISIONATA DALL'HR
  private alreadyReviewed = false;  // Indica se la richiesta è già stata revisionata dall'HR 
  // Viene inizializzata a false e aggiornata quando l'HR revisiona la richiesta

  

}
```