import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-total-progress-bar',
  styleUrl: './total-progress-bar.scss',
  templateUrl: './total-progress-bar.html',
})
export class TotalProgressBar {

  // SIGNALS PER GLI INPUT DELL'IMPORTO RICHIESTO E CONSENTITO
  requestedAmount = input.required<number>();
  allowedAmount = input.required<number>();


  // COMPUTED PER LA PERCENTUALE DI UTILIZZO DELL'IMPORTO CONSENTITO
  percentage = computed(() => {

    const requested = this.requestedAmount();
    const allowed = this.allowedAmount();

    if (!allowed) {
      return 0;
    }

    return Math.min(
      (requested / allowed) * 100,
      100
    );

  });


  // COMPUTED PER LA CLASSE DI PROGRESSO IN BASE ALLA PERCENTUALE
  totalProgressClass = computed(() => {
    const percent = this.percentage();

    if (percent <= 50) {
      return 'safe';

    } else if (percent > 50 && percent <= 80) {
      return 'warning';

    } else {
      return 'danger';
    }
  });

}
