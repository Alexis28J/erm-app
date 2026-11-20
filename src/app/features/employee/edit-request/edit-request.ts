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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TotalProgressBar } from '../../../shared/total-progress-bar/total-progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExpenseEditor } from '../../../shared/expense-editor/expense-editor';
import { RequestDetailsCard } from '../../../shared/request-details-card/request-details-card';
import { RequestFormFacade } from '../../../core/services/facades/request-form.facade';
import { Notification } from '../../../shared/notification-service/notification';
import { RefundRequest } from '../../../core/interfaces/refund-request';

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

export class EditRequest {

  // COSTRUTTORE DEL COMPONENTE CHE INIZIALIZZA IL FACADE CON I DATI DELLA RICHIESTA
  constructor() {

    const request = this.route.snapshot.data['request'] as RefundRequest;   
    
    this.editRequestFacade.initialize(request);

  }


  // INIEZIONE DEL FACADE PER LA MODIFICA DELLA RICHIESTA
  editRequestFacade = inject(EditRequestFacade);


  // FACADE PROTETTO PER LA MODIFICA DELLA RICHIESTA
  protected readonly editFacade = this.editRequestFacade.formFacade;


  // INIEZIONE DEL ROUTER, DELLA ROUTE ATTIVA E DEL SERVIZIO DI NOTIFICA
  private route = inject(ActivatedRoute);  
  private router = inject(Router);
  private notificationService = inject(Notification);


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



// VS Code Counter: 76 code lines (20/11/2026)