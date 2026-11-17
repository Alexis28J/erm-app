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

        const currentUser = this.authService.getCurrentUser();

        if (!currentUser) {
            throw new Error(
                'User not found'
            );
        }

        return {

            userId: currentUser.id,

            referenceMonth: this.formFacade.requestForm
                .value.referenceMonth ?? '',

            noteEmployee: this.formFacade.requestForm
                .value.noteEmployee ?? '',

            noteHr: '',

            expenses: (
                this.formFacade.requestForm.value.expenses ?? []
            ) as Expense[],

            totalRequestedAmount: this.formFacade.totalRequestedAmount(),

            totalApprovedAmount: 0,

            status,

            creationDate: new Date().toISOString(),

            lastUpdateDate: new Date().toISOString()

        };
    }


    // METODO PER SALVARE LA BOZZA DELLA RICHIESTA DI RIMBORSO
    // Questo metodo crea una bozza della richiesta di rimborso utilizzando lo stato DRAFT
    // Prende la struttura della richiesta di rimborso costruita dal metodo buildRequest con lo stato DRAFT
    saveDraft() {

        const request = this.buildRequest(RequestStatus.DRAFT);

        return this.refundRequestService.createRequest(request);

    }


    // METODO PER INVIARE LA RICHIESTA DI RIMBORSO
    // Questo metodo valida il form e, se non ci sono errori, crea la richiesta di rimborso con lo stato PENDING
    submitRequest() {

        const validationError = this.formFacade.validateForm();

        if (validationError) {

            return throwError(
                () => new Error(
                    validationError
                )
            );
        }

        const request = this.buildRequest(
            RequestStatus.PENDING
        );

        return this.refundRequestService.createRequest(request);
    }
}


// RESPONSABILITA': 
// createRequest
// saveDraft
// submitRequest