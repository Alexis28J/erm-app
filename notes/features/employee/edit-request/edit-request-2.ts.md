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

  // COSTRUTTORE DEL COMPONENTE CHE INIZIALIZZA IL FACADE CON I DATI DELLA RICHIESTA
  constructor() {

    // Perché usare route.snapshot.data['request'] se il resolver ha già caricato la richiesta dal backend?
    // Perché il resolver assicura che la richiesta sia disponibile prima che il componente venga caricato,
    // e route.snapshot.data['request'] permette di accedere a questa richiesta caricata dal resolver.

    // NON è la stessa cosa. Il resolver garantisce che i dati siano PRONTI prima del caricamento del componente,
    // mentre route.snapshot.data['request'] è semplicemente il modo per ACCEDERE a quei dati già pronti.

    const request = this.route.snapshot.data['request'] as RefundRequest;   
    // Recupero i dati della richiesta dalla rotta risolta dal resolver
    // Le richieste vengono risolte (cioè recuperate) dal resolver prima che il componente venga inizializzato e il resolver, a sua volta, utilizza il servizio per ottenere i dati della richiesta dal backend prima che il componente venga creato
    

    // Perché usare il metodo initialize del facade?
    // Perché il facade gestisce lo stato del form e popola i campi con i dati della richiesta caricata dal resolver.
    this.editRequestFacade.initialize(request);
    // Inizializzo il facade della modifica della richiesta (EditRequestFacade) con i dati recuperati.
    // Una volta inizializzato il facade, il componente può utilizzare i metodi del facade per gestire la richiesta

  }


  // INIEZIONE DEL FACADE PER LA MODIFICA DELLA RICHIESTA
  editRequestFacade = inject(EditRequestFacade);


  // FACADE PROTETTO PER LA MODIFICA DELLA RICHIESTA
  protected readonly editFacade = this.editRequestFacade.formFacade;

 // La proprietà protected indica che la proprietà è accessibile solo all'interno della classe e delle sue sottoclassi.


 // INIEZIONE DEL ROUTER, DELLA ROUTE ATTIVA E DEL SERVIZIO DI NOTIFICA
  private route = inject(ActivatedRoute);  // Inietto la rotta attiva per accedere ai dati risolti dal resolver
  private router = inject(Router);  // Inietto il router per navigare tra le pagine
  private notificationService = inject(Notification);  // Inietto il servizio di notifica per mostrare messaggi all'utente

  
 // VARIABILE PER MEMORIZZARE EVENTUALI ERRORI DEL FORM
  formError = '';


    // METODO PER SALVARE LA RICHIESTA COME BOZZA (tramite il facade della modifica della richiesta)
  saveDraft(): void {

    this.formError = '';

    this.editRequestFacade.saveDraft()
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Request saved as draft successfully'
          );

          this.router.navigate([
            '/employee/request-list'
          ]);
        },

        error: error => {
          this.formError = error.message;
        }
      });
  }


  // METODO PER INVIARE LA RICHIESTA (tramite il facade della modifica della richiesta)
  submitRequest(): void {

    this.formError = '';

    this.editRequestFacade.submitRequest()
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Request submitted sucessfully'
          );

          this.router.navigate([
            '/employee/request-list'
          ]);
        },
        error: error => {
          this.formError = error.message;
        }
      });
  }
  
}
```