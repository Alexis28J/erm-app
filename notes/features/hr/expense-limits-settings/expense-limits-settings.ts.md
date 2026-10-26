# COMMENTI

```TYPESCRIPT
export class ExpenseLimitsSettings {

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


    // METODO PER IMPORTARE I LIMITI DI SPESE DA UN FILE EXCEL
  // Questo metodo gestisce l'importazione dei limiti di spese da un file Excel
  importExpenseLimits(event: Event): void {


    const file = (event.target as HTMLInputElement).files?.[0];  // Ottieni il primo file selezionato dall'input file. 
    // Questo vuol dire che se l'utente seleziona più file, verrà considerato solo il primo.

    if (!file) {  // Se non è stato selezionato alcun file, esci dal metodo.                                                                                                                        
      return;
    }

    const reader = new FileReader();  // Creo un oggetto FileReader per leggere il contenuto del file Excel.

    reader.onload = (e) => {  // onload viene chiamato quando il file è stato letto correttamente

      try {   // Provo a leggere e processare il file Excel. try è usato per catturare eventuali errori durante la lettura e il parsing del file.

        const arrayBuffer = e.target?.result as ArrayBuffer;  // Converto il risultato della lettura del file in un ArrayBuffer, necessario per XLSX.read

        const workbook = XLSX.read(  // Leggo il contenuto del file Excel e creo un oggetto workbook
          arrayBuffer,  // ArrayBuffer contenente i dati del file Excel
          {
            type: 'array'  // Specifico che il tipo di input è un array di byte (ArrayBuffer)
          }
        );

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];  // Ottengo il primo foglio di lavoro dal workbook
        // Questo vuol dire che consideriamo solo il primo foglio di lavoro del file Excel e non eventuali altri fogli presenti.

        const rawData = XLSX.utils.sheet_to_json(  // Converto il foglio di lavoro in un array di oggetti JSON
          worksheet
        );

        console.log('RAW DATA', rawData);  // Mostro i dati raw ottenuti dal foglio Excel prima della conversione in oggetti ExpenseLimit
        // Questo aiuta a verificare che i dati siano stati letti correttamente dal file Excel prima di procedere con la conversione in oggetti ExpenseLimit.


        // CONVERSIONE DEI DATI RAW IN OGGETTI DI TIPO ExpenseLimit
        const limits: ExpenseLimit[] = rawData.map(  // Converto ogni riga dei dati raw in un oggetto ExpenseLimit
          (row: any) => { // Converto una singola riga dei dati raw in un oggetto ExpenseLimit
            // row rappresenta una singola riga dei dati raw ottenuti dal foglio Excel.

            const currentLimitId = this.config().expenseLimits.find(limit => limit.name === row.Name); // Cerco se esiste già un limite di spesa con lo stesso nome nella configurazione esistente

            return {  // Creo un nuovo oggetto ExpenseLimit basato sui dati della riga corrente e sull'eventuale limite esistente trovato
              id: currentLimitId?.id ?? crypto.randomUUID(),  // Se esiste un limite esistente uso il suo ID, altrimenti genero un nuovo ID
              name: row.Name,  // Nome del limite di spesa, preso dalla colonna "Name" del file Excel
              maxAmount: Number(row.MaxAmount),  // Importo l'importo massimo del limite di spesa dalla colonna "MaxAmount" del file Excel
              receiptRequired:  // Importo il flag "receiptRequired" dalla colonna "ReceiptRequired" del file Excel
                row.ReceiptRequired === true ||  // Considero true anche se il valore è booleano true
                row.ReceiptRequired === 'true'  // Considero true anche se il valore è la stringa 'true'
            };
          }
        );

        console.log('CONVERTED LIMITS', limits);  // Mostro i limiti di spesa convertiti in oggetti ExpenseLimit dopo la lettura dal file Excel
        // In questo modo posso verificare che la conversione dei dati raw in oggetti ExpenseLimit sia avvenuta correttamente prima di procedere con la validazione e l'aggiornamento della configurazione.


        // VALIDAZIONE DEI LIMITI DI SPESE IMPORTATI
        const hasInvalidRows = limits.some(limit =>  // hasInvalid è un flag (un valore booleano) che indica se ci sono righe non valide nei limiti di spesa importati
          !limit.name ||  // Il nome del limite di spesa non può essere vuoto
          Number.isNaN(  // isNaN controlla se il valore non è un numero valido
            limit.maxAmount  // Controllo se l'importo massimo è un numero valido
          ) ||
          limit.maxAmount < 0  // L'importo massimo non può essere negativo
        );

        if (hasInvalidRows) {  // Se ci sono righe non valide nei limiti di spesa importati, mostro un errore e interrompo l'importazione
          this.notification.error('The Excel file contains invalid data');
          return;
        }


        // AGGIORNAMENTO CONFIG 
        const mergedLimits = this.config().expenseLimits.map(  // Mappo i limiti di spesa esistenti e li unisco con quelli importati dal file Excel

          existingLimit => {

            const importedLimit = limits.find(  // Cerco il limite importato corrispondente a quello esistente
              limit =>
                limit.name === existingLimit.name
            );

            if (!importedLimit) {   // Se non esiste un limite importato corrispondente, restituisco il limite esistente senza modifiche
              return existingLimit;
            }

            return {
              ...existingLimit,  // Mantengo tutte le proprietà del limite esistente

              maxAmount: importedLimit.maxAmount,  // Aggiorno l'importo massimo con quello importato

              receiptRequired: importedLimit.receiptRequired  // Aggiorno il flag receiptRequired con quello importato
            };
          }
        );

        // Equivale a "Sostituisci completamente la configurazione esistente    
        // con quella presente nel file Excel".
        // const updateConfig = {    
        //   ...this.config(),
        //   expenseLimits: limits
        // };


        // Equivale a "Aggiorna la configurazione esistente    
        // con i limiti di spesa importati".
        const updateConfig = {  // Creo un oggetto di configurazione aggiornato con i limiti di spesa uniti
          ...this.config(),
          expenseLimits: mergedLimits
        };

        this.hrConfigService  // Invio la configurazione aggiornata a ConfigService 
          .updateConfig(updateConfig)
          .subscribe({

            next: () => {  // Gestisco il caso di successo dell'aggiornamento della configurazione
              this.notification.success(
                'Expense limits imported successfully'
              );
            },

            error: () => {  // Gestisco il caso di errore durante l'aggiornamento della configurazione
              this.notification.error(
                'Error while importing expense limits'
              );
            }
          });

      }
      catch (error) {  // Gestisco eventuali errori durante la lettura del file Excel
        console.error(error);

        this.notification.error(
          'Unable to read the Excel file'
        );

      }
    };

    reader.readAsArrayBuffer(file);  // Avvio la lettura del file Excel come ArrayBuffer che verrà poi elaborato nella funzione onload

    // Per ultimo faccio il refresh della pagina per riflettere i nuovi limiti di spesa importati
    location.reload();  // location è un oggetto globale che rappresenta l'URL della pagina corrente e reload() ricarica la pagina
  }


}
```
