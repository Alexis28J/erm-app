import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from '@angular/common';
import { TotalProgressBar } from '../../../shared/total-progress-bar/total-progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExpenseEditor } from '../../../shared/expense-editor/expense-editor';
import { RequestDetailsCard } from '../../../shared/request-details-card/request-details-card';
import { NewRequestFacade } from '../../../core/services/facades/new-request.facade';
import { RequestFormFacade } from '../../../core/services/facades/request-form.facade';
import { Notification } from '../../../shared/notification-service/notification';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule,
    MatCardModule, MatIconModule, RouterLink,
    MatInputModule, CommonModule, TotalProgressBar,
    MatTooltipModule, ExpenseEditor, RequestDetailsCard],
  providers: [RequestFormFacade, NewRequestFacade],
  selector: 'app-new-request',
  styleUrls: ['./new-request.scss'],
  templateUrl: './new-request.html',
})

export class NewRequest {


  // INIEZIONE DEL FACADE PER LA CREAZIONE DI UNA NUOVA RICHIESTA
  newRequestFacade = inject(NewRequestFacade);


  // FACADE PROTETTO PER LA CREAZIONE DI UNA NUOVA RICHIESTA
  protected readonly newFacade = this.newRequestFacade.formFacade;


  // INIEZIONE DEL ROUTER E DEL SERVIZIO DI NOTIFICA
  private router = inject(Router);
  private notificationService = inject(Notification);


  // VARIABILE PER MEMORIZZARE EVENTUALI ERRORI DEL FORM
  formError = '';


  // METODO PER SALVARE LA RICHIESTA COME BOZZA (tramite il facade della nuova richiesta)
  saveDraft(): void {

    this.formError = '';

    this.newRequestFacade.saveDraft()
      .subscribe({

        next: () => {

          this.notificationService.success(
            'Request saved as draft sucessfully'
          );

          this.router.navigate([
            '/employee/dashboard'
          ]);
        },
        error: error => {
          this.formError = error.message;
        }
      });
  }


  // METODO PER INVIARE LA RICHIESTA (tramite il facade della nuova richiesta)
  submitRequest(): void {

    this.formError = '';

    this.newRequestFacade.submitRequest()
      .subscribe({

        next: () => {
          this.notificationService.success(
            'Request submitted successfully'
          );

          this.router.navigate([
            '/employee/dashboard'
          ]);
        },
        error: error => {
          this.formError = error.message;
        }
      });
  }

}



// VS Code Counter: 67 code lines (17/11/2026)