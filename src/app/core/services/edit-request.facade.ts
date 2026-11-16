import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RefundRequestService } from './refund-request.service';
import { AuthService } from './auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RefundRequest } from '../interfaces/refund-request';
import { startWith, throwError } from 'rxjs';
import { Expense } from '../interfaces/expense';
import { AppConfig } from '../interfaces/app-config';
import { RequestStatus } from '../interfaces/enum';
import { AttachmentService } from './attachment.service';

@Injectable()
export class EditRequestFacade {


    constructor() {

        effect(() => {
            const request = this.request();

            if (!request || this.formInitialized) {
                return;
            }

            this.populateForm(request);

            this.formInitialized = true;
        })
    }


    // INIEZIONE DELLE DIPENDENZE
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private refundRequestService = inject(RefundRequestService);
    private authService = inject(AuthService);
    private attachmentService = inject(AttachmentService);


    // Variabile che indica se il form è stato inizializzato.
    private formInitialized = false;


    // Variabile che contiene l'ID della richiesta corrente.
    readonly requestId = this.route.snapshot.paramMap.get('id');


    // Variabile che rappresenta il segnale della richiesta di rimborso corrente.
    readonly request = toSignal(
        this.refundRequestService.getRequestById(
            this.requestId ?? ''
        ),
        {
            initialValue: null
        }
    );


    // Variabile che rappresenta il form reattivo per la richiesta di rimborso.
    readonly requestForm = this.fb.group({
        referenceMonth: ['', Validators.required],
        noteEmployee: [''],
        expenses: this.fb.array([])
    });


    // GETTER PER L'ARRAY DELLE SPESE DEL FORM
    get expenses(): FormArray {
        return this.requestForm.controls.expenses;  // E' uguale a this.requestForm.get('expenses') as FormArray
    }   // Non c'è bisogno di fare il cast a FormArray se si usa controls.
    // Non c'è differenza tra queste due modalità di accesso all'array delle spese.


    private createExpenseForm(
        expense?: Partial<Expense>
    ) {
        return this.fb.group({

            date: [expense?.date ?? '', Validators.required],
            category: [expense?.category ?? '', Validators.required],
            description: [expense?.description ?? ''],
            requestedAmount: [
                expense?.requestedAmount ?? '',
                Validators.required
            ],
            attachments: [expense?.attachments ?? []]
        });
    }




    // METODO PRIVATO PER POPOLARE IL FORM CON I DATI DELLA RICHIESTA CORRENTE 
    // (SI USA QUANDO SI CARICA UNA RICHIESTA ESISTENTE)
    private populateForm(
        request: RefundRequest
    ): void {

        this.requestForm.patchValue({
            referenceMonth: request.referenceMonth,
            noteEmployee: request.noteEmployee ?? ''
        });

        this.expenses.clear();

        // request.expenses.forEach(expense => {

        //     this.expenses.push(
        //         this.fb.group({
        //             date: [expense.date, Validators.required],
        //             category: [expense.category, Validators.required],
        //             description: [expense.description],
        //             requestedAmount: [expense.requestedAmount, Validators.required],
        //             attachments: [expense.attachments ?? []]
        //         })
        //     );
        // });

        request.expenses.forEach(expense => {

            this.expenses.push(
                this.createExpenseForm(expense)
            );
        });

    }


    // METODO PER AGGIUNGERE UNA NUOVA SPESA AL FORM
    addExpense(): void {
        // this.expenses.push(
        //     this.fb.group({
        //         date: ['', Validators.required],
        //         category: ['', Validators.required],
        //         description: [''],
        //         requestedAmount: ['', Validators.required],
        //         attachments: [[]]
        //     })
        // );
        this.expenses.push(
            this.createExpenseForm()
        );
    }


    // METODO PER RIMUOVERE UNA SPESA DAL FORM
    removeExpense(index: number): void {
        this.expenses.removeAt(index);
    }


    // SIGNAL PER TENERE TRACCIA DEI VALORI DELLE SPESE (IMPORTO RICHIESTO, CATEGORIA, ETC.)
    expensesValue = toSignal(
        this.expenses.valueChanges.pipe(
            startWith(this.expenses.getRawValue())
        ),
        {
            initialValue: []
        }
    )


    // COMPUTED PER OTTENERE I DATI DI PROGRESSO DELLE SPESE (CATEGORIA E IMPORTO RICHIESTO)
    expenseProgressData = computed(() => {
        return this.expensesValue().map((expense: Expense) => ({
            category: expense.category ?? '',
            amount: Number(expense.requestedAmount ?? 0)
        }))
    })


    // SIGNAL PER LA CONFIGURAZIONE DELL'APPLICAZIONE
    config = signal<AppConfig>(
        this.route.snapshot.data['config']
    );


    // COMPUTED DELLE CATEGORIE DI SPESA
    expenseCategories = computed(
        () => this.config().expenseLimits
    );


