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

  // Con gli @Input() NORMALI non puoi usare direttamente computed() perché category e amount non sono signal.
  // @Input({ required: true })
  // category!: string;

  // @Input({ required: true })
  // amount!: number;

  // Quindi uso dei signal con input.required():
  category = input.required<string>();  // A differenza dell'Input normale che non è reattivo e che serve solo per il binding iniziale, 
  // questo è un signal reattivo che ci permette di reagire ai cambiamenti del valore.
  amount = input.required<number>();
    // Quindi input.required<string>() crea un signal reattivo di tipo string per la categoria e input.required<number>() crea un signal reattivo di tipo number per l'importo.


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

    return max ? Math.min(  // Math.min è un metodo che restituisce il valore minimo tra i numeri passati come argomenti. In questo caso, serve a garantire che la percentuale non superi il 100%.
      (amount / max) * 100,  // Calcola la percentuale di utilizzo dell'importo massimo.
      100   // Limita la percentuale massima al 100%
    ) : 0;  // Se max è 0, restituisce 0 per evitare divisioni per zero.
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
