import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormArray, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProgressBar } from '../progress-bar/progress-bar';
import { AttachmentList } from '../attachment-list/attachment-list';
import { ExpenseLimit } from '../../core/interfaces/expense-limit';
import { FocusService } from '../focus-service/focus.service';

@Component({
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatIconModule, MatTooltipModule, ProgressBar,
    AttachmentList],
  selector: 'app-expense-editor',
  styleUrls: ['./expense-editor.scss'],
  templateUrl: './expense-editor.html',
})
export class ExpenseEditor {

  // INIZIALIZZAZIONE DEL COMPONENTE E DEL FOCUS DELLA CARD
  constructor() {

    effect(() => {
      
      const card = this.focusCard();

      if (card && card.nativeElement) {  
        this.focusService.setCustomTarget(card);  
      }
    })

  }

  // INIEZIONE DEL SERVIZIO DI FOCUS
  private focusService = inject(FocusService);


  // VIEWCHILD PER IL RIFERIMENTO ALLA CARD DA FOCUSSARE
  private focusCard = viewChild<ElementRef<HTMLElement>>('focusCard')


  // INPUTS
  form = input.required<FormGroup>();
  expenses = input.required<FormArray>();
  expenseProgressData = input.required<any[]>();
  expenseCategories = input.required<ExpenseLimit[]>();


  // GETTER PER I GRUPPI DI SPESE
  get expenseGroups(): FormGroup[] {
    return this.expenses()
      .controls as FormGroup[];
  }


  // OUTPUTS
  addExpense = output<void>();
  removeExpense = output<number>();


  // OUTPUT PER I FILE SELEZIONATI
  filesSelected = output<{
    event: Event;
    index: number;
  }>();


  // OUTPUT PER LA RIMOZIONE DEGLI ALLEGATI
  removeAttachment = output<{
    expenseIndex: number;
    attachmentIndex: number;
  }>();


  // METODO PER OTTENERE L'IMPORTO MASSIMO PER UNA CATEGORIA SPECIFICA
  getMaxAmount(categoryName: string): number {

    return this.expenseCategories()
      .find(
        c => c.name === categoryName
      )?.maxAmount ?? 0;

  }


}



// VS Code Counter: 58 code lines (29/10/2016)

