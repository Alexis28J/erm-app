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

  // RESPONSABILITA': 
  // Caricare la richiesta
  // Popolare il form
  // Aggiornare la richiesta (salvare come bozza o inviare per approvazione)

    constructor() {

        // EFFETTO PER POPOLARE IL FORM QUANDO LA RICHIESTA VIENE CARICATA
        effect(() => {

            const request = this.request();  // Ottiene la richiesta corrente dal segnale

            if (!request || this.initialized) {  // Se la richiesta non è caricata o il form è già inizializzato, esce dall'effetto
                return;
            }

            this.formFacade.requestForm.patchValue({  // Popola il form con i dati della richiesta

                referenceMonth: request.referenceMonth,

                noteEmployee: request.noteEmployee ?? '',

            });

            this.formFacade.populateExpenses(request.expenses);  // Popola le spese nel form

            this.initialized = true;  // Segnala che il form è stato inizializzato con i dati della richiesta
        });

    }


    // INIEZIONE DEI SERVIZI E VARIABILI NECESSARIE PER LA MODIFICA DELLA RICHIESTA
    readonly formFacade = inject(RequestFormFacade);
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private refundRequestService = inject(RefundRequestService);
    private initialized = false;

    readonly requestId = this.route.snapshot.paramMap.get('id');


    // SEGNALE PER OTTENERE LA RICHIESTA DAL SERVIZIO DI RIMBORSO
    readonly request = toSignal(
        this.refundRequestService
            .getRequestById(this.requestId ?? ''),  // Ottiene la richiesta di rimborso dal servizio utilizzando l'ID della richiesta
        {
            initialValue: null  // Valore iniziale del segnale prima che la richiesta venga caricata
        }
    );


    // METODO PRIVATO PER COSTRUIRE LA STRUTTURA DELLA RICHIESTA AGGIORNATA
    private buildRequest(
        status: RequestStatus
    ): RefundRequest {

        const request = this.request();  // Ottiene la richiesta corrente dal segnale

        if (!request) {  // Se la richiesta non è caricata, lancia un errore
            throw new Error('Request not loaded');
        }

        return {   // Altrimenti costruisce la richiesta aggiornata con i dati del form e lo stato passato come parametro

            ...request,

            referenceMonth: this.formFacade.requestForm.value.referenceMonth ?? '',

            noteEmployee: this.formFacade.requestForm.value.noteEmployee ?? '',

            expenses: (this.formFacade.requestForm.value.expenses ?? []) as Expense[],

            totalRequestedAmount: this.formFacade.totalRequestedAmount(),

            status,

            lastUpdateDate: new Date().toISOString()

        };
    }


    // METODO PER SALVARE LA RICHIESTA COME BOZZA
    saveDraft() {

        const request = this.buildRequest(RequestStatus.DRAFT);  // Costruisce la richiesta aggiornata con lo stato DRAFT

        return this.refundRequestService.updateRequest(request.id!, request);  // Aggiorna la richiesta nel servizio con i dati della bozza

    }


    // METODO PER INVIARE LA RICHIESTA
    submitRequest() {

        const currentUser = this.authService.getCurrentUser();  // Ottiene l'utente corrente

        if (!currentUser) {  // Se l'utente corrente non è trovato, restituisce un errore
            return throwError(
                () => new Error('User not found')
            );
        }

        const validationError = this.formFacade.validateForm();  // Valida il form e restituisce eventuali errori di validazione

        if (validationError) {  // Se ci sono errori di validazione, interrompe il processo e restituisce un errore

            return throwError(   // Restituisce un errore Observable se ci sono errori di validazione
                () => new Error(validationError)  // Messaggio di errore di validazione del form
            );
        }

        const request = this.buildRequest(RequestStatus.PENDING);  // Costruisce la richiesta aggiornata con lo stato PENDING

        return this.refundRequestService.updateRequest(request.id!, request);  // Aggiorna la richiesta nel servizio con i dati inviati per approvazione
        
    }

    // throwError è un metodo di RxJS che crea un Observable che emette un errore e termina immediatamente.
    // Viene utilizzato per gestire gli errori durante la validazione del form o il recupero dell'utente corrente.
    // new Error(validationError) indica l'errore specifico riscontrato durante la validazione del form.
    // Quindi validationError che è un metodo di RequestFormFacade restituisce il messaggio di errore se la validazione del form fallisce.

}
```


Ogni componente de avere una facade?

Non necessariamente. La Facade è utile quando un componente deve interagire con più servizi o gestire logica complessa.
Per componenti semplici che interagiscono con un solo servizio, potrebbe non essere necessario creare una Facade dedicata.


- Due servizi possono usare un'unica facade?

Sì, una Facade può orchestrare più servizi sottostanti, centralizzando la logica e fornendo un'interfaccia semplificata ai componenti.
Tuttavia, è importante non sovraccaricare la Facade con troppa responsabilità, mantenendo un buon equilibrio tra semplicità e modularità.