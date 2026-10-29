import { afterNextRender, Component, computed, effect, ElementRef, signal, viewChild } from '@angular/core';
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
import { TotalProgressBar } from '../../../shared/total-progress-bar/total-progress-bar/total-progress-bar';
import { AttachmentList } from '../../../shared/attachment-list/attachment-list/attachment-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppConfig } from '../../../core/interfaces/app-config';
import { FocusService } from '../../../shared/focus-service/focus.service';

@Component({
  imports: [CommonModule, MatCardModule, MatIconModule,
    MatButtonModule, RouterLink, MatProgressSpinnerModule,
    ProgressBar, TotalProgressBar, AttachmentList,
    MatTooltipModule],
  selector: 'app-request-details',
  styleUrls: ['./request-details.scss'],
  templateUrl: './request-details.html',
})
export class RequestDetails {

  // COSTRUTTORE DEL COMPONENTE CHE INIZIALIZZA L'EFFECT PER IL FOCUS DELLA CARD
  constructor() {

    // 2. L'effect monitora costantemente il Signal 'focusCard'
    effect(() => {
      const card = this.focusCard();

      // 3. Non appena la card appare nel DOM (diventa diversa da undefined), agisce di conseguenza
      if (card) {
        this.focusService.setCustomTarget(card);
      }
    })

  }

  // INIEZIONE DEI SERVIZI E RECUPERO DELL'ID DELLA RICHIESTA DI RIMBORSO
  private route = inject(ActivatedRoute);
  private refundRequestService = inject(RefundRequestService);
  private focusService = inject(FocusService);

  // 1. Rimuovo .required() -> Ora restituisce ElementRef o undefined
  private focusCard = viewChild<ElementRef<HTMLElement>>('focusCard');


  config = signal<AppConfig>(
    this.route.snapshot.data['config']
  )


  expenseCategories = computed(() =>
    this.config().expenseLimits
  )


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


  getMaxAmount(categoryName: string): number {
    return this.expenseCategories()
      .find(c => c.name === categoryName)?.maxAmount ?? 0;
  }


  // CALCOLO DELL'IMPORTO CONSENTITO TOTALE
  readonly totalAllowedAmount = computed(() => {

    const request = this.request();

    if (!request) {
      return 0;
    }

    return request.expenses.reduce((total, expense) => {
      // const category = EXPENSE_CATEGORIES.find(
      //   c => c.name === expense.category
      // );

      const category = this.expenseCategories().find(
        c => c.name === expense.category
      );

      return total + (category?.maxAmount ?? 0);
    }, 0
    );

  });


  // CALCOLO DELL'IMPORTO RICHIESTO TOTALE
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



// VS Code Counter:  code lines (/10/2026)




