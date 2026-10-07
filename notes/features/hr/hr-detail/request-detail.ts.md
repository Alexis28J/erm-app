# COMMENTI

```TYPESCRIPT
export class RequestDetail {

  constructor() {

    // EFFECT: Monitora i cambiamenti della risorsa della richiesta di rimborso e aggiorna lo stato della richiesta corrente di conseguenza.
    // In generale, la funzione effect() viene chiamata ogni volta che uno o più segnali (Signal) letti al suo interno cambiano il loro valore.
    // L'effect è reattivo ma non vuol dire che aggiornerà automaticamente la vista; aggiorna, in modo asincrono, solo lo stato interno e il form.

    effect(() => {

      const request = this.requestResource();  // Ottieni la risorsa grezza della richiesta di rimborso corrente

      if (!request) {  // Se la risorsa della richiesta di rimborso non è disponibile, esci dall'effetto.
        return;
      }

      this.request.set(request);  // Aggiorna la richiesta corrente con la risorsa grezza ottenuta

      this.form.patchValue({    // Aggiorna il valore del form con le note HR della richiesta corrente
        noteHr: request.noteHr ?? ''  // Se non ci sono note HR, imposta il valore del form a stringa vuota
      });
      // NB: patchValue è un metodo che aggiorna i valori del form senza sovrascrivere l'intero stato del form

      // if (request.status === RequestStatus.PENDING &&  
      //   !this.alreadyReviewed) {   // Se la richiesta è in stato PENDING e non è già stata revisionata
      //     this.alreadyReviewed = true;   // Segna la richiesta come già revisionata dall'HR
      //     this.markAsInProgress(request);  // Segna la richiesta come "in corso" nell'HR
      // }

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


  // VARIABILE CHE INDICA SE LA RICHIESTA È GIÀ STATA REVISIONATA DALL'HR
  // private alreadyReviewed = false;  // Indica se la richiesta è già stata revisionata dall'HR 
  // Viene inizializzata a false e aggiornata quando l'HR revisiona la richiesta


  // VARIABILE CHE INDICA SE SI È IN MODALITÀ DI REVISIONE DELLA RICHIESTA
  readonly reviewMode = signal(false);


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
  // Se dopo aver approvato la richiesta, l'HR vuole aggiornare cioè modificare l'importo approvato di una singola spesa, questo metodo viene chiamato.
  // Senza questo metodo, l'importo approvato non verrebbe aggiornato correttamente quando l'HR modifica il valore nel form.
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


    // VARIABILE CHE CONTIENE L'IMPORTO TOTALE APPROVATO DELLE SPESE (utile per determinare lo stato della richiesta)
    const approvedAmount = this.approvedTotal() ?? 0;  
    // this.approvedTotal() restituisce l'importo totale approvato delle spese
    // mentre che ?? 0 significa che se this.approvedTotal() restituisce null o undefined, allora viene considerato 0

    // Quando può essere utile questo fallback? Ad esempio, se non ci sono spese approvate, this.approvedTotal() potrebbe restituire null o undefined, 
    // quindi ?? 0 garantisce che approvedAmount sia sempre un numero.
    // Quando si dice che non ci sono spese approvate, significa che l'HR non ha ancora approvato nessuna delle spese della richiesta. La richiesta può essere in stato PENDING o IN_PROGRESS.


    // VARIABILE CHE CONTIENE LO STATO DELLA RICHIESTA IN BASE ALL'IMPORTO APPROVATO
    let status: RequestStatus;  
    

    // Controllo se l'importo approvato è inferiore all'importo totale richiesto per determinare lo stato della richiesta
    if (approvedAmount < request.totalRequestedAmount) {
      status = RequestStatus.PARTIAL_APPROVED;
    } else {
      status = RequestStatus.APPROVED;
    }


    // Aggiorno la richiesta con lo stato calcolato (parziale o approvato) e l'importo approvato
    // In questo modo aggiorniamo lo stato della richiesta e l'importo approvato in un'unica operazione
    const updatedRequest: RefundRequest = {   // Crea un nuovo oggetto RefundRequest aggiornato con lo stato approvato e le informazioni dal form

      ...request,  // uso il metodo spread per copiare tutte le proprietà esistenti della richiesta corrente

      //status: RequestStatus.APPROVED,
      status, // stato della richiesta basato sull'importo approvato
      noteHr: this.form.value.noteHr ?? '',

      // totalApprovedAmount: this.approvedTotal(),  // Calcola l'importo totale approvato sommando gli importi approvati di tutte le spese
      totalApprovedAmount: approvedAmount,  // totalApprovedAmount rappresenta l'importo totale approvato delle spese
      
      lastUpdateDate: new Date().toISOString()
    };  // Chiudi l'oggetto aggiornato con le nuove informazioni della richiesta


    // Aggiorno lo stato della richiesta nel contesto locale (cioè nell'interfaccia utente) prima di inviarla al server
    // Questo passaggio è utile per aggiornare immediatamente l'interfaccia utente con lo stato più recente della richiesta, 
    // anche prima che la risposta del server arrivi.
    this.request.set(updatedRequest);


    // Invio la richiesta aggiornata al server per salvare le modifiche
    // Quindi, prima aggiorno lo stato nell'interfaccia utente e poi invio la richiesta al server
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


  // Creo l'oggetto aggiornato della richiesta con lo stato rifiutato e l'importo approvato a 0
  const updatedRequest: RefundRequest = {   

      ...request,

      status: RequestStatus.REJECTED,
      noteHr: this.form.value.noteHr ?? '',
      totalApprovedAmount: 0,  // Imposta l'importo totale approvato a zero poiché la richiesta è stata rifiutata
      lastUpdateDate: new Date().toISOString()
    };  // Chiudi l'oggetto aggiornato con le nuove informazioni della richiesta


    // Aggiorno lo stato della richiesta nell'interfaccia utente prima di inviarla al server
    this.request.set(updatedRequest);


    // Invio la richiesta aggiornata al server per salvare le modifiche
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

    this.request.set(updatedRequest);   // Aggiorna la richiesta corrente con l'oggetto aggiornato mell'interfaccia utente


    // Aggiornamento della richiesta sul server
    this.refundRequestService  // Chiama il servizio per aggiornare la richiesta nel backend
      .updateRequest(request.id!, updatedRequest)  // Invia la richiesta aggiornata al servizio per salvarla nel backend
      .subscribe(); // subscribe serve per eseguire effettivamente la richiesta HTTP, anche se non facciamo nulla con la risposta
      // Non serve ripetere il metodo updateRequest poiché la richiesta HTTP è già stata inviata e subscribe la esegue.
      
  }


  // CALCOLO DELL'IMPORTO CONSENTITO TOTALE
  readonly totalAllowedAmount = computed(() => {  // Questo compute calcola l'importo totale consentito per la richiesta corrente.
  
      const request = this.request();   // Ottengo la richiesta corrente dallo stato reattivo.
  
      if (!request) {  // Se non c'è una richiesta corrente, restituisco 0.
        return 0;
      }
  
      return request.expenses.reduce((total, expense) => {  // Somma l'importo massimo consentito per ogni categoria di spesa.
        const category = EXPENSE_CATEGORIES.find(  // Trova la categoria di spesa corrispondente all'expense corrente.
          c => c.name === expense.category  // Confronta il nome della categoria con quella dell'expense corrente.
        );
  
        return total + (category?.maxAmount ?? 0); // Aggiunge l'importo massimo consentito della categoria corrente al totale.
        // Se la categoria non esiste, viene considerato 0.
      }, 0 // Valore iniziale della somma.
      );
  });
  
  
    // CALCOLO DELL'IMPORTO RICHIESTO TOTALE
    readonly totalRequestedAmount = computed(() => {  // Calcola l'importo totale richiesto per la richiesta corrente.
  
      const request = this.request();   // Ottengo la richiesta corrente dallo stato reattivo.
  
      if (!request) {  // Se non c'è una richiesta corrente, restituisco 0.
        return 0;
      }
  
      return request.expenses.reduce(  // Somma l'importo richiesto per ogni spesa.
        (sum, expense) => sum + expense.requestedAmount,  // Aggiunge l'importo richiesto della spesa corrente al totale.
        0 // Valore iniziale della somma.
      );
    });


  // METODO PER INIZIARE LA REVISIONE DI UNA RICHIESTA
  startReview(): void {
    const request = this.request();  // Ottieni la richiesta corrente dal signal

    if (!request) {   // Se non esiste una richiesta corrente, esci dal metodo
      return;      // Questo controllo può prevenire errori se non c'è una richiesta corrente
    }

    this.reviewMode.set(true);  // Imposta la modalità di revisione su true

    if (request.status === RequestStatus.PENDING) {  // Se la richiesta è in stato PENDING, 
      this.markAsInProgress(request);  // viene marcata come IN_PROGRESS
    }

  }

}
```