# COMMENTI

```TYPESCRIPT
export class RequestDetails {

  // COSTRUTTORE DEL COMPONENTE CHE INIZIALIZZA L'EFFECT PER IL FOCUS DELLA CARD
  constructor() {

    // 2. L'effect monitora costantemente il Signal 'focusCard'
    effect(() => {
      const card = this.focusCard();

      // 3. Non appena la card appare nel DOM (diventa diversa da undefined), agisce di conseguenza
      if (card) {
        this.focusService.setCustomTarget(card);
        // Se il servizio non fa già il .focus() internamente, puoi farlo qui:
        // card.nativeElement.focus(); 
      }
    })

  }


  // INIEZIONE DEI SERVIZI E RECUPERO DELL'ID DELLA RICHIESTA DI RIMBORSO
  private route = inject(ActivatedRoute); // ActivatedRoute è un servizio che fornisce informazioni sulla route attiva, inclusi i parametri della route
  private refundRequestService = inject(RefundRequestService);  // Servizio per interagire con le richieste di rimborso

  private requestId = this.route.snapshot.paramMap.get('id');  // utilizza il parametro 'id' della route per ottenere l'ID della richiesta di rimborso
  // snapshot è una proprietà di ActivatedRoute che rappresenta lo stato della route al momento dell'accesso, inclusi i parametri della route

  private focusService = inject(FocusService);

  // private focusCard = viewChild.required<ElementRef<HTMLElement>>('focusCard'); 
  // Poiché l'elemento HTML da focalizzare si trova dentro un @if, non posso forzare il focus immediatamente alla creazione del componente. 
  // Devo aspettare che il rendering successivo sia completato.

  // 1. Rimuovo .required() -> Ora restituisce ElementRef o undefined
  private focusCard = viewChild<ElementRef<HTMLElement>>('focusCard');


  // CONVERSIONE DELL'OBSERVABLE IN SIGNAL
  request = toSignal<RefundRequest | null>(  // Converte l'Observable restituito dal servizio in un Signal, che è una rappresentazione reattiva dello stato della richiesta di rimborso
    // <RefundRequest | null> indica il tipo di valore che il Signal conterrà, in questo caso una richiesta di rimborso o null se non esiste
    this.refundRequestService   // Chiama il servizio per ottenere la richiesta di rimborso per l'ID specificato
      .getRequestById(this.requestId!),
    {
      initialValue: null  // Valore iniziale del Signal, utilizzato prima che l'Observable restituisca un valore
    }
  );


  // SIGNAL PER LA CONFIGURAZIONE DELL'APPLICAZIONE
  // Questo segnale contiene la configurazione dell'applicazione, risolta tramite il configResolver prima che la rotta venga attivata.
  // Utile per accedere ai limiti di spesa e altre impostazioni globali.
  config = signal<AppConfig>(  // <AppConfig> indica il tipo della configurazione dell'applicazione, cioè che this.config() restituirà un oggetto conforme all'interfaccia AppConfig.
    this.route.snapshot.data['config']
    // route: indica che stiamo prendendo i dati dalla route corrente (in questo caso, la route dell'edit request).
    // snapshot: rappresenta lo stato istantaneo della route in questo momento (utile per ottenere i parametri e i dati correnti della route).
    // data: contiene i dati risolti (forniti dai resolver) associati alla route, in questo caso la configurazione dell'applicazione.
    // ['config']: accede alla configurazione dell'applicazione risolta dal resolver.
  );


  // COMPUTED DELLE CATEGORIE DI SPESA
  // Questo computed restituisce le categorie di spesa definite nella configurazione dell'applicazione.
  expenseCategories = computed(
    () => this.config().expenseLimits
    // this.config(): otteniamo il valore corrente del segnale della configurazione dell'applicazione.
    // .expenseLimits: accediamo ai limiti di spesa definiti nella configurazione dell'applicazione.
  );


  // METODO PER OTTENERE L'IMPORTO MASSIMO CONSENTITO PER UNA CATEGORIA DI SPESA SPECIFICA
  // Questo metodo restituisce l'importo massimo consentito per una determinata categoria di spesa.
  getMaxAmount(categoryName: string): number {

    return this.expenseCategories()  // Ottiene le categorie di spesa dalla configurazione dell'applicazione
      .find(c => c.name === categoryName)?.maxAmount ?? 0; // Restituisce l'importo massimo consentito per la categoria specificata
    // Se la categoria non viene trovata, restituisce 0 come importo massimo consentito.
  }


  // CALCOLO DELL'IMPORTO CONSENTITO TOTALE
  // Questo computed calcola l'importo consentito totale sommando gli importi massimi delle categorie delle spese della richiesta corrente.
  readonly totalAllowedAmount = computed(() => {

    const request = this.request();  // Recupera il segnale della richiesta corrente

    if (!request) {  // Se la richiesta non è disponibile, restituisce 0
      return 0;
    }

    return request.expenses.reduce((total, expense) => {  // Uso la funzione reduce per sommare gli importi massimi delle categorie
      // const category = EXPENSE_CATEGORIES.find( // Trova la categoria corrispondente all'expense corrente
      //   c => c.name === expense.category
      // );
      const category = this.expenseCategories().find(  // Trova la categoria corrispondente all'expense corrente dentro le categorie definite nella configurazione dell'applicazione.
      c => c.name === expense.category  // Confronta il nome della categoria dell'expense corrente con il nome della categoria nella configurazione.
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