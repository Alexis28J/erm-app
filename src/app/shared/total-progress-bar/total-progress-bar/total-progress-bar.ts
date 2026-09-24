import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-total-progress-bar',
  styleUrl: './total-progress-bar.scss',
  templateUrl: './total-progress-bar.html',
})
export class TotalProgressBar {

  requestedAmount = input.required<number>();  // Signal reattivo per l'importo richiesto
  allowedAmount = input.required<number>();  // Signal reattivo per l'importo consentito

  percentage = computed(() => { // Calcola la percentuale di utilizzo dell'importo consentito

    const requested = this.requestedAmount();  // Ottiene il valore corrente dell'importo richiesto
    const allowed = this.allowedAmount();  // Ottiene il valore corrente dell'importo consentito

    if (!allowed) {  // Se l'importo consentito è 0, restituisce 0 per evitare divisioni per zero.
      return 0;
    }

    return Math.min(
      (requested / allowed) * 100,
      100
    );

  });


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
