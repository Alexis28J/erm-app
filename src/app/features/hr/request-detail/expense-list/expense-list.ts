import { Component, input, output } from '@angular/core';

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
    AttachmentList
  ],
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.scss']
})
export class ExpenseList {

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



// VS Code Counter: 43 code lines (21/10/2026)