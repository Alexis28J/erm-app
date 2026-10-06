# COMMENTI

Questo componente gestisce la modifica di una richiesta di rimborso esistente ed è solo accessibile agli utenti autenticati.

La funzionalità è collegata al pulsante "Modifica" nella lista delle richieste dell'utente. 
Solo le richieste in stato bozza possono essere modificate.

Utilizza `Angular Reactive Forms` per gestire la validazione e l'invio dei dati del modulo.
I metodi `saveDraft()` e `submitRequest()` aggiornano rispettivamente lo stato della richiesta a bozza o la inviano per l'approvazione.

Il servizio refundRequestService viene utilizzato per interagire con il backend.
Il template HTML associato a questo componente contiene il modulo per la modifica di una richiesta di rimborso esistente, con campi per il mese di riferimento, le note del dipendente, le spese e i pulsanti per salvare come bozza o inviare la richiesta.

Ho usato Angular Reactive Forms per gestire la validazione e l'invio dei dati del modulo.
Inoltre, entrambi i metodi aggiornano automaticamente la data di ultimo aggiornamento della richiesta.


```TYPESCRIPT
import { Component, effect, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RefundRequestService } from '../../../core/services/refund-request.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RefundRequest } from '../../../core/interfaces/refund-request';
import { Expense } from '../../../core/interfaces/expense';
import { RequestStatus } from '../../../core/interfaces/enum';
import { MatOption } from "@angular/material/select";
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule, 
    DatePipe, CurrencyPipe, MatOption, MatSelectModule],
  selector: 'app-edit-request',
  styleUrls: ['./edit-request.scss'],
  templateUrl: './edit-request.html',
})
export class EditRequest {

  // Il constructor deve essere il punto in cui vengono inizializzate le dipendenze e gli effetti reattivi del componente. 
  // Tuttavia con inject non è necessario passare le dipendenze come parametri del constructor poiché vengono iniettate direttamente nelle proprietà della classe.

  constructor() {   // Il costrutto si avvia quando viene creata un'istanza della classe EditRequest cioè quando il componente viene inizializzato.

    // EFFETTO REATTIVO: questo effetto si attiva ogni volta che cambia il segnale della richiesta corrente.
    effect(() => {   

      const request = this.request();  // Recupero la richiesta corrente come segnale.

      if (!request || this.formInitialized) {  // se la richiesta non esiste o il form è già stato popolato, esco dall'effetto.
        // Come sa se il form è già stato popolato con i dati della richiesta?
        // La risposta è nella variabile this.formInitialized, che viene impostata a true solo dopo che il form è stato popolato.
        // La variabile formInitialized viene inizializzata a false e viene impostata a true solo dopo che il form è stato popolato con i dati della richiesta.
        return;
      }

      this.populateForm(request);  // Popolo il form con i dati della richiesta. 

      this.formInitialized = true;   // Imposto la variabile a true per indicare che il form è stato popolato.

    })

    // Quindi se vogliamo analizzare l'effetto passo per passo:
    // 1. Recuperiamo la richiesta corrente come segnale.
    // 2. Controlliamo se la richiesta esiste e se il form è già stato popolato.
    // 3. Se la richiesta non esiste o il form è già stato popolato, usciamo dall'effetto.
    // 4. Altrimenti, popoliamo il form con i dati della richiesta.
    // 5. Impostiamo la variabile formInitialized a true per indicare che il form è stato popolato.
    // Quindi, l'effetto si assicura che il form venga popolato solo una volta con i dati della richiesta corrente.

    // Nota: Quando l'utente clicca su edit, il form non verrà sovrascritto dai dati della richiesta corrente se è già stato popolato una volta.
    // Questo perché la variabile formInitialized impedisce che il form venga popolato nuovamente con gli stessi dati.
    // Invece, se il form non è ancora stato popolato (cioè non è stato completato con i dati della richiesta), l'effetto lo popolerà con i dati della richiesta corrente.

  }

  // INIEZIONE DELLE DIPENDENZE 
  private fb = inject(FormBuilder);  // FormBuilder per creare il form reattivo.
  private route = inject(ActivatedRoute);  // ActivatedRoute per accedere ai parametri della route (URL) corrente.
  private router = inject(Router);  // Router per la navigazione tra le pagine.
  private refundRequestService = inject(RefundRequestService);  // Servizio per interagire con le richieste di rimborso.


  // INIZIALIZZAZIONE DELLE VARIABILI

  // Variabile che indica se il form è stato inizializzato.
  private formInitialized = false;  // è la variabile che indica se il form è stato popolato con i dati della richiesta.
  // La variabile viene inizializzata a false (che indica che il form non è ancora stato popolato) e viene impostata a true solo dopo che il form è stato popolato con i dati della richiesta.
  // A cosa serve questa variabile? Serve a evitare che il form venga popolato più volte con gli stessi dati, sovrascrivendo eventuali modifiche fatte dall'utente.

  // Variabile che contiene l'ID della richiesta corrente.
  private requestId = this.route.snapshot.paramMap.get('id'); // Recupero l'ID della richiesta dai parametri della route.


  // Variabile che rappresenta il form reattivo per la richiesta di rimborso.
  requestForm = this.fb.group({  // Variabile requestForm rappresenta il form reattivo per la richiesta di rimborso.
    referenceMonth: ['', Validators.required],
    noteEmployee: [''],
    expenses: this.fb.array([])
  });


  // Variabile che rappresenta il segnale della richiesta di rimborso corrente.
  request = toSignal(   // Variabile request rappresenta il segnale della richiesta di rimborso corrente. 
  // L'Observable restituito dal servizio viene convertito in un segnale. In questo modo, possiamo utilizzare il segnale per reagire ai cambiamenti della richiesta in modo reattivo.
    this.refundRequestService.getRequestById(
      this.requestId ?? ''  // Se l'ID della richiesta non è disponibile, utilizziamo una stringa vuota come fallback.
    ),
    {
      initialValue: null  // Valore iniziale del segnale, impostato a null per indicare che inizialmente non abbiamo dati della richiesta.
    }
  );


  // GETTER PER L'ARRAY DELLE SPESE DEL FORM
  get expenses(): FormArray {  // Questo getter ci consente di accedere facilmente all'array delle spese del form.

    return this.requestForm.get(
      'expenses'       // Poiché il form contiene un array di spese, accediamo a questo array tramite il nome 'expenses'.
    ) as FormArray;   // Poiché il controllo del form rappresenta un array di spese, lo castiamo come FormArray per poter accedere ai metodi specifici degli array di form.

  }


  // GETTER PER IL TOTALE DELLE SPESE DEL FORM
  get totalAmount(): number {  // Questo getter ci consente di calcolare facilmente il totale delle spese del form grazie al metodo reduce sugli array di controlli delle spese.
    return this.expenses.controls.reduce(
      (total, control) => total + Number(  // total rappresenta il totale accumulato delle spese fino a questo punto mentre control rappresenta il controllo della singola spesa corrente.
        control.get('requestedAmount')  // control.get('requestedAmount') restituisce il controllo del form (FormControl) per l'importo richiesto della singola spesa. 
        // Il valore di questo controllo viene poi convertito in numero grazie alla funzione Number e sommato al totale.
          ?.value || 0  // ? indica che se il controllo del form non esiste o il suo valore è undefined, utilizziamo 0 come valore di default. Ad esempio, se una spesa non ha un importo richiesto, contribuisce con 0 al totale.
      ),
      0
    )
  }


  // METODO PRIVATO PER POPOLARE IL FORM CON I DATI DELLA RICHIESTA CORRENTE (SI USA QUANDO SI CARICA UNA RICHIESTA ESISTENTE)
  private populateForm(request: RefundRequest): void {

    this.requestForm.patchValue({  // Popoliamo il form con i valori della richiesta corrente. // patchValue aggiorna solo i campi specificati senza sovrascrivere l'intero form.

      referenceMonth: request.referenceMonth,  // Impostiamo il mese di riferimento della richiesta corrente nel form.

      noteEmployee: request.noteEmployee ?? ''  // Impostiamo le note del dipendente della richiesta corrente nel form. Se non ci sono note, utilizziamo una stringa vuota come valore di default.

    });

    this.expenses.clear();   // Rimuoviamo tutte le spese attualmente presenti nel form prima di popolare con le nuove spese della richiesta corrente.

    request.expenses.forEach(expense => {  // Per ogni spesa della richiesta corrente, creiamo un nuovo gruppo di controlli del form e lo aggiungiamo all'array delle spese del form.

      this.expenses.push(  // Aggiungiamo il nuovo gruppo di controlli del form all'array delle spese del form.
        this.fb.group({  // Creiamo un nuovo gruppo di controlli del form per la spesa corrente.
          date: [expense.date, Validators.required],  // Impostiamo la data della spesa corrente nel form e rendiamo il campo obbligatorio.
          category: [expense.category, Validators.required],  // Impostiamo la categoria della spesa corrente nel form e rendiamo il campo obbligatorio.
          description: [expense.description],  // Impostiamo la descrizione della spesa corrente nel form.
          requestedAmount: [expense.requestedAmount, Validators.required]  // Impostiamo l'importo richiesto della spesa corrente nel form e rendiamo il campo obbligatorio.
        })
      );
    });

  }


  // METODO PER AGGIUNGERE UNA NUOVA SPESA AL FORM
  addExpense(): void {
    this.expenses.push(  // Aggiungiamo un nuovo gruppo di controlli del form all'array delle spese del form.
      this.fb.group({  // Creiamo un nuovo gruppo di controlli del form per la nuova spesa.
        date: ['', Validators.required],  // Impostiamo la data della nuova spesa nel form e rendiamo il campo obbligatorio.
        category: ['', Validators.required],  // Impostiamo la categoria della nuova spesa nel form e rendiamo il campo obbligatorio.
        description: [''],  // Impostiamo la descrizione della nuova spesa nel form.
        requestedAmount: ['', Validators.required]  // Impostiamo l'importo richiesto della nuova spesa nel form e rendiamo il campo obbligatorio.
      })
    );
  }


  // METODO PER RIMUOVERE UNA SPESA DAL FORM
  removeExpense(index: number): void {  // Prende l'indice della spesa da rimuovere dall'array delle spese del form.
    this.expenses.removeAt(index);  // Rimuoviamo la spesa all'indice specificato dall'array delle spese del form.
  }


  // METODO PER SALVARE LA RICHIESTA COME BOZZA
  saveDraft(): void {

    const currentRequest = this.request();  // Otteniamo la richiesta corrente dal form.

    if (!currentRequest) {  // Se non esiste una richiesta corrente, interrompiamo l'esecuzione del metodo.
      return;  // per esempio, se il form non è stato ancora inizializzato correttamente o se l'utente ha tentato di salvare senza aver compilato niente.
    }


    // Per salvare una richiesta come bozza non è necessario che tutti i campi siano compilati. 


    // Oggetto che rappresenta la richiesta aggiornata da salvare come bozza.
    const updatedRequest: RefundRequest = {   

      ...currentRequest,  // Il metodo spread copia tutte le proprietà della richiesta corrente nell'oggetto aggiornato.

      referenceMonth: this.requestForm.value.referenceMonth ?? '',   // Impostiamo il mese di riferimento della richiesta dal form, oppure una stringa vuota se non è presente.
      noteEmployee: this.requestForm.value.noteEmployee ?? '',  // Impostiamo la nota del dipendente dal form, oppure una stringa vuota se non è presente.
      expenses: (this.requestForm.value.expenses ?? []) as Expense[],  // Impostiamo l'array delle spese dal form, oppure un array vuoto se non è presente.
      totalRequestedAmount: this.totalAmount,  // Impostiamo l'importo totale richiesto calcolato dalle spese.
      status: RequestStatus.DRAFT,  // Impostiamo lo stato della richiesta come bozza.
      lastUpdateDate: new Date().toISOString()  // Impostiamo la data dell'ultimo aggiornamento alla data e ora correnti. 
      // toISOString() restituisce una stringa in formato ISO 8601.

    };

    this.refundRequestService   // Chiamiamo il servizio per aggiornare la richiesta con i dati della bozza.
      .updateRequest(
        currentRequest.id!,   // Passiamo l'ID della richiesta corrente al servizio per identificare quale richiesta aggiornare (è obbligatorio per l'aggiornamento).
        updatedRequest    // Passiamo l'oggetto aggiornato della richiesta al servizio per salvarlo come bozza.
      )
      .subscribe({   // Con subscribe gestiamo la risposta asincrona del servizio.

        next: () => {    // Quando la richiesta viene aggiornata con successo, navighiamo alla lista delle richieste.
          this.router.navigate([
            'employee/request-list'
          ]);
        }

      })

  }


  // VARIABILE PER IL MESSAGGIO DI ERRORE DEL FORM
  formError = '';  // Inizializzo come una stringa vuota la variabile per il messaggio di errore del form


  // METODO PER INVIARE LA RICHIESTA
  submitRequest(): void {  // Metodo per inviare la richiesta compilata dal form.
 
    if (this.requestForm.invalid) {    // Se il form non è valido, interrompiamo l'invio della richiesta.
      this.requestForm.markAllAsTouched();  // Evidenziamo tutti i campi del form come "toccati" (normalmente visualizzati con un bordo rosso o un messaggio di errore) per mostrare eventuali errori di validazione.

      this.formError = 'Please fill in all required fields';  // Mostra un messaggio di errore che indica all'utente di completare tutti i campi obbligatori

      return;  // Interrompiamo l'invio della richiesta se il form non è valido.
    }

    const currentRequest = this.request();  // currentRequest contiene la richiesta attuale ottenuta dal signal request()

    if (!currentRequest) {  // Se non esiste una richiesta corrente, interrompiamo l'invio della richiesta.
      return;  // Interrompiamo l'invio della richiesta se non esiste una richiesta corrente.
    }  // Per esempio, se l'utente cerca di inviare una richiesta che non esiste più o è stata eliminata.
    // Il controllo non è strettamente necessario, ma serve a prevenire errori nel caso in cui la richiesta corrente non esista.


    const updatedRequest: RefundRequest = {  // Creiamo un oggetto RefundRequest aggiornato con i dati del form e le proprietà esistenti della richiesta corrente.

      ...currentRequest,  // Copiamo tutte le proprietà della richiesta corrente per poi sovrascrivere solo quelle modificate.

      referenceMonth: this.requestForm.value.referenceMonth ?? '',
      noteEmployee: this.requestForm.value.noteEmployee ?? '',
      expenses: (this.requestForm.value.expenses ?? []) as Expense[],  // Recuperiamo le spese dal form, oppure un array vuoto se non ci sono spese. 
      // Dobbiamo fare il cast a Expense[] perché il form potrebbe restituire un tipo generico.
      totalRequestedAmount: this.totalAmount, // Impostiamo l'importo totale richiesto con il valore calcolato dal form.
      status: RequestStatus.PENDING,  // Impostiamo lo stato della richiesta come "PENDING" (in attesa di approvazione).
      lastUpdateDate: new Date().toISOString()

    };

    this.refundRequestService   // Chiamiamo il servizio per aggiornare la richiesta con i nuovi dati.
      .updateRequest(
        currentRequest.id!,
        updatedRequest
      )
      .subscribe({   // Gestiamo la risposta dell'aggiornamento della richiesta.
        next: () => {

          this.notificationService.success('Request submitted successfully');

          this.router.navigate([
            '/employee/request-list'
          ]);

        }
      });

  }
 
 
  // SIGNAL PER TENERE TRACCIA DEI VALORI DELLE SPESE (IMPORTO RICHIESTO, CATEGORIA, ETC.)
  // Quando l'utente modifica le spese, questo signal tiene traccia dei valori aggiornati in tempo reale.
  expensesValue = toSignal(   // Converto l'Observable delle spese in un Signal in modo da poterlo utilizzare reattivamente nel template e nel codice TypeScript
    this.expenses.valueChanges.pipe(  // Il metodo valueChanges mi permette di osservare i cambiamenti nei valori delle spese in tempo reale mentre .pipe viene utilizzato per applicare operatori RxJS come startWith
      startWith(this.expenses.getRawValue()) // startWith viene utilizzato per emettere immediatamente il valore iniziale delle spese in modo che il Signal abbia un valore iniziale corretto
    ),
    { initialValue: [] }  // Valore iniziale del Signal, utilizzato prima che l'Observable emetta il primo valore (cioè quando il form è appena caricato)
  )


  // COMPUTED PER OTTENERE I DATI DI PROGRESSO DELLE SPESE (CATEGORIA E IMPORTO RICHIESTO)
  // Quando l'utente modifica le spese, questo computed aggiorna automaticamente i dati di progresso delle spese.
  // Nel template, il selettore della barra di progresso delle spese utilizzerà questo computed per mostrare i dati aggiornati in tempo reale.
  // Le proprietà category e amount sono utilizzate per rappresentare la categoria della spesa e l'importo richiesto rispettivamente.
  expenseProgressData = computed(() => {
    return this.expensesValue().map((expense: Expense) => ({ // Mappa ogni spesa in un oggetto contenente la categoria e l'importo richiesto
      category: expense.category ?? '',  // Metto '' come valore di default se la categoria è undefined, in modo da evitare errori nel template
      amount: Number(expense.requestedAmount ?? 0) // Metto 0 come valore di default se  l'importo richiesto è undefined (cioè non è stato ancora inserito dall'utente)
    }))  // Il metodo map crea, per ogni spesa, un oggetto contenente la categoria e l'importo richiesto
  })


  // COMPUTED PER OTTENERE L'IMPORTO MASSIMO CONSENTITO PER LE SPESE (SOMMA DEI MASSIMI PER CATEGORIA O TOTALE MASSIMO CONSENTITO)
  // Quando l'utente modifica le spese, questo computed aggiorna automaticamente l'importo massimo consentito per ogni categoria 
  // e quindi il totale massimo consentito. 
  // Il selettore della barra di progresso totale delle spese utilizzerà questo computed per mostrare l'importo massimo consentito aggiornato in tempo reale.
  readonly totalAllowedAmount = computed(() => {

    const request = this.expensesValue();  // Ottiene i valori correnti delle spese dal signal

    if (!request || request.length === 0) {  // Se non ci sono spese, l'importo massimo consentito è 0
      return 0;
    }

    return request.reduce((total: number, expense: Expense) => {  // Somma l'importo massimo consentito per ogni categoria
      // Il metodo reduce itera su ogni spesa e somma l'importo massimo consentito per la categoria corrispondente
      const category = EXPENSE_CATEGORIES.find(  // Trova la categoria corrispondente alla spesa corrente
        c => c.name === expense.category    // Confronta il nome della categoria con la categoria della spesa corrente
      ) // Il metodo reduce è un metodo di array che accumula un valore (in questo caso il totale) iterando su ogni elemento dell'array (in questo caso le spese)

      return total + (category?.maxAmount ?? 0);  // Aggiunge l'importo massimo consentito della categoria corrente al totale, oppure 0 se la categoria non ha un importo massimo definito
    }, 0  // Valore iniziale del totale, cioè parte da 0 prima di sommare gli importi massimi delle categorie
    );
  });


  // COMPUTED PER OTTENERE L'IMPORTO TOTALE RICHIESTO PER LE SPESE
  // Questo computed calcola l'importo totale richiesto per tutte le spese, sommando gli importi richiesti di ciascuna spesa.
  readonly totalRequestedAmount = computed(() => { 

    const request = this.expensesValue();  // Ottiene i valori correnti delle spese dal signal

    if (!request || request.length === 0) {  // Se non ci sono spese, l'importo totale richiesto è 0
      return 0;
    }

    return request.reduce(  // Somma l'importo richiesto di ciascuna spesa per ottenere il totale richiesto con il metodo reduce che accumula il totale passo dopo passo
      (total: number, expense: Expense) => {  // total è il totale accumulato fino a questo punto, expense è la spesa corrente. In altre parole, total rappresenta il totale parziale mentre iteriamo sulle spese.
        return total + (expense.requestedAmount ?? 0);  // Aggiunge l'importo richiesto della spesa corrente al totale, oppure 0 se l'importo richiesto non è definito
      }, 0  // Valore iniziale del totale, cioè parte da 0 prima di sommare gli importi richiesti delle spese
    );
  });


  // GESTIONE DEI FILE ALLEGATI PER LE SPESE
  // Gestisce la selezione dei file allegati per una specifica spesa. 
  // Quando l'utente seleziona dei file, questi vengono letti come Data URL e aggiunti all'elenco degli allegati della spesa corrente.
  onFilesSelected(event: Event, expenseIndex: number): void {  // I parametri sono l'evento di selezione dei file e l'indice della spesa corrente.

    const files = (event.target as HTMLInputElement).files; // Ottiene la lista dei file selezionati dall'input file HTML.
    // as HTMLInputElement è un cast per indicare che l'evento proviene da un input HTML di tipo file. In questo modo TypeScript sa che l'oggetto event.target ha la proprietà files.
    // Perché è necessario?
    // È necessario fare il cast a HTMLInputElement perché event.target è di tipo EventTarget, che non ha la proprietà files. 
    // Solo HTMLInputElement ha la proprietà files, quindi dobbiamo dire a TypeScript che event.target è effettivamente un HTMLInputElement.

    if (!files?.length) {  // Se non ci sono file selezionati, esce dalla funzione.
      return;
    }

    Array.from(files).forEach(file => {   // Per ogni file selezionato, crea un FileReader per leggerne il contenuto come Data URL.

      const reader = new FileReader();  // Crea un nuovo FileReader per leggere il contenuto del file come Data URL. 
      // In questo modo possiamo ottenere una rappresentazione del file che può essere facilmente memorizzata o inviata al server.
      // FileReader è un oggetto JavaScript che permette di leggere il contenuto dei file selezionati dall'utente.

      reader.onload = () => {  // Quando il file è stato letto con successo, esegue questa funzione.
        // Il metodo onload viene chiamato quando il file è stato letto con successo. Qui possiamo accedere al contenuto del file tramite reader.result.

        const expense = this.expenses.at(expenseIndex);  // Ottiene la spesa corrente in base all'indice fornito.

        const attachments = expense.get('attachments')?.value ?? [];  // Ottiene l'elenco degli allegati della spesa corrente, oppure un array vuoto se non ci sono allegati.
        // get('attachments')? serve per ottenere il controllo del modulo che contiene gli allegati. 
        // Il punto interrogativo indica che il controllo potrebbe non esistere, quindi TypeScript non genererà un errore se è undefined.
        // Se il controllo esiste, otteniamo il suo valore tramite .value (cioè l'array degli allegati), altrimenti utilizziamo un array vuoto come fallback.

        attachments.push({  // Aggiunge un nuovo allegato all'elenco degli allegati.
          fileName: file.name,  // Nome del file.
          fileType: file.type,  // Tipo MIME (Multipurpose Internet Mail Extensions) del file. Il tipo MIME indica il formato del file e come deve essere interpretato.
          fileContent: reader.result as string  // Contenuto del file come Data URL che viene "castato" a stringa per garantire il tipo corretto in TypeScript.
        });

        expense.patchValue({  // Aggiorna il valore del controllo del modulo della spesa corrente con il nuovo elenco degli allegati.
          // Il controllo del modulo è rappresentato dall'oggetto expense, che contiene i campi della spesa corrente. Qui stiamo aggiornando solo il campo 'attachments' con il nuovo elenco degli allegati.
          attachments  // Nuovo elenco degli allegati aggiornato.
        });  // Il metodo patchValue si occupa di aggiornare solo i campi specificati del controllo del modulo, senza sovrascrivere l'intero valore.
      };

      reader.readAsDataURL(file);  // Avvia la lettura del file come Data URL. Quando la lettura sarà completata, verrà chiamato il metodo onload definito sopra.
      // In parole semplici, questo codice legge il file selezionato dall'utente, lo converte in un Data URL e lo aggiunge all'elenco degli allegati della spesa corrente.
      // readAsDataURL è il metodo che avvia la lettura del file come Data URL. Quando la lettura sarà completata, il risultato sarà disponibile in reader.result. 
      // In questo caso, reader.result conterrà il contenuto del file codificato come Data URL.
    });
  }
  

  // METODO PER RIMUOVERE UN FILE ALLEGATO (PER OGNI SINGOLA SPESA)
  // Rimuove un allegato dall'elenco degli allegati di una spesa specifica.
  removeAttachment( 
    expenseIndex: number,   // Indice della spesa dalla quale rimuovere l'allegato.
    attachmentIndex: number   // Indice dell'allegato da rimuovere all'interno dell'elenco degli allegati della spesa specifica.
  ): void {

    const expense = this.expenses.at(expenseIndex);  // Ottiene il controllo del modulo (FormGroup "expense") della spesa specifica in base all'indice fornito. In parole semplici, expense rappresenta la spesa corrente selezionata dall'utente.

    // Il metodo .at() è un metodo sicuro per ottenere l'elemento all'indice specificato, evitando errori se l'indice è fuori dai limiti.
    // Per esempio, se per qualche motivo l'indice fornito è maggiore del numero di spese presenti (quando non esiste una spesa a quell'indice), .at() restituirà undefined invece di generare un errore.
    // Questo aiuta a prevenire crash dell'applicazione dovuti a indici non validi.


    const attachments = [    // Crea una copia dell'elenco degli allegati della spesa specifica. Se non ci sono allegati, utilizza un array vuoto come fallback.
      ...expense.value.attachments ?? []  // ... metodo spread per creare una copia dell'array degli allegati esistente, oppure un array vuoto se non ci sono allegati.
    ];

    attachments.splice(   // Rimuove l'allegato specificato dall'elenco degli allegati.
      attachmentIndex,  // Indice dell'allegato da rimuovere.
      1   // Numero di elementi da rimuovere (in questo caso, solo l'allegato specificato).
    );
    
    expense.patchValue({   // Aggiorna il valore del controllo del modulo della spesa corrente con il nuovo elenco degli allegati.
      attachments  // Nuovo elenco degli allegati aggiornato.
    }); // Il metodo patchValue si occupa di aggiornare solo i campi specificati del controllo del modulo, senza sovrascrivere l'intero valore.


}



```