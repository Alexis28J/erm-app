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
import { inject, Injectable } from '@angular/core';
import { RequestFormFacade } from './request-form.facade';
import { AuthService } from '../auth.service';
import { RefundRequestService } from '../refund-request.service';
import { RefundRequest } from '../../interfaces/refund-request';
import { RequestStatus } from '../../interfaces/enum';
import { Expense } from '../../interfaces/expense';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

// RESPONSABILITA': 
// createRequest
// saveDraft
// submitRequest

export class NewRequestFacade {

    // INIEZIONE DELLE DIPENDENZE
    readonly formFacade = inject(RequestFormFacade);
    private authService = inject(AuthService);
    private refundRequestService = inject(RefundRequestService);


    // METODO PRIVATO PER COSTRUIRE LA RICHIESTA DI RIMBORSO
    // Questo metodo costruisce la struttura della richiesta di rimborso
    // a partire dai dati presenti nel form e dallo stato passato come parametro
    private buildRequest(
        status: RequestStatus
    ): RefundRequest {

        const currentUser = this.authService.getCurrentUser();  // Prendo l'utente corrente

        if (!currentUser) {  // Se (per qualche motivo) l'utente corrente non è trovato, lancio un errore
            throw new Error(
                'User not found'
            );
        }

        return {   // Altrimenti costruisce la richiesta di rimborso con i dati del form e lo stato passato come parametro

            userId: currentUser.id,  // ID dell'utente corrente

            referenceMonth: this.formFacade.requestForm  // Mese di riferimento della richiesta
                .value.referenceMonth ?? '',

            noteEmployee: this.formFacade.requestForm  // Note inserite dall'impiegato
                .value.noteEmployee ?? '',

            noteHr: '',  // Note inserite dall'HR

            expenses: (
                this.formFacade.requestForm.value.expenses ?? []   // Spese inserite nel form
            ) as Expense[],

            totalRequestedAmount: this.formFacade.totalRequestedAmount(),  // Totale richiesto calcolato dal form

            totalApprovedAmount: 0,  // Totale approvato inizialmente a 0

            status,   // Stato della richiesta (DRAFT o PENDING)

            creationDate: new Date().toISOString(),  // Data di creazione della richiesta

            lastUpdateDate: new Date().toISOString()  // Data dell'ultimo aggiornamento della richiesta

        };
    }


    // METODO PER SALVARE LA BOZZA DELLA RICHIESTA DI RIMBORSO
    // Questo metodo crea una bozza della richiesta di rimborso utilizzando lo stato DRAFT
    // Prende la struttura della richiesta di rimborso costruita dal metodo buildRequest con lo stato DRAFT
    saveDraft() {

        const request = this.buildRequest(RequestStatus.DRAFT);  // Costruisce la richiesta di rimborso con lo stato DRAFT

        return this.refundRequestService.createRequest(request);  // Crea la richiesta di rimborso nel servizio (Observable<RefundRequest>) che viene salvata nel backend
        // Ricorda che il metodo createRequest ritorna un Observable che rappresenta la richiesta creata

    }


    // METODO PER INVIARE LA RICHIESTA DI RIMBORSO
    // Questo metodo valida il form e, se non ci sono errori, crea la richiesta di rimborso con lo stato PENDING
    submitRequest() {

        const validationError = this.formFacade.validateForm();  // Valida il form e restituisce eventuali errori di validazione

        if (validationError) {  // Se ci sono errori di validazione, interrompe il processo e restituisce un errore
            return throwError(  // Restituisce un errore Observable se ci sono errori di validazione
                () => new Error(
                    validationError // Messaggio di errore di validazione del form
                )
            );
        }

        const request = this.buildRequest(
            RequestStatus.PENDING  // Costruisce la richiesta di rimborso con lo stato PENDING
        );

        return this.refundRequestService.createRequest(request);  // Crea la richiesta di rimborso nel servizio (Observable<RefundRequest>) che viene salvata nel backend
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