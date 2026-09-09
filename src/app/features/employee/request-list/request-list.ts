import { Component, effect, inject } from '@angular/core';
import { User } from '../../../core/interfaces/user';
import { RefundRequest } from '../../../core/interfaces/refund-request';
import { AuthService } from '../../../core/services/auth.service';
import { RefundRequestService } from '../../../core/services/refund-request.service';
import { MatCardModule } from "@angular/material/card";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatAnchor } from "@angular/material/button";
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from "@angular/material/menu";
import { ConfirmDelete } from '../../../shared/dialogs/confirm-delete/confirm-delete';

@Component({
  imports: [MatCardModule, MatTableModule, CommonModule, MatAnchor,
    MatIconModule, MatButtonModule, RouterLink, MatDialogModule, MatMenuModule],
  selector: 'app-request-list',
  styleUrls: ['./request-list.scss'],
  templateUrl: './request-list.html',
})
export class RequestList {

  // COSTRUTTORE DEL COMPONENTE CHE INIZIALIZZA LA TABELLA DELLE RICHIESTE DI RIMBORSO
  constructor() {

    // EFFETTO CHE AGGIORNA LA TABELLA QUANDO LE RICHIESTE CAMBIANO
    effect(() => {

      this.dataSource.data =
        this.requests();

    });

  }


  // INIEZIONE DEI SERVIZI
  private authService = inject(AuthService);
  private refundRequestService = inject(RefundRequestService);
  private router = inject(Router);
  private dialog = inject(MatDialog);


  // UTENTE CORRENTE E RICHIESTE DI RIMBORSO
  currentUser: User = this.authService.getCurrentUser()!;


  // RICHIESTE DI RIMBORSO DELL'UTENTE CORRENTE
  requests = toSignal(
    this.refundRequestService
      .getRequestsByUserId(this.currentUser.id),
    {
      initialValue: []
    }
  )


  // COLONNE DELLA TABELLA
  displayedColumns: string[] = [
    'referenceMonth',
    'creationDate',
    'status',
    'totalRequestedAmount',
    'totalApprovedAmount',
    'actions'
  ];


  // FONTE DATI PER LA TABELLA DELLE RICHIESTE DI RIMBORSO
  dataSource = new MatTableDataSource<RefundRequest>()


  // METODO PER VISUALIZZARE I DETTAGLI DI UNA RICHIESTA DI RIMBORSO
  viewDetails(requestId: string): void {
    this.router.navigate([
      '/employee/request-details',
      requestId
    ]);

  }


  // METODO PER ELIMINARE UNA RICHIESTA DI RIMBORSO (BOZZA)
  deleteRequest(requestId: string): void {

    const dialogRef = this.dialog.open(
      ConfirmDelete,
      {
        width: '400px'
      }
    );

    dialogRef.afterClosed().subscribe(
      confirmed => {
        if (!confirmed) {
          return;
        }

        this.refundRequestService
          .deleteRequest(requestId)
          .subscribe({
            next: () => {
              this.loadRequests();
            },
            error: (err) => {
              console.error(
                'Error during request deletion:',
                err
              );
            }
          })
      }
    )

  }


  // METODO PER CARICARE LE RICHIESTE DI RIMBORSO DELL'UTENTE CORRENTE
  loadRequests(): void {

    const currentUser =
      this.authService.getCurrentUser();

    if (!currentUser) {
      return;
    }

    this.refundRequestService
      .getRequestsByUserId(currentUser.id)
      .subscribe({

        next: (requests) => {
          this.dataSource.data = requests;
        }

      });

  }

}


