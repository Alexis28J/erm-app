# COMMENTI

```TYPESCRIPT
export class ExpenseLimitsSettings {

  constructor() {

    // this.initializeForm();  // Inizializza il form reattivo con i dati della configurazione HR.
       // In questo modo il form sarà popolato con i dati della configurazione HR non appena il componente viene creato.
 
    // Non più necessario poiché il form viene popolato tramite l'effect che osserva il signal della ConfigService.
    // La differenza principale è che ora il form si aggiorna automaticamente ogni volta che la configurazione cambia, 
    // senza bisogno di richiamare manualmente un metodo di inizializzazione.
    // L'effect osserva il signal della ConfigService e aggiorna il form ogni volta che la configurazione cambia.

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // EFFECT CHE OSSERVA IL SIGNAL DELLA CONFIGURAZIONE HR E AGGIORNA I LIMITI DI SPESA DI CONSEGUENZA
    effect(() => {

      const config = this.config();  // config() restituisce il valore corrente del signal

      if (!config) {  // Se la configurazione non è ancora disponibile, esci dall'effect
        return;
      }

      //////////////////////////////////////////////////////////////////////////
      // this.expenseLimits.clear();  // Pulisce l'array dei limiti di spesa prima di popolarlo 
      // // con i nuovi dati della configurazione

      // config.expenseLimits.forEach(limit => { // Popola l'array dei limiti di spesa con i dati della configurazione corrente
      //   this.expenseLimits.push(  // Aggiunge il gruppo di controlli appena creato all'array dei limiti di spesa
      //     this.fb.group({  // Crea un gruppo di controlli per ciascun limite di spesa
      //       id: [limit.id], 
      //       name: [limit.name],
      //       maxAmount: [limit.maxAmount],
      //       receiptRequired: [limit.receiptRequired]
      //     }) // limit è il parametro corrente del ciclo forEach che rappresenta un singolo limite di spesa
      //   );
      // })


      // Ho commentato questo pezzo di codice perché la tabella non si aggiornava correttamente (immediatamente) quando modificavo i limiti di spesa
      // Ora utilizzo setControl che mi permette di sostituire l'intero array dei limiti di spesa nel form in modo più efficiente
      // Inoltre, usando detectChanges() forzo il rilevamento delle modifiche subito dopo aver aggiornato il form
      // this.expenseLimits.clear();
      ///////////////////////////////////////////////////////////////////////////////

      // this.form.setControl(   // Commentato: Faccio un refactoring in modo di facilitare l'unit test
      //   'expenseLimits',      // Ho creato un metodo separato per costruire il form dei limiti di spesa (vedi buildExpenseLimitForm)
      //   this.fb.array<any>(
      //     config.expenseLimits.map(limit =>
      //       this.fb.group({
      //         id: [limit.id],
      //         name: [limit.name],
      //         maxAmount: [limit.maxAmount],
      //         receiptRequired: [limit.receiptRequired]
      //       })
      //     )
      //   )
      // );

      this.form.setControl(  // Aggiorna il controllo 'expenseLimits' con i nuovi valori dal form costruito
        'expenseLimits',  // Nome del controllo da aggiornare nel form. Viene messo come stringa perché setControl richiede il nome del controllo come primo argomento.
        this.buildExpenseLimitForm(  // Chiama il metodo che costruisce un FormArray a partire dai limiti di spesa presenti nella configurazione HR
          config.expenseLimits  // Array dei limiti di spesa presenti nella configurazione HR
        )
      );

      this.cdr.detectChanges();  // Forza il rilevamento delle modifiche dopo l'aggiornamento del form

    });

  }


  // // INIETTAZIONE DELLA ROTTA ATTIVA
  // private readonly route = inject(ActivatedRoute);  // Inietta l'ActivatedRoute per accedere ai dati della rotta corrente.

  // Commentato: l'iniezione della rotta attiva non è più necessaria perché la configurazione viene ottenuta tramite il resolver e il signal del ConfigService.
  // In questo modo, il componente non deve più preoccuparsi di recuperare la configurazione dalla rotta attiva, ma può semplicemente osservare il signal della ConfigService per ottenere i dati aggiornati.
  // Il route si occupava di fornire i dati della configurazione tramite snapshot, ma ora non è più necessario.


  // INIETTAZIONE DEL FORM BUILDER
  private readonly fb = inject(FormBuilder);  // Inietta il FormBuilder per creare form reattivi.


  // INIETTAZIONE DEL SERVIZIO DI CONFIGURAZIONE HR
  private readonly configService = inject(ConfigService);  // Inietta il servizio di configurazione HR per accedere e modificare le impostazioni HR.


  // INIETTAZIONE DEL SERVIZIO DI NOTIFICHE
  private readonly notification = inject(Notification);


  // INIETTAZIONE DEL ROUTER
  private readonly router = inject(Router);  // Inietta il Router per la navigazione programmatica.


  // INIETTAZIONE DEL CHANGE DETECTOR REF
  private readonly cdr = inject(ChangeDetectorRef);
  // Il change detector ref viene utilizzato per forzare il rilevamento delle modifiche quando il form viene aggiornato dinamicamente, ad esempio all'interno di un effect.


  // COLONNE DA VISUALIZZARE NELLA TABELLA DEI LIMITI DI SPESE
  displayedColumns = [
    'category',
    'maxAmount',
    'receiptRequired'
  ]

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // SIGNAL PER LA CONFIGURAZIONE OTTENUTA DAL RESOLVER
  // config = signal<AppConfig>(  // Inizializza il signal con i dati della configurazione ottenuti dal resolver.
    // this.route.snapshot.data['config'] // Recupera i dati della configurazione risolti dal resolver prima che la rotta venga attivata.
    // snapshot permette di avere accesso ai dati risolti (forniti dal resolver) senza dover sottoscrivere un observable.
    // data contiene i dati risolti (forniti) dal resolver, in questo caso la configurazione HR.
    // [config] contiene la configurazione HR risolta dal resolver cioè quei dati che sono stati preparati prima che la rotta venisse attivata.
  // );

  // Commentato: il signal per la configurazione ottenuta dal resolver non è più utilizzato perché ora si utilizza il signal del ConfigService.
  // In questo modo, il componente osserva direttamente il signal della ConfigService per ottenere la configurazione HR aggiornata.
  // Invece di utilizzare il signal ottenuto dal resolver, si utilizza direttamente il signal della ConfigService.
  // Questo permette di avere sempre la configurazione HR aggiornata senza dover fare affidamento sui dati iniziali della rotta.


  // SIGNAL CHE CONTIENE LA CONFIGURAZIONE HR
  readonly config = this.configService.config;
  // Qual'è la differenza tra config e config()?
  // config è il signal stesso che contiene la configurazione, mentre config() è il valore attuale del signal. 
  // Ad esempio, per leggere i dati attuali della configurazione si usa config(), mentre per aggiornare il signal si usa config.set(newValue).

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // INIZIALIZZAZIONE DEL FORM REATTIVO
  form = this.fb.group({   // .group crea un gruppo di controlli del form reattivo.
    expenseLimits: this.fb.array([])  // Array reattivo per i limiti di spesa, inizialmente vuoto.
  });


  // // GETTER PER L'ARRAY REATTIVO DEI LIMITI DI SPESE
  //get expenseLimits(): FormArray {  // Restituisce l'array reattivo dei limiti di spesa dal form.
    //return this.form.get('expenseLimits') as FormArray;  // Cast del controllo del form come FormArray.
    // Devo fare il cast del controllo del form come FormArray per poter accedere ai metodi specifici degli array reattivi. 
    // In questo caso, posso usare metodi come push() per aggiungere nuovi controlli all'array.
  //}

  // Ho commentato il getter precedente per l'array reattivo dei limiti di spese perché ora utilizzo la proprietà controls del form.
  // Invece prima si utilizzava il getter expenseLimits per ottenere l'array reattivo dei limiti di spese, 
  // ma ora si accede direttamente tramite this.form.controls.expenseLimits che è più chiaro e diretto.
  // Anche se la funzionalità rimane la stessa, questo approccio riduce la complessità e rende il codice più leggibile.


    get expenseLimits(): FormArray<any> {
    return this.form.controls.expenseLimits;
  }  
  
    // Tipizzando con FormArray<any> si indica che l'array reattivo può contenere qualsiasi tipo di controllo, in questo caso i gruppi di controlli per i limiti di spesa.
    // Ricorda che i controlli possono essere: FormControl, FormGroup o FormArray. In questo caso, ogni elemento dell'array è un FormGroup.
    // Posso usare invece FormArray<FormGroup> se voglio essere più specifico sul tipo di controlli contenuti nell'array ma in questo caso FormArray<any> è sufficiente e mantiene la flessibilità in caso di modifiche future.


  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // INIZIALIZZAZIONE DEI CONTROLLI DEL FORM CON I DATI DELLA CONFIGURAZIONE HR
  // Questo metodo popola l'array reattivo dei limiti di spesa con i dati ottenuti dalla configurazione HR.
  // private initializeForm(): void {
  //   this.config()?.expenseLimits.forEach(limit => {  // Itera su ciascun limite di spesa nella configurazione HR e crea un controllo del form per ciascuno.

  //     this.expenseLimits.push(  // Uso il metodo push() dell'array reattivo per aggiungere un nuovo controllo del form.
  //       this.fb.group({  // Crea un gruppo di controlli del form per il limite di spesa corrente.
  //         id: [limit.id],  // Identificatore univoco del limite di spesa.
  //         name: [limit.name],  // Nome del limite di spesa.
  //         maxAmount: [limit.maxAmount],  // Importo massimo consentito per il limite di spesa.
  //         receiptRequired: [limit.receiptRequired]  // Indica se è richiesta la ricevuta per il limite di spesa.
  //       })
  //     );

  //   });
  // }

  // Commentato: L'inizializzazione del form con i dati della configurazione HR viene ora gestita tramite l'effect nel costruttore, 
  // quindi non è più necessario avere un metodo separato per popolare i controlli del form.
  // In questo modo, il codice risulta più reattivo e sincronizzato con eventuali cambiamenti della configurazione HR.
  // Prima si utilizzava un metodo separato chiamato initializeForm per popolare i controlli del form con i dati della configurazione HR.
  // Quell'approccio era meno reattivo e di conseguenza poteva portare a discrepanze tra lo stato del form e la configurazione HR corrente.


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // METODO PER SALVARE LE MODIFICHE ALLA CONFIGURAZIONE HR

  // Questo metodo crea un oggetto di configurazione aggiornato con i dati del form reattivo e chiama il servizio per aggiornare la configurazione HR.
  // save(): void {

  //   const updatedConfig: AppConfig = {  // Crea un oggetto di configurazione aggiornato con i dati del form reattivo.
  //     ...this.config(),   // Copia tutte le proprietà esistenti della configurazione HR.
  //     expenseLimits: this.form.value.expenseLimits as ExpenseLimit[] ?? []  // Aggiorna i limiti di spesa con i dati del form reattivo, oppure usa un array vuoto se non ci sono dati.
  //     // Ho fatto il cast dei dati del form reattivo come array di ExpenseLimit per garantire il tipo corretto.
  //     // Ho usato l'operatore di coalescenza nulla (??) per garantire che, se non ci sono dati nel form reattivo, venga utilizzato un array vuoto.
  //   };

  //   this.hrConfigService   // Chiamo il servizio per aggiornare la configurazione HR con l'oggetto aggiornato.
  //     .updateConfig(updatedConfig)  // Chiamata al servizio per aggiornare la configurazione HR.\
  //     .subscribe(config => {  // Sottoscrizione alla risposta del servizio per aggiornare la configurazione HR.
  //       this.config.set(config);  // Aggiorna la configurazione HR locale con i dati ricevuti dal servizio.
  //     });


  //   this.notification.success('Configuration saved successfully.');
    
  //   this.router.navigate(['/hr/dashboard']);  // Naviga alla pagina delle impostazioni HR dopo il salvataggio.

  // }


  // Ho commentato la versione precedente del metodo save e l'ho sostituita con una nuova implementazione che utilizza direttamente il valore del form reattivo.
  // Prima il metodo save utilizzava hrConfigService e aggiornava la configurazione HR tramite subscribe, il che lo rendeva più complesso e meno integrato con il form reattivo.
  // Ora utilizza direttamente il valore del form reattivo per costruire la nuova configurazione.
  // Rispetto alla versione precedente, questa implementazione evita l'uso di subscribe direttamente nel componente e sfrutta il valore del form reattivo.
  // In sintesi, il nuovo metodo save è più semplice e si integra meglio con il form reattivo.

  // Nota: Con "più integrato con il form reattivo" mi riferisco al fatto che ora il metodo save utilizza direttamente i valori presenti nel form reattivo invece di fare affidamento su subscribe esterni.

  
  save(): void {

    const currentConfig = this.config();  // Recupera la configurazione HR corrente dal signal.

    if (!currentConfig) {   // Se non esiste una configurazione HR corrente, mostra un errore e interrompi il salvataggio.
      this.notification.error('No configuration available.');
      return;
    }

    const updatedConfig: AppConfig = {   // Costruisce la nuova configurazione HR basata sul valore corrente del form reattivo.
      ...currentConfig,  // Mantiene tutte le proprietà esistenti della configurazione HR corrente.
      expenseLimits: (this.form.getRawValue().expenseLimits as ExpenseLimit[] ?? [])  // Recupera i valori grezzi dal form, inclusi quelli disabilitati, per garantire che tutti i limiti di spesa siano considerati.
      // as ExpenseLimit[]: è necessario per garantire che TypeScript riconosca correttamente il modello dei limiti di spesa. Senza questo cast, TypeScript potrebbe non inferire correttamente il tipo degli elementi dell'array.
    };  
    };

    this.configService  // Chiama il servizio di configurazione HR per aggiornare la configurazione con i nuovi limiti di spesa.
      .updateConfig(updatedConfig)  // Esegue la chiamata HTTP per aggiornare la configurazione HR sul server.
      .subscribe({   // Gestisce la risposta della chiamata HTTP per aggiornare la configurazione HR. Subscribe gestisce sia il caso di successo che di errore.
        next: (config) => {  // Gestisce il caso di successo nel salvataggio della configurazione HR. config indica la nuova configurazione salvata.
          this.configService.setConfig(config);  // Aggiorna il signal della configurazione HR con la nuova configurazione salvata.
          this.notification.success('Configuration saved successfully.');
          this.router.navigate(['/hr/settings']);
        },
        error: (err) => {  // Gestisce l'errore nel caso in cui il salvataggio della configurazione HR fallisca.
          this.notification.error('Failed to save configuration.');
        }
      });


  // this.configService.setConfig(config); e this.configService.config.set(config); sono due modi diversi per aggiornare la configurazione. 

  // Hanno effetti diversi: il primo aggiorna la configurazione tramite il servizio, mentre il secondo aggiorna direttamente il signal della configurazione (this.configService.config).

  // E' meglio usare il primo metodo (this.configService.setConfig(config)) per garantire che tutte le parti dell'applicazione siano aggiornate correttamente. Inoltre, l'uso di this.configService.setConfig(config) permette di mantenere la logica di aggiornamento centralizzata nel servizio, evitando possibili incoerenze tra il signal e lo stato interno del servizio.

  // Quindi è di buon senso usare sempre this.configService.setConfig(config) per aggiornare la configurazione. Aggiornare direttamente il signal potrebbe portare a comportamenti inattesi.

  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // METODO PER IMPORTARE I LIMITI DI SPESE DA UN FILE EXCEL
  // Questo metodo gestisce l'importazione dei limiti di spese da un file Excel
  // importExpenseLimits(event: Event): void {

  //   const file = (event.target as HTMLInputElement).files?.[0];  // Ottieni il primo file selezionato dall'input file. 
  //   // Questo vuol dire che se l'utente seleziona più file, verrà considerato solo il primo.

  //   if (!file) {  // Se non è stato selezionato alcun file, esci dal metodo.                                                                                                                        
  //     return;
  //   }

  //   const reader = new FileReader();  // Creo un oggetto FileReader per leggere il contenuto del file Excel.

  //   reader.onload = (e) => {  // onload viene chiamato quando il file è stato letto correttamente

  //     try {   // Provo a leggere e processare il file Excel. try è usato per catturare eventuali errori durante la lettura e il parsing del file.

  //       const arrayBuffer = e.target?.result as ArrayBuffer;  // Converto il risultato della lettura del file in un ArrayBuffer, necessario per XLSX.read

  //       const workbook = XLSX.read(  // Leggo il contenuto del file Excel e creo un oggetto workbook
  //         arrayBuffer,  // ArrayBuffer contenente i dati del file Excel
  //         {
  //           type: 'array'  // Specifico che il tipo di input è un array di byte (ArrayBuffer)
  //         }
  //       );

  //       const worksheet = workbook.Sheets[workbook.SheetNames[0]];  // Ottengo il primo foglio di lavoro dal workbook
  //       // Questo vuol dire che consideriamo solo il primo foglio di lavoro del file Excel e non eventuali altri fogli presenti.

  //       const rawData = XLSX.utils.sheet_to_json(  // Converto il foglio di lavoro in un array di oggetti JSON
  //         worksheet
  //       );

  //       console.log('RAW DATA', rawData);  // Mostro i dati raw ottenuti dal foglio Excel prima della conversione in oggetti ExpenseLimit
  //       // Questo aiuta a verificare che i dati siano stati letti correttamente dal file Excel prima di procedere con la conversione in oggetti ExpenseLimit.


  //       // CONVERSIONE DEI DATI RAW IN OGGETTI DI TIPO ExpenseLimit
  //       const limits: ExpenseLimit[] = rawData.map(  // Converto ogni riga dei dati raw in un oggetto ExpenseLimit
  //         (row: any) => { // Converto una singola riga dei dati raw in un oggetto ExpenseLimit
  //           // row rappresenta una singola riga dei dati raw ottenuti dal foglio Excel.

  //           const currentLimitId = this.config().expenseLimits.find(limit => limit.name === row.Name); // Cerco se esiste già un limite di spesa con lo stesso nome nella configurazione esistente

  //           return {  // Creo un nuovo oggetto ExpenseLimit basato sui dati della riga corrente e sull'eventuale limite esistente trovato
  //             id: currentLimitId?.id ?? crypto.randomUUID(),  // Se esiste un limite esistente uso il suo ID, altrimenti genero un nuovo ID
  //             name: row.Name.trim(),  // .trim() per evitare spazi bianchi all'inizio o alla fine  // Nome del limite di spesa, preso dalla colonna "Name" del file Excel
  //             maxAmount: Number(row.MaxAmount),  // Importo l'importo massimo del limite di spesa dalla colonna "MaxAmount" del file Excel
  //             receiptRequired:  // Importo il flag "receiptRequired" dalla colonna "ReceiptRequired" del file Excel
  //               row.ReceiptRequired === true ||  // Considero true anche se il valore è booleano true
  //               row.ReceiptRequired === 'true'  // Considero true anche se il valore è la stringa 'true'
  //           };
  //         }
  //       );

  //       console.log('CONVERTED LIMITS', limits);  // Mostro i limiti di spesa convertiti in oggetti ExpenseLimit dopo la lettura dal file Excel
  //       // In questo modo posso verificare che la conversione dei dati raw in oggetti ExpenseLimit sia avvenuta correttamente prima di procedere con la validazione e l'aggiornamento della configurazione.


  //       // VALIDAZIONE DEI LIMITI DI SPESE IMPORTATI
  //       const hasInvalidRows = limits.some(limit =>  // hasInvalid è un flag (un valore booleano) che indica se ci sono righe non valide nei limiti di spesa importati
  //         !limit.name ||  // Il nome del limite di spesa non può essere vuoto
  //         Number.isNaN(  // isNaN controlla se il valore non è un numero valido
  //           limit.maxAmount  // Controllo se l'importo massimo è un numero valido
  //         ) ||
  //         limit.maxAmount < 0  // L'importo massimo non può essere negativo
  //       );

  //       if (hasInvalidRows) {  // Se ci sono righe non valide nei limiti di spesa importati, mostro un errore e interrompo l'importazione
  //         this.notification.error('The Excel file contains invalid data');
  //         return;
  //       }


  //       // AGGIORNAMENTO CONFIG 
  //       const mergedLimits = this.config().expenseLimits.map(  // Mappo i limiti di spesa esistenti e li unisco con quelli importati dal file Excel

  //         existingLimit => {

  //           const importedLimit = limits.find(  // Cerco il limite importato corrispondente a quello esistente
  //             limit =>
  //               limit.name === existingLimit.name
  //           );

  //           if (!importedLimit) {   // Se non esiste un limite importato corrispondente, restituisco il limite esistente senza modifiche
  //             return existingLimit;
  //           }

  //           return {
  //             ...existingLimit,  // Mantengo tutte le proprietà del limite esistente

  //             maxAmount: importedLimit.maxAmount,  // Aggiorno l'importo massimo con quello importato

  //             receiptRequired: importedLimit.receiptRequired  // Aggiorno il flag receiptRequired con quello importato
  //           };
  //         }
  //       );

  //       // Equivale a "Sostituisci completamente la configurazione esistente    
  //       // con quella presente nel file Excel".
  //       // const updateConfig = {    
  //       //   ...this.config(),
  //       //   expenseLimits: limits
  //       // };


  //       // Equivale a "Aggiorna la configurazione esistente    
  //       // con i limiti di spesa importati".
  //       const updateConfig = {  // Creo un oggetto di configurazione aggiornato con i limiti di spesa uniti
  //         ...this.config(),
  //         expenseLimits: mergedLimits
  //       };

  //       this.hrConfigService  // Invio la configurazione aggiornata a ConfigService 
  //         .updateConfig(updateConfig)
  //         .subscribe({

  //           next: () => {  // Gestisco il caso di successo dell'aggiornamento della configurazione
  //             this.notification.success(
  //               'Expense limits imported successfully'
  //             );

  //             location.reload();  // Ricarica la pagina per applicare i nuovi limiti di spesa
  //           },

  //           error: () => {  // Gestisco il caso di errore durante l'aggiornamento della configurazione
  //             this.notification.error(
  //               'Error while importing expense limits'
  //             );
  //           }
  //         });

  //     }
  //     catch (error) {  // Gestisco eventuali errori durante la lettura del file Excel
  //       console.error(error);

  //       this.notification.error(
  //         'Unable to read the Excel file'
  //       );

  //     }
  //   };

  //   reader.readAsArrayBuffer(file);  // Avvio la lettura del file Excel come ArrayBuffer che verrà poi elaborato nella funzione onload
  // }


  // Questo metodo gestisce l'importazione dei limiti di spesa da un file Excel selezionato dall'utente.
  // Verifica la validità dei dati e aggiorna la configurazione HR con i nuovi limiti importati.
  // Rispetto alla versione precedente, ora utilizza il signal this.config() per ottenere la configurazione HR corrente invece di accedere direttamente al servizio di configurazione tramite this.configService che non riflette eventuali modifiche locali non ancora salvate.

  
  importExpenseLimits(
    event: Event
  ): void {

    const config = this.config();  // Recupera la configurazione HR corrente tramite il signal this.config()

    if (!config) {   // Se la configurazione HR non è ancora stata caricata, mostra un errore e interrompi l'importazione.
      this.notification.error('Configuration not loaded');
      return;
    }

    const file = (event.target as HTMLInputElement).files?.[0];  // Recupera il file Excel selezionato dall'utente

    if (!file) {   // Se non è stato selezionato alcun file, mostra un errore e interrompi l'importazione.
      this.notification.error('No file selected');
      return;
    }


    // LETTURA DEL FILE EXCEL
    const reader = new FileReader();  // Crea un oggetto FileReader per leggere il contenuto del file Excel selezionato.
    // Nota: Ricorda che FileReader legge il contenuto del file in modo asincrono, quindi dobbiamo gestire l'evento onload per ottenere i dati.

    reader.onload = (e) => {  // Gestisce l'evento onload del FileReader, che viene chiamato quando il file è stato letto correttamente.

      try {  // Prova a leggere e processare il contenuto del file Excel. Se si verifica un errore, viene catturato nel blocco catch sottostante.

        const arrayBuffer = e.target?.result as ArrayBuffer;  // Ottiene il contenuto del file Excel come ArrayBuffer (array di byte) per poterlo leggere con XLSX.read()

        const workbook = XLSX.read(arrayBuffer, { type: 'array' }); // Legge il contenuto del file Excel come workbook utilizzando la libreria XLSX
        // workbook contiene tutti i fogli di lavoro del file Excel, identificati dai loro nomi in workbook.SheetNames

        const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Ottiene il primo foglio di lavoro del workbook Excel (contenuto del file Excel)
        // worksheet contiene i dati del primo foglio di lavoro del file Excel.
        // Solo il primo foglio di lavoro viene considerato per l'importazione perché si assume che contenga i dati principali delle spese.

        const rawData = XLSX.utils.sheet_to_json(worksheet); // Converte il foglio di lavoro in un array di oggetti JSON, dove ogni oggetto rappresenta una riga del foglio Excel
        // In parole semplici, lo trasforma in un formato (array di oggetti JSON) più facile da manipolare in JavaScript rispetto al foglio Excel originale.


        // CONVERSIONE DEI DATI RAW IN OGGETTI DI TIPO ExpenseLimit
        const limits: ExpenseLimit[] =  // Mappa i dati grezzi del foglio Excel in un array di oggetti ExpenseLimit, che rappresentano i limiti di spesa importati.
          rawData.map((row: any) => {  // Per ogni riga del foglio Excel, crea un oggetto ExpenseLimit corrispondente.

            const existingLimit = config.expenseLimits.find(  // Cerca se esiste già un limite di spesa con lo stesso nome nella configurazione corrente.
              limit => limit.name === row.Name
            );

            return {   // Crea un nuovo oggetto ExpenseLimit basato sui dati importati dal file Excel e sull'eventuale limite esistente.
              id: existingLimit?.id ?? crypto.randomUUID(),  // Usa l'ID esistente se presente, altrimenti genera un nuovo ID univoco.
              name: row.Name?.trim(),  // Nome del limite di spesa importato dal file Excel, rimuovendo eventuali spazi iniziali o finali.
              maxAmount: Number(row.MaxAmount),  // Importo massimo del limite di spesa, convertito in numero.
              receiptRequired: row.ReceiptRequired === true ||
                row.ReceiptRequired === 'true'  // Indica se è richiesta la ricevuta, interpretando sia il valore booleano che la stringa 'true'.
            };

          });


        // VALIDAZIONE DEI LIMITI DI SPESE IMPORTATI
        const hasInvalidRows = limits.some(limit => !limit.name || isNaN(limit.maxAmount) ||  // hasInvalidRows è un flag (booleano) che indica se ci sono righe con dati non validi.
          limit.maxAmount < 0);   // Controlla se ci sono righe con dati non validi: nome mancante, importo massimo non numerico o importo massimo negativo.

        if (hasInvalidRows) {  // Se ci sono righe non valide nei limiti di spesa importati, mostro un errore e interrompo l'importazione
          this.notification.error('The Excel file contains invalid data');
          return;
        }


        // AGGIORNAMENTO CONFIG 
        const mergedLimits = config.expenseLimits.map( // Mappa i limiti di spesa esistenti con quelli importati, aggiornando solo i campi modificati.

          existingLimit => {

            const importedLimit = limits.find(limit => limit.name === existingLimit.name);  // Cerco il limite importato corrispondente a quello esistente

            if (!importedLimit) {  // Se non esiste un limite importato corrispondente, restituisco il limite esistente senza modifiche
              return existingLimit;
            }

            return {

              ...existingLimit,  // Mantengo tutte le proprietà del limite esistente

              maxAmount: importedLimit.maxAmount,  // Aggiorno l'importo massimo con quello importato
              receiptRequired: importedLimit.receiptRequired  // Aggiorno il flag della ricevuta con quello importato

            };

            // Equivale a dire "Sostituisci completamente la configurazione esistente    
            // con quella presente nel file Excel".
            // const updateConfig = {    
            //   ...this.config(),
            //   expenseLimits: limits
            // };

          }

        );


        // CREAZIONE CONFIG AGGIORNATA
        const updatedConfig: AppConfig = {    // Creo una nuova configurazione aggiornata con i limiti di spesa uniti
          ...config,     // Mantengo tutte le proprietà della configurazione esistente 
          expenseLimits: mergedLimits   // Aggiorno i limiti di spesa con quelli uniti
        };


        this.configService   // Aggiorno la configurazione con i nuovi limiti di spesa
          .updateConfig(updatedConfig)   // Invio la configurazione aggiornata al servizio per salvarla
          .subscribe({
            next: (saveConfig) => {
              this.configService.setConfig(saveConfig);   // Aggiorno la configurazione locale con quella salvata
              this.notification.success('Expense limits imported successfully');   // Mostro una notifica di successo
              // location.reload();   // Ricarico la pagina per applicare le modifiche
            },

            error: () => {   // Gestisco l'errore durante l'importazione dei limiti di spesa
              this.notification.error('Error while importing expense limits');   // Mostro una notifica di errore
            }
          });

      } catch (error) {   // Gestisco l'errore durante la lettura del file Excel
        console.error(error);   // Log dell'errore nella console
        this.notification.error('Unable to read the Excel file');   // Mostro una notifica di errore
      }

    };

    reader.readAsArrayBuffer(file);  // Leggo il file Excel come ArrayBuffer per poterlo elaborare successivamente

  // Se analizzo pezzo per pezzo il metodo importExpenseLimits:
  // 1. Legge il file Excel come ArrayBuffer.
  // 2. Converte il contenuto del file in un workbook.
  // 3. Estrae i dati dal primo foglio del workbook.
  // 4. Mappa i dati in un array di limiti di spesa.
  // 5. Valida i limiti importati.
  // 6. Unisce i limiti importati con quelli esistenti.
  // 7. Crea una nuova configurazione aggiornata.
  // 8. Aggiorna la configurazione tramite il servizio.
  // 9. Gestisce eventuali errori durante il processo.


  // METODO PER COSTRUIRE IL FORM DEI LIMITI DI SPESA
  // Questo metodo costruisce un FormArray a partire dai limiti di spesa forniti come parametro
  private buildExpenseLimitForm( 
    limits: ExpenseLimit[]  
  ): FormArray {  
    return this.fb.array(  
      limits.map(limit =>  // Mappa ogni limite di spesa in un FormGroup corrispondente
        this.fb.group({  // Costruisce un FormGroup per ogni limite di spesa con i campi id, name, maxAmount e receiptRequired
          id: [limit.id],
          name: [limit.name],
          maxAmount: [limit.maxAmount],
          receiptRequired: [limit.receiptRequired]
        })
      )
    );
  }

  }
```

# NOTA: location.reload()

In Angular è quasi sempre considerato un anti-pattern (una cattiva pratica) usare location.reload() dopo aver completato un'operazione, indipendentemente dalla versione (inclusa Angular 22).

Il motivo principale è che Angular è progettato per creare Single Page Application (SPA): ricaricare l'intera pagina distrugge lo stato dell'applicazione, azzera la cache in memoria e costringe il browser a riscaricare ed eseguire nuovamente tutti i bundle JavaScript e CSS, peggiorando l'esperienza utente (schermata bianca/lampeggio) e le prestazioni.

