# COMMENTI

## 17/11/2026

Ho creato 3 facade: EditRequestFacade, NewRequestFacade e RequestFormFacade.

- RequestFormFacade contiene tutto il codice condiviso tra i componenti new-request ed edit-request come la gestione delle spese, degli allegati e la validazione del modulo.

- EditRequestFacade contiene la logica specifica per la modifica di una richiesta esistente.

- NewRequestFacade contiene la logica specifica per la creazione di una nuova richiesta.


```TYPESCRIPT
import { Component, inject } from '@angular/core';
import { EditRequestFacade } from '../../../core/services/facades/edit-request.facade';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TotalProgressBar } from '../../../shared/total-progress-bar/total-progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExpenseEditor } from '../../../shared/expense-editor/expense-editor';
import { RequestDetailsCard } from '../../../shared/request-details-card/request-details-card';
import { RequestFormFacade } from '../../../core/services/facades/request-form.facade';

@Component({
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule,
    MatSelectModule, MatIconModule, RouterLink,
    CommonModule, TotalProgressBar, MatTooltipModule,
    ExpenseEditor, RequestDetailsCard],
  providers: [RequestFormFacade, EditRequestFacade],
  selector: 'app-edit-request',
  styleUrls: ['./edit-request.scss'],
  templateUrl: './edit-request.html',
})

// I providers servono a rendere disponibili i servizi specificati all'interno del componente. In questo caso, EditRequestFacade viene fornito come provider locale al componente.
// Qual'è la differenza con imports
// I moduli specificati in imports servono a rendere disponibili le direttive, i componenti e i servizi forniti dai moduli importati all'interno del template del componente.
// I providers servono a rendere disponibili i servizi specificati all'interno del componente stesso, indipendentemente dai moduli importati.


export class EditRequest {

  // VARIABILE PER MEMORIZZARE EVENTUALI ERRORI DEL FORM
  formError = '';


  // INIEZIONE DEL FACADE PER LA MODIFICA DELLA RICHIESTA
  editRequestFacade = inject(EditRequestFacade);


  // FACADE PROTETTO PER LA MODIFICA DELLA RICHIESTA
  protected readonly editFacade = this.editRequestFacade.formFacade;

 // La proprietà protected indica che la proprietà è accessibile solo all'interno della classe e delle sue sottoclassi.
}
```