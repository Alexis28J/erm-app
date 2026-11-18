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
    saveDraft() {

        const request = this.buildRequest(RequestStatus.DRAFT);

        return this.refundRequestService.createRequest(request);

    }


    // METODO PER INVIARE LA RICHIESTA DI RIMBORSO
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



// VS Code Counter: 60 code lines (18/11/2026)