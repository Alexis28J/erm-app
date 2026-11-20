# COMMENTI

In un'applicazione Angular, una Facade è un servizio intermedio che funge da unico punto di accesso semplificato tra i componenti (la UI) e i sottosistemi complessi (servizi HTTP, gestione dello stato, Signal, NgRx, router, ecc.).


- COME FUNZIONA IN PRATICA

Invece di iniettare cinque servizi diversi in un componente e gestirne la logica al suo interno, il componente comunica solo con il servizio Facade.

• Il Componente (UI) diventa "stupido" (dumb/presentational): si limita a mostrare i dati e a chiamare metodi semplici della Facade (es. caricaOrdini()), ignorando come vengono recuperati.

• La Facade orchestra le chiamate ai vari servizi sottostanti, gestisce lo stato e restituisce al componente solo i dati pronti per essere visualizzati.



- PERCHE' è PARTICOLARMENTE UTILE IN ANGULAR 22

Con le novità introdotte in Angular 22 (architettura Zoneless di default, strategia OnPush predefinita, Signal Forms e Resource API stabili), il pattern Facade diventa ancora più pulito:

1. Centralizzazione dei Signal. La Facade incapsula la logica reattiva (es. resource(), httpResource(), computed(), signal()) esponendo ai componenti solo Signal in sola lettura, perfetti per il rilevamento delle modifiche Zoneless.

2. Disaccoppiamento. Se cambi il modo in cui recuperi i dati (es. passi da RxJS a Resource API o cambi libreria di state management), modifichi solo la Facade senza toccare i componenti.

3. Test più semplici. Per testare un componente basta fare il mock della sola Facade invece di simulare decine di dipendenze.


- COMMANDO RAPIDO TRAMITE ANGULAR CLI

ng generate service nome --type=facade
(Oppure in forma abbreviata: ng g s nome --type=facade)


Consiglio: Mantieni la Facade il più semplice possibile, esponendo solo i segnali e i metodi necessari ai componenti. Evita di mettere logica complessa nei componenti stessi.


```TYPESCRIPT
import { computed, inject, Injectable, signal } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AttachmentService } from '../attachment.service';
import { Expense } from '../../interfaces/expense';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { AppConfig } from '../../interfaces/app-config';


@Injectable({
    providedIn: 'root'
})


// Questo facade contiene tutto il codice condiviso tra i componenti new-request ed edit-request 
// come la gestione delle spese, degli allegati e la validazione del modulo.

// 19/11/2026
// Ho cambiato il modo in cui accedo alla configurazione, ora utilizzo il ConfigService invece di ActivatedRoute.
// In questo modo, posso accedere alla configurazione corrente direttamente dal ConfigService senza dover passare per le route.
// Prima accedevo alla configurazione tramite la route attiva (ActivatedRoute), ora la ottengo direttamente dal ConfigService che fornisce la configurazione corrente.
// Il facade non deve avere responsabilità legate alla gestione della route per ottenere la configurazione.


export class RequestFormFacade {

    // INIEZIONE DELLE DIPENDENZE
    private fb = inject(FormBuilder);
    // private route = inject(ActivatedRoute);  // Non più necessario perché accedo alla configurazione tramite il ConfigService
    private configService = inject(ConfigService);  // Servizio per accedere alla configurazione dell'applicazione tramite signal
    private attachmentService = inject(AttachmentService);


    // Variabile che rappresenta il form reattivo per la richiesta di rimborso.
    readonly requestForm = this.fb.group({
        referenceMonth: ['', Validators.required],
        noteEmployee: [''],
        expenses: this.fb.array([])
    });


    // GETTER PER L'ARRAY DELLE SPESE DEL FORM
    get expenses(): FormArray {
        return this.requestForm.controls.expenses;  // Restituisce l'array delle spese del form
    }


    // METODO PRIVATO PER CREARE UN FORM GROUP PER UNA SINGOLA SPESA
    private createExpenseForm(
        expense?: Partial<Expense>  // Partial indica che l'oggetto expense può avere solo alcune proprietà di Expense
    ) {
        return this.fb.group({  // Crea un FormGroup per una singola spesa
            id: [expense?.id ?? crypto.randomUUID()],
            date: [expense?.date ?? '', Validators.required],
            category: [expense?.category ?? '', Validators.required],
            description: [expense?.description ?? ''],
            requestedAmount: [expense?.requestedAmount ?? null, Validators.required],
            approvedAmount: [expense?.approvedAmount ?? 0],
            attachments: [expense?.attachments ?? []]
        });
    }


    // METODO PER AGGIUNGERE UNA NUOVA SPESA AL FORM
    addExpense(): void {
        this.expenses.push(
            this.createExpenseForm()  // Crea un nuovo FormGroup per una spesa vuota e lo aggiunge all'array delle spese
        );
    }


    // METODO PER RIMUOVERE UNA SPESA DAL FORM
    removeExpense(index: number) {  // indice della spesa da rimuovere
        this.expenses.removeAt(index);  // removeAt è un metodo per rimuovere un elemento dall'array delle spese in base all'indice specificato
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // METODO PER POPOLARE LE SPESE NEL FORM
    // Questo metodo viene utilizzato per popolare le spese nel form quando si carica una richiesta esistente.
    populateExpenses(
        expenses: Expense[]
    ): void {

        this.expenses.clear();  // Rimuove tutte le spese esistenti dall'array delle spese prima di popolare con nuove spese
        // Questo passaggio garantisce che l'array delle spese sia vuoto prima di aggiungere le nuove spese fornite come input.

        expenses.forEach(expense => {   // Itera su ciascuna spesa fornita come input e la aggiunge all'array delle spese del form

            this.expenses.push(
                this.createExpenseForm(expense)  // Crea un FormGroup per la spesa fornita come input e lo aggiunge all'array delle spese del form
            );

        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // SIGNAL PER TENERE TRACCIA DEI VALORI DELLE SPESE (IMPORTO RICHIESTO, CATEGORIA, ETC.)
    readonly expensesValue = toSignal(
        this.expenses.valueChanges.pipe(   // Osserva i cambiamenti dei valori delle spese per aggiornare il signal corrispondente
            startWith(this.expenses.getRawValue())  // Inizia con i valori correnti delle spese per avere uno stato iniziale del signal
        ),
        {
            initialValue: []  // Valore iniziale del signal, rappresenta un array vuoto di spese all'inizio
        }

        // Questo signal osserva i cambiamenti dei valori delle spese (importo richiesto, categoria, etc.) e mantiene uno stato reattivo aggiornato con i valori correnti delle spese.
        // valueChanges è l'osservabile che emette i valori correnti delle spese ogni volta che cambiano.
        // pipe è un operatore di RxJS che permette di concatenare più operatori sugli osservabili. In questo caso, viene utilizzato per applicare startWith ai valueChanges.
        // startWith serve a fornire un valore iniziale all'osservabile, in questo caso i valori correnti delle spese.
        // Quindi inizia vuoto e poi si aggiorna man mano che i valori delle spese cambiano.
    );

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // SIGNAL PER LA CONFIGURAZIONE DELL'APPLICAZIONE
    // readonly config = signal<AppConfig>(
    //     this.route.snapshot.data['config']
    // );

    // Commentato perché questo approccio utilizza direttamente i dati della route snapshot, mentre ora utilizziamo il service per ottenere il signal della configurazione.
    // Non è una buona pratica accedere direttamente ai dati della route snapshot della configurazione perché si perderebbe la reattività ai cambiamenti della configurazione stessa.
    // Ma più importante, questo approccio è compito del service della configurazione, non del facade.


    // readonly config = computed(() => this.configService.config());  // Computed per ottenere la configurazione dell'applicazione tramite il ConfigService
    // Uso il computed perché voglio che la configurazione dell'applicazione sia reattiva.
    // In questo modo, se la configurazione cambia nel ConfigService, tutte le parti dell'app che dipendono da questa computed verranno aggiornate automaticamente.

    readonly config = this.configService.config();  // Accesso diretto al signal della configurazione tramite il ConfigService
    // Non ho bisogno di usare computed perché sto accedendo direttamente al signal della configurazione tramite il ConfigService
    // Quindi, uso direttamente il signal senza bisogno di computed. E' più semplice e reattivo.

    // Il facade non deve conoscere i dettagli della configurazione, ma solo esporre il signal.
    // Ecco perché utilizziamo un signal per la configurazione, così il facade può reagire ai cambiamenti senza conoscere i dettagli interni della configurazione stessa.

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // COMPUTED DELLE CATEGORIE DI SPESA
    // readonly expenseCategories = computed(
    //     () => this.config().expenseLimits  // Recupera i limiti delle spese dalla configurazione dell'applicazione
    // );  // E' meglio se uso un fallback a array vuoto se non disponibile

    readonly expenseCategories = computed(
        () => this.config?.expenseLimits ?? []  // Chiamo il signal della configurazione per ottenere i limiti delle spese, con fallback a array vuoto se non disponibile
    );  

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // COMPUTED PER OTTENERE I DATI DI PROGRESSO DELLE SPESE (CATEGORIA E IMPORTO RICHIESTO)
    readonly expenseProgressData = computed(
        () =>
            this.expensesValue().map(
                (expense: Expense) => ({
                    category: expense.category ?? '',
                    amount: Number(expense.requestedAmount ?? 0)
                })
            )
        // Questo computed calcola i dati di progresso delle spese, mappando ogni spesa in un oggetto con categoria e importo richiesto.
        // Viene utilizzato per visualizzare il progresso delle spese in base alle categorie e agli importi richiesti.
    );

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // COMPUTED PER OTTENERE L'IMPORTO TOTALE RICHIESTO PER LE SPESE
    readonly totalRequestedAmount = computed(
        () => {
            const expenses = this.expensesValue();  // Recupera i valori correnti delle spese dal signal

            return expenses.reduce(  
                (total: number, expense: Expense) =>  // total è l'importo accumulato fino a quel momento
                    total + (expense.requestedAmount ?? 0),  
                0   // Valore iniziale del totale, parte da 0
            );
        }

        // Questo computed calcola l'importo totale richiesto per le spese, sommando gli importi richiesti di tutte le spese.
        // reduce è un metodo degli array che permette di accumulare un valore a partire dagli elementi dell'array.
        // In questo caso, somma gli importi richiesti di tutte le spese.

    );

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // COMPUTED PER OTTENERE L'IMPORTO MASSIMO CONSENTITO PER LE SPESE 
    // (SOMMA DEI MASSIMI PER CATEGORIA O TOTALE MASSIMO CONSENTITO)
    readonly totalAllowedAmount = computed(
        () => {
            const expenses = this.expensesValue();  // Recupera i valori correnti delle spese dal signal

            return expenses.reduce(
                (total: number, expense: Expense) => {  // total è l'importo accumulato fino a quel momento
                    const category = this.expenseCategories()  // Recupera tutte le categorie di spesa
                        .find(c => c.name === expense.category);  // Trova la categoria corrispondente alla spesa corrente

                    return total + (category?.maxAmount ?? 0);
                },
                0   // Valore iniziale del totale, parte da 0
            );
        }

        // Questo computed calcola l'importo massimo consentito per le spese, sommando i massimi per categoria di tutte le spese.
        // Se una spesa non ha una categoria corrispondente, viene considerato 0 come importo massimo. 
    );



    // METODO PER VALIDARE IL FORM (CONTROLLA CHE TUTTI I CAMPI RICHIESTI SIANO COMPILATI E CHE CI SIA ALMENO UNA SPESA)
    validateForm(): string | null {

        if (this.requestForm.invalid) {   // Controlla se il form è invalido
            this.requestForm.markAllAsTouched();
            return ('Please fill in all required fields')
        }


        if (this.expenses.length === 0) {   // Controlla se non ci sono spese aggiunte
            return ('Please add at leat one expense')
        };

        return null;
    }


    // METODO PER GESTIRE LA SELEZIONE DEI FILE ALLEGATI PER LE SPESE
    // Questo metodo legge i file selezionati, li converte in oggetti ExpenseAttachment e li aggiunge alla spesa corrispondente.
    async onFilesSelected(
        event: Event,
        expendeIndex: number
    ): Promise<void> {   // Promise<void> indica che il metodo è asincrono e non restituisce un valore.

        const files = (event.target as HTMLInputElement).files;  // Recupera i file selezionati dall'input

        if (!files?.length) {   // Controlla se non ci sono file selezionati
            return;
        }

        const expense = this.expenses.at(expendeIndex);  // Recupera la spesa corrispondente all'indice fornito
        // at è un metodo per accedere a un elemento dell'array FormArray all'indice specificato.

        const attachments = expense.get('attachments')?.value ?? [];  // Recupera gli allegati esistenti della spesa, se presenti

        for (const file of Array.from(files)) {  // Itera su tutti i file selezionati
            attachments.push(  // Aggiunge l'allegato convertito all'array degli allegati della spesa
                await this.attachmentService  // await indica che stiamo aspettando il risultato della conversione asincrona 
                // del file in un oggetto ExpenseAttachment
                    .fileToAttachment(file)  // Converte il file selezionato in un oggetto ExpenseAttachment
            );
        }

        expense.patchValue({  // Aggiorna il valore degli allegati della spesa con l'array aggiornato
            attachments  // Imposta l'array aggiornato degli allegati nella spesa corrispondente
        });  // patchValue è un metodo per aggiornare parzialmente i valori di un FormGroup o FormArray 
        // senza sovrascrivere l'intero oggetto.
    }


    // METODO PER RIMUOVERE UN FILE ALLEGATO (PER OGNI SINGOLA SPESA)
    removeAttachment(
        expenseIndex: number,  // Indice della spesa dalla quale rimuovere l'allegato
        attachmentIndex: number  // Indice dell'allegato da rimuovere dalla spesa corrispondente
    ): void {
        const expense = this.expenses.at(expenseIndex);  // Recupera la spesa corrispondente all'indice fornito

        const attachments = [
            ...(expense.value.attachments ?? [])  // Crea una copia dell'array degli allegati esistenti della spesa
        ];

        attachments.splice(   // Rimuove l'allegato all'indice specificato dall'array degli allegati
            attachmentIndex,  // Indice dell'allegato da rimuovere dall'array degli allegati
            1    // Numero di elementi da rimuovere dall'array degli allegati, in questo caso 1
        );  // splice è un metodo per rimuovere elementi da un array a partire da un indice specificato

        expense.patchValue({   // Aggiorna il valore degli allegati della spesa con l'array aggiornato
            attachments     // Imposta l'array aggiornato degli allegati nella spesa corrispondente
        });
    }

}
```


- Perché non inviare i metodi dei file allegati direttamente al servizio attachment.service?

La Facade funge da intermediario tra i componenti e i servizi sottostanti, permettendo di centralizzare la logica di gestione degli allegati e mantenere i componenti più semplici e disaccoppiati.

Senza la Facade, i componenti dovrebbero interagire direttamente con il servizio attachment.service, aumentando la complessità e il rischio di duplicazione della logica.


- Quindi, ogni componente de avere una facade?

Non necessariamente. La Facade è utile quando un componente deve interagire con più servizi o gestire logica complessa.
Per componenti semplici che interagiscono con un solo servizio, potrebbe non essere necessario creare una Facade dedicata.


- Due servizi possono usare un'unica facade?

Sì, una Facade può orchestrare più servizi sottostanti, centralizzando la logica e fornendo un'interfaccia semplificata ai componenti.
Tuttavia, è importante non sovraccaricare la Facade con troppa responsabilità, mantenendo un buon equilibrio tra semplicità e modularità.