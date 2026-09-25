import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EXPENSE_CATEGORIES } from '../../../core/constants/expense-categories.constant';

@Component({
  imports: [CommonModule],
  selector: 'app-progress-bar',
  styleUrl: './progress-bar.scss',
  templateUrl: './progress-bar.html',
})
export class ProgressBar {

  // SIGNALS PER GLI INPUT DELLA CATEGORIA E DELL'IMPORTO
  category = input.required<string>();
  amount = input.required<number>();


  // COMPUTED PER L'IMPORTO MASSIMO DI UNA CATEGORIA DI SPESA
  readonly maxAmount = computed(() => {
    return (
      EXPENSE_CATEGORIES.find(
        c => c.name === this.category()
      )?.maxAmount ?? 0
    );
  });


  // COMPUTED PER LA PERCENTUALE DI UTILIZZO DELL'IMPORTO MASSIMO DI UNA CATEGORIA DI SPESA
  readonly percentage = computed(() => {
    const max = this.maxAmount();
    const amount = Number(this.amount() || 0);

    if (!max) {
      return 0;
    }

    return max ? Math.min(
      (amount / max) * 100,
      100
    ) : 0;
  });
  

  // COMPUTED PER LA CLASSE DI PROGRESSO IN BASE ALLA PERCENTUALE
  readonly progressClass = computed(() => {
    const percent = this.percentage();

    if (percent <= 60) {
      return 'safe';
    }

    if (percent <= 85) {
      return 'warning';
    }

    return 'danger';
  });

}
