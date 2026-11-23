import { effect, inject, Injectable, signal } from '@angular/core';
import { RequestFormFacade } from './request-form.facade';
import { AuthService } from '../auth.service';
import { RefundRequestService } from '../refund-request.service';
import { RequestStatus } from '../../interfaces/enum';
import { RefundRequest } from '../../interfaces/refund-request';
import { Expense } from '../../interfaces/expense';
import { throwError } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class EditRequestFacade {

    constructor() {

        // EFFETTO PER POPOLARE IL FORM QUANDO LA RICHIESTA VIENE CARICATA
        effect(() => {

            const request = this.request();

            if (!request || this.initialized) {
                return;
            }

            this.formFacade.requestForm.patchValue({

                referenceMonth: request.referenceMonth,
                noteEmployee: request.noteEmployee ?? '',

            });

            this.formFacade.populateExpenses(request.expenses);
            this.initialized = true;
            
        });

    }


    // INIEZIONE DEI SERVIZI E VARIABILI NECESSARIE PER LA MODIFICA DELLA RICHIESTA
    readonly formFacade = inject(RequestFormFacade);
    private authService = inject(AuthService);
    private refundRequestService = inject(RefundRequestService);
    private initialized = false;


    // SEGNALE PER MEMORIZZARE LA RICHIESTA CARICATA DAL RESOLVER
    readonly request = signal<RefundRequest | null>(null);


    // METODO PER INIZIALIZZARE IL FACADE CON LA RICHIESTA CARICATA DAL RESOLVER
    initialize(request: RefundRequest): void {
        this.formFacade.requestForm.reset();
        this.formFacade.populateExpenses([]);
        this.initialized = false;
        this.request.set(request);
    }

    // Quindi, il flusso per ottenere la richiesta aggiornata nel form è il seguente:
    // 1. Il resolver carica la richiesta dal backend tramite il RefundRequestService.
    // 2. Il componente (EditRequest) chiama il metodo initialize del facade con la richiesta caricata.
    // 3. Il signal request viene aggiornato e tramite, l'effetto definito nel costruttore, 
    // il form viene popolato con i dati della richiesta.


    // METODO PRIVATO PER COSTRUIRE LA STRUTTURA DELLA RICHIESTA AGGIORNATA
    private buildRequest(
        status: RequestStatus
    ): RefundRequest {

        const request = this.request();

        if (!request) {
            throw new Error('Request not loaded');
        }

        return {

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

        const request = this.buildRequest(RequestStatus.DRAFT);

        return this.refundRequestService.updateRequest(request.id!, request);

    }


    // METODO PER INVIARE LA RICHIESTA
    submitRequest() {

        const currentUser = this.authService.getCurrentUser();

        if (!currentUser) {
            return throwError(
                () => new Error('User not found')
            );
        }

        const validationError = this.formFacade.validateForm();

        if (validationError) {

            return throwError(
                () => new Error(validationError)
            );
        }

        const request = this.buildRequest(RequestStatus.PENDING);

        return this.refundRequestService.updateRequest(request.id!, request);

    }

}



// VS Code Counter: 75 code lines (20/11/2026)




