import { Component, input, output } from '@angular/core';
import { FormArray, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProgressBar } from '../../progress-bar/progress-bar/progress-bar';
import { AttachmentList } from '../../attachment-list/attachment-list/attachment-list'; 

@Component({
  imports: [ReactiveFormsModule, MatCardModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, 
    MatSelectModule, MatIconModule, MatTooltipModule, 
    ProgressBar, AttachmentList],
  selector: 'app-expense-editor',
  styleUrls: ['./expense-editor.scss'],
  templateUrl: './expense-editor.html',
})
export class ExpenseEditor {

  // Questo componente rappresenta un editor di spese, che permette di visualizzare, aggiungere e rimuovere spese all'interno di un modulo reattivo.
  // Dal componente edit-request, questo componente riceve il modulo principale delle spese e le informazioni sulle spese stesse.



  // Il metodo input viene utilizzato per dichiarare le proprietà che riceveranno valori dall'esterno del componente
  // Il metodo output viene utilizzato per dichiarare gli eventi che il componente può emettere verso l'esterno


  form = input.required<FormGroup>();  // () indica che si sta chiamando il metodo required con il tipo FormGroup
  // In questo modo il componente può ricevere un oggetto FormGroup dall'esterno, che rappresenta il modulo principale delle spese.

  expenses = input.required<FormArray>();  // () indica che si sta chiamando il metodo required con il tipo FormArray
  // Cioè si sta dichiarando una proprietà chiamata expenses che riceverà un valore di tipo FormArray dall'esterno del componente


  get expenseGroups(): FormGroup[] {
    return this.expenses()
    .controls as FormGroup[];
  }

  
  expenseProgressData = input.required<any[]>();  // () indica che si sta chiamando il metodo required con il tipo any[]
  // any[] indica che si tratta di un array di elementi di tipo any cioè di qualsiasi tipo
  // Cioè si sta dichiarando una proprietà chiamata expenseProgressData che riceverà un valore di tipo any[] dall'esterno del componente

  addExpense = output<void>();  // () indica che si sta chiamando il metodo output con il tipo void
  // Cioè si sta dichiarando un evento chiamato addExpense che il componente può emettere verso l'esterno senza passare alcun valore (void)

  removeExpense = output<number>();  // () indica che si sta chiamando il metodo output con il tipo number
  // Cioè si sta dichiarando un evento chiamato removeExpense che il componente può emettere verso l'esterno passando un valore di tipo number
  

  filesSelected = output<{
    event: Event;
    index: number;
  }>();  // () indica che si sta chiamando il metodo output con il tipo specificato
  // Quindi quando il componente emette l'evento fileSelected, passerà un oggetto contenente sia l'evento di tipo Event che l'indice di tipo number
  // In questo modo il componente può comunicare all'esterno quale file è stato selezionato e a quale indice corrisponde nell'elenco delle spese


  removeAttachment = output<{
    expenseIndex: number;
    attachmentIndex: number;
  }>();  // () indica che si sta chiamando il metodo output con il tipo specificato
  // Cioè si sta dichiarando un evento chiamato removeAttachment che il componente può emettere verso l'esterno passando un oggetto contenente l'indice della spesa e l'indice dell'allegato da rimuovere
  // In questo modo il componente può comunicare all'esterno quale allegato deve essere rimosso e a quale spesa appartiene
}
