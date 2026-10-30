import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  maxAmount = input.required<number>();

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
    ) : 0;  // Restituisce 0 se max non è definito
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



// VS Code Counter: 34 code lines (13/10/2026)