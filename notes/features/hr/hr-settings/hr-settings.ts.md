# COMMENTI

```TYPESCRIPT
export class HrSettings {

  constructor() {
    this.initializeForm();  // Inizializza il form reattivo con i dati della configurazione HR.
        // In questo modo il form sarà popolato con i dati della configurazione HR non appena il componente viene creato.

  }


  // INIETTAZIONE DELLA ROTTA ATTIVA
  private readonly route = inject(ActivatedRoute);  // Inietta l'ActivatedRoute per accedere ai dati della rotta corrente.


  // INIETTAZIONE DEL FORM BUILDER
  private readonly fb = inject(FormBuilder);  // Inietta il FormBuilder per creare form reattivi.


  // INIETTAZIONE DEL SERVIZIO DI CONFIGURAZIONE HR
  private readonly hrConfigService = inject(ConfigService);  // Inietta il servizio di configurazione HR per accedere e modificare le impostazioni HR.


  // INIETTAZIONE DEL SERVIZIO DI NOTIFICHE
  private readonly notification = inject(Notification);


  // INIETTAZIONE DEL ROUTER
  private readonly router = inject(Router);  // Inietta il Router per la navigazione programmatica.


  // COLONNE DA VISUALIZZARE NELLA TABELLA DEI LIMITI DI SPESE
  displayedColumns = [
    'category',
    'maxAmount',
    'receiptRequired'
  ]


  // SIGNAL PER LA CONFIGURAZIONE OTTENUTA DAL RESOLVER
  config = signal<AppConfig>(  // Inizializza il signal con i dati della configurazione ottenuti dal resolver.
    this.route.snapshot.data['config'] // Recupera i dati della configurazione risolti dal resolver prima che la rotta venga attivata.
    // snapshot permette di avere accesso ai dati risolti (forniti dal resolver) senza dover sottoscrivere un observable.
    // data contiene i dati risolti (forniti) dal resolver, in questo caso la configurazione HR.
    // [config] contiene la configurazione HR risolta dal resolver cioè quei dati che sono stati preparati prima che la rotta venisse attivata.
  );



  // INIZIALIZZAZIONE DEL FORM REATTIVO
  form = this.fb.group({   // .group crea un gruppo di controlli del form reattivo.
    expenseLimits: this.fb.array([])  // Array reattivo per i limiti di spesa, inizialmente vuoto.
  });


  // GETTER PER L'ARRAY REATTIVO DEI LIMITI DI SPESE
  get expenseLimits(): FormArray {  // Restituisce l'array reattivo dei limiti di spesa dal form.
    return this.form.get('expenseLimits') as FormArray;  // Cast del controllo del form come FormArray.
    // Devo fare il cast del controllo del form come FormArray per poter accedere ai metodi specifici degli array reattivi. 
    // In questo caso, posso usare metodi come push() per aggiungere nuovi controlli all'array.
  }


  // INIZIALIZZAZIONE DEI CONTROLLI DEL FORM CON I DATI DELLA CONFIGURAZIONE HR
  // Questo metodo popola l'array reattivo dei limiti di spesa con i dati ottenuti dalla configurazione HR.
  private initializeForm(): void {
    this.config()?.expenseLimits.forEach(limit => {  // Itera su ciascun limite di spesa nella configurazione HR e crea un controllo del form per ciascuno.

      this.expenseLimits.push(  // Uso il metodo push() dell'array reattivo per aggiungere un nuovo controllo del form.
        this.fb.group({  // Crea un gruppo di controlli del form per il limite di spesa corrente.
          id: [limit.id],  // Identificatore univoco del limite di spesa.
          name: [limit.name],  // Nome del limite di spesa.
          maxAmount: [limit.maxAmount],  // Importo massimo consentito per il limite di spesa.
          receiptRequired: [limit.receiptRequired]  // Indica se è richiesta la ricevuta per il limite di spesa.
        })
      );

    });
  }


  // METODO PER SALVARE LE MODIFICHE ALLA CONFIGURAZIONE HR
  // Questo metodo crea un oggetto di configurazione aggiornato con i dati del form reattivo e chiama il servizio per aggiornare la configurazione HR.
  save(): void {

    const updatedConfig: AppConfig = {  // Crea un oggetto di configurazione aggiornato con i dati del form reattivo.
      ...this.config(),   // Copia tutte le proprietà esistenti della configurazione HR.
      expenseLimits: this.form.value.expenseLimits as ExpenseLimit[] ?? []  // Aggiorna i limiti di spesa con i dati del form reattivo, oppure usa un array vuoto se non ci sono dati.
      // Ho fatto il cast dei dati del form reattivo come array di ExpenseLimit per garantire il tipo corretto.
      // Ho usato l'operatore di coalescenza nulla (??) per garantire che, se non ci sono dati nel form reattivo, venga utilizzato un array vuoto.
    };

    this.hrConfigService   // Chiamo il servizio per aggiornare la configurazione HR con l'oggetto aggiornato.
      .updateConfig(updatedConfig)  // Chiamata al servizio per aggiornare la configurazione HR.\
      .subscribe(config => {  // Sottoscrizione alla risposta del servizio per aggiornare la configurazione HR.
        this.config.set(config);  // Aggiorna la configurazione HR locale con i dati ricevuti dal servizio.
      });


    this.notification.success('Configuration saved successfully.');
    

    this.router.navigate(['/hr/dashboard']);  // Naviga alla pagina delle impostazioni HR dopo il salvataggio.
  }


}
```
