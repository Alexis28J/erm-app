import { afterNextRender, Component, ElementRef, inject, input, output, viewChild } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProgressBar } from '../../../../shared/progress-bar/progress-bar/progress-bar';
import { AttachmentList } from '../../../../shared/attachment-list/attachment-list/attachment-list';

import { RefundRequest } from '../../../../core/interfaces/refund-request';
import { ExpenseLimit } from '../../../../core/interfaces/expense-limit';
import { FocusService } from '../../../../shared/focus-service/focus.service';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-expense-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ProgressBar,
    AttachmentList,
    A11yModule
  ],
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.scss']
})
export class ExpenseList {

  // COSTRUTTORE DEL COMPONENTE CHE INIZIALIZZA IL FOCUS SULLA CARD
  constructor() {

    afterNextRender(() => {
      this.focusService.setCustomTarget(this.focusCard());
    });

  }


  // RIFERIMENTO ALLA FOCUS CARD (ELEMENTO DEL DOM)
  private focusCard = viewChild.required<ElementRef<HTMLElement>>('focusCard');


  // INIEZIONE SERVIZIO FOCUS
  private focusService = inject(FocusService);


  // INPUTS
  request = input.required<RefundRequest>();

  reviewMode = input(false);

  formError = input('');

  expenseLimits = input.required<ExpenseLimit[]>();


  // OUTPUTS
  approvedAmountChanged = output<{
    expenseId: string;
    value: number;
  }>();


  // METODO DI SUPPORTO SOLO UI
  getMaxAmount(categoryName: string): number {

    return this.expenseLimits()
      .find(limit => limit.name === categoryName)
      ?.maxAmount ?? 0;

  }

}



// VS Code Counter: 53 code lines (29/10/2026)