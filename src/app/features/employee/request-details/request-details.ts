import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RefundRequestService } from '../../../core/services/refund-request.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RefundRequest } from '../../../core/interfaces/refund-request';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressBar } from '../../../shared/progress-bar/progress-bar/progress-bar';
import { EXPENSE_CATEGORIES } from '../../../core/constants/expense-categories.constant';
import { TotalProgressBar } from '../../../shared/total-progress-bar/total-progress-bar/total-progress-bar'; 


@Component({
  imports: [CommonModule, MatCardModule, MatIconModule,
    MatButtonModule, RouterLink, MatProgressSpinnerModule,
    ProgressBar, TotalProgressBar],
  selector: 'app-request-details',
  styleUrls: ['./request-details.scss'],
  templateUrl: './request-details.html',
})
export class RequestDetails {

  // INIEZIONE DEI SERVIZI E RECUPERO DELL'ID DELLA RICHIESTA DI RIMBORSO
  private route = inject(ActivatedRoute);
  private refundRequestService = inject(RefundRequestService);


  // RECUPERO DELL'ID DELLA RICHIESTA DI RIMBORSO
  private requestId = this.route.snapshot.paramMap.get('id');


  // CONVERSIONE DELL'OBSERVABLE IN SIGNAL
  request = toSignal<RefundRequest | null>(
    this.refundRequestService
      .getRequestById(this.requestId!),
    {
      initialValue: null
    }
  );


  readonly totalAllowedAmount = computed(() => {

    const request = this.request();

    if (!request) {
      return 0;
    }

    return request.expenses.reduce((total, expense) => {
      const category = EXPENSE_CATEGORIES.find(
        c => c.name === expense.category
      );

      return total + (category?.maxAmount ?? 0);
    }, 0
    );
  })


  readonly totalRequestedAmount = computed(() => {

    const request = this.request();

    if (!request) {
      return 0;
    }

    return request.expenses.reduce(
      (sum, expense) => sum + expense.requestedAmount,
      0
    );
  });

}


// La barra di progresso totale prende in input l'importo richiesto totale e l'importo consentito totale 
// grazie ai segnali totalRequestedAmount e totalAllowedAmount che permettono di aggiornare dinamicamente la barra di progresso totale.

// Ma come si comunica l'importo richiesto totale e l'importo consentito totale alla barra di progresso totale?
// Si passa come input le proprietà totalRequestedAmount e totalAllowedAmount al componente TotalProgressBar nel template HTML grazie alla sintassi di binding di Angular.
// Vedi questa riga:
// <app-total-progress-bar 
//     [totalRequestedAmount]="totalRequestedAmount()" 
//     [totalAllowedAmount]="totalAllowedAmount()">
// </app-total-progress-bar>

//Quindi, in questo modo, posso usare il componente TotalProgressBar nel template HTML del componente RequestDetails o in qualsiasi altro componente che necessiti di visualizzare la barra di progresso totale.