    // COMPUTED PER OTTENERE L'IMPORTO MASSIMO CONSENTITO PER LE SPESE 
    // (SOMMA DEI MASSIMI PER CATEGORIA O TOTALE MASSIMO CONSENTITO)
    readonly totalAllowedAmount = computed(() => {
        const request = this.expensesValue();

        if (!request || request.length === 0) {
            return 0
        }

        return request.reduce((total: number, expense: Expense) => {
            const category = this.expenseCategories().find(
                c => c.name === expense.category
            );

            return total + (category?.maxAmount ?? 0);
        }, 0
        );

    });


    // COMPUTED PER OTTENERE L'IMPORTO TOTALE RICHIESTO PER LE SPESE
    readonly totalRequestedAmount = computed(() => {

        const request = this.expensesValue();

        if (!request || request.length === 0) {
            return 0
        }

        return request.reduce(
            (total: number, expense: Expense) => {
                return total + (expense.requestedAmount ?? 0);
            }, 0
        );
    });


    // METODO PER COSTRUIRE LA RICHIESTA DI RIMBORSO CON LO STATO SPECIFICATO (BOZZA O INVIATA)
    // Questo metodo serve a costruire l'oggetto RefundRequest con i dati correnti del form e lo stato specificato.
    // in modo che il componente non debba preoccuparsi di costruire manualmente l'oggetto RefundRequest.
    // Quindi questo metodo viene utilizzato internamente da saveDraft() e submitRequest() per costruire l'oggetto RefundRequest con lo stato corretto.
    private buildRequest(
        status: RequestStatus
    ): RefundRequest {

        const request = this.request();

        if (!request) {
            throw new Error('Request not loaded');
        }

        return {
            ...request,

            referenceMonth: this.requestForm.value.referenceMonth ?? '',
            noteEmployee: this.requestForm.value.noteEmployee ?? '',
            expenses: (this.requestForm.value.expenses ?? []) as Expense[],
            totalRequestedAmount: this.totalRequestedAmount(),
            status,
            lastUpdateDate: new Date().toISOString()
        };
    }


    // METODO PER VALIDARE IL FORM 
    private validateForm(): string | null {

        if (this.requestForm.invalid) {
            this.requestForm.markAllAsTouched();
            return 'Please fill in all required fields'
        }

        if (this.expenses.length === 0) {
            return 'Please add at least one expense';
        }

        if (this.expenses.controls.some(
            expense => !expense.valid
        )
        ) {
            return 'Please fill in all required fields for each expense'

        }

        return null;

    }


    // METODO PER SALVARE LA RICHIESTA COME BOZZA
    saveDraft() {

        const request = this.buildRequest(
            RequestStatus.DRAFT
        );

        return this.refundRequestService.updateRequest(
            request.id!,
            request
        );

    }


    // METODO PER INVIARE LA RICHIESTA
    submitRequest() {

        const currentUser = this.authService.getCurrentUser();

        if (!currentUser) {
            return throwError(
                () => new Error('User not found')
            );
        }

        const validationError = this.validateForm();

        if (validationError) {
            return throwError(
                () => new Error(validationError)
            );
        }

        const request = this.buildRequest(
            RequestStatus.PENDING
        );

        return this.refundRequestService.updateRequest(
            request.id!,
            request
        );
    }


    // METODO PER GESTIRE LA SELEZIONE DEI FILE ALLEGATI PER LE SPESE
    // Questo metodo legge i file selezionati, li converte in oggetti ExpenseAttachment e li aggiunge alla spesa corrispondente.
    async onFilesSelected(event: Event, expenseIndex: number): Promise<void> {
        // async è una parola chiave che indica che la funzione è asincrona e restituisce una Promise.
        // async funziona insieme alla parola chiave await, permettendo di scrivere codice asincrono come se fosse sincrono, 
        // utilizzando await per attendere il completamento delle operazioni asincrone.

        const files = (event.target as HTMLInputElement).files;  // Ottiene i file selezionati dall'input HTML.

        if (!files?.length) {   // Se non ci sono file selezionati, esce dalla funzione.
            return;
        }

        // Array.from(files).forEach(file => {

        //     const reader = new FileReader();

        //     reader.onload = () => {

        //         const expense = this.expenses.at(expenseIndex);

        //         const attachments = expense.get('attachments')?.value ?? [];

        //         attachments.push({
        //             fileName: file.name,
        //             fileType: file.type,
        //             fileContent: reader.result as string
        //         });

        //         expense.patchValue({
        //             attachments
        //         });
        //     };

        //     reader.readAsDataURL(file);
        // });

        const expense = this.expenses.at(expenseIndex);  // Ottiene la spesa corrispondente all'indice specificato.

        const attachments = expense.get('attachments')?.value ?? [];  // Ottiene gli allegati esistenti della spesa, se presenti.

        for (const file of Array.from(files)) {

            attachments.push(  // Converte il file selezionato in un oggetto ExpenseAttachment e lo aggiunge all'array degli allegati.
                await this.attachmentService
                    .fileToAttachment(file)
            );
        }

        expense.patchValue({  // Aggiorna la spesa con il nuovo array di allegati.
            attachments
        });

    }


    // METODO PER RIMUOVERE UN FILE ALLEGATO (PER OGNI SINGOLA SPESA)
    removeAttachment(
        expenseIndex: number,
        attachmentIndex: number
    ): void {

        const expense = this.expenses.at(expenseIndex);  // Ottiene la spesa corrispondente all'indice specificato.

        const attachments = [  // Crea una copia dell'array degli allegati esistenti della spesa.
            ...expense.value.attachments ?? []
        ];

        attachments.splice(  //  Il metodo splice rimuove elementi dall'array a partire dall'indice specificato.
            attachmentIndex,
            1  // Numero di elementi da rimuovere.
        );

        expense.patchValue({  // Aggiorna la spesa con il nuovo array di allegati. 
            // patchValue è un metodo di FormGroup che permette di aggiornare parzialmente i valori del form.
            attachments // Indica il nuovo array di allegati da aggiornare nella spesa.
        });

    }

    // Perché non inviare i metodi dei file allegati direttamente al servizio attachment.service?
    // La Facade funge da intermediario tra i componenti e i servizi sottostanti, 
    // permettendo di centralizzare la logica di gestione degli allegati e mantenere i componenti più semplici e disaccoppiati.
    // Senza la Facade, i componenti dovrebbero interagire direttamente con il servizio attachment.service, 
    // aumentando la complessità e il rischio di duplicazione della logica.

    // Quindi, ogni componente de avere una facade?
    // Non necessariamente. La Facade è utile quando un componente deve interagire con più servizi o gestire logica complessa.
    // Per componenti semplici che interagiscono con un solo servizio, potrebbe non essere necessario creare una Facade dedicata.

    // Due servizi possono usare un'unica facade?
    // Sì, una Facade può orchestrare più servizi sottostanti, centralizzando la logica e fornendo un'interfaccia semplificata ai componenti.
    // Tuttavia, è importante non sovraccaricare la Facade con troppa responsabilità, mantenendo un buon equilibrio tra semplicità e modularità.
}



// VS Code Counter: 224 code lines (16/11/2026)



// cosa succede se non aggiungo private a un metodo?
// Se non aggiungo private a un metodo, esso diventa pubblico per default e può essere chiamato da altre classi o componenti.
// Questo evita che altri componenti o classi possano chiamare il metodo direttamente, garantendo un migliore incapsulamento della logica interna.
// Un migliore incapsulamento della logica interna è garantire che i metodi e le proprietà che non devono essere accessibili dall'esterno siano dichiarati come private, 
// riducendo il rischio di utilizzo improprio e facilitando la manutenzione del codice.


// In un'applicazione Angular, una Facade è un servizio intermedio che funge da unico punto di accesso semplificato 
// tra i componenti (la UI) e i sottosistemi complessi (servizi HTTP, gestione dello stato, Signal, NgRx, router, ecc.).


// COME FUNZIONA IN PRATICA

// Invece di iniettare cinque servizi diversi in un componente e gestirne la logica al suo interno, il componente comunica solo con il servizio Facade.

// • Il Componente (UI) diventa "stupido" (dumb/presentational): si limita a mostrare i dati e a chiamare metodi semplici della Facade (es. caricaOrdini()), ignorando come vengono recuperati.
// • La Facade orchestra le chiamate ai vari servizi sottostanti, gestisce lo stato e restituisce al componente solo i dati pronti per essere visualizzati.



// PERCHE' è PARTICOLARMENTE UTILE IN ANGULAR 22

// Con le novità introdotte in Angular 22 (architettura Zoneless di default, strategia OnPush predefinita, Signal Forms e Resource API stabili), il pattern Facade diventa ancora più pulito:
// 1. Centralizzazione dei Signal. La Facade incapsula la logica reattiva (es. resource(), httpResource(), computed(), signal()) 
// esponendo ai componenti solo Signal in sola lettura, perfetti per il rilevamento delle modifiche Zoneless.
// 2. Disaccoppiamento. Se cambi il modo in cui recuperi i dati (es. passi da RxJS a Resource API o cambi libreria di state management), 
// modifichi solo la Facade senza toccare i componenti.
// 3. Test più semplici. Per testare un componente basta fare il mock della sola Facade invece di simulare decine di dipendenze.


// COMMANDO RAPIDO TRAMITE ANGULAR CLI
// ng generate service nome --type=facade
// (Oppure in forma abbreviata: ng g s nome --type=facade)


// Consiglio: Mantieni la Facade il più semplice possibile, esponendo solo i segnali e i metodi necessari ai componenti. Evita di mettere logica complessa nei componenti stessi.