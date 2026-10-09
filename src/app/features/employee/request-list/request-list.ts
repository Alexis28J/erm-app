import { ChangeDetectorRef, Component, effect, inject, ViewChild } from '@angular/core';
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
import { ConfirmAction } from '../../../shared/dialogs/confirm-action/confirm-action';
import { Notification } from '../../../shared/notification-service/notification';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  imports: [MatCardModule, MatTableModule, CommonModule,
    MatAnchor, MatIconModule, MatButtonModule,
    RouterLink, MatDialogModule, MatMenuModule,
    MatProgressSpinnerModule, MatSortModule,
    MatPaginatorModule],
  selector: 'app-request-list',
  styleUrls: ['./request-list.scss'],
  templateUrl: './request-list.html',
})
export class RequestList {

  constructor() {

    // UNICO EFFETTO PER GESTIRE DATI E COLLEGAMENTI
    effect(() => {

      const currentRequests = this.requests();

      // 1. Aggiorno i dati 
      this.dataSource.data = currentRequests;

      // 2. Se non ci sono i dati ci fermiamo
      if (!currentRequests || currentRequests.length === 0) return;

      // 3. Forzo Angular a renderizzare il DOM della tabella 
      this.cdr.detectChanges();

      // 4. Configura il sortingDataAccessor se non è già stato fatto
      if (!this.dataSource.sortingDataAccessor) {
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case "referenceMonth": return item.referenceMonth;
            case "creationDate": return new Date(item.creationDate).getTime();
            case "totalRequestedAmount": return item.totalRequestedAmount;
            case "totalApprovedAmount": return item.totalApprovedAmount ?? 0;
            default: return item[property as keyof RefundRequest] as any;
          }
        };
      }

      // 5. Collego Sort e Paginator se presenti nel DOM (cioè se i componenti sono stati renderizzati)
      if (this.sortComponent && !this.dataSource.sort) {
        this.dataSource.sort = this.sortComponent;

        // Imposta l'ordinamento iniziale sul componente visivo
        this.sortComponent.active = 'creationDate';
        this.sortComponent.direction = 'desc';
      }

      if (this.paginatorComponent && !this.dataSource.paginator) {
        this.dataSource.paginator = this.paginatorComponent;
      }

      // 6. Forza l'ordinamento iniziale sui dati effettivi
      if (this.dataSource.sort) {
        this.dataSource.sort.sort({ id: 'creationDate', start: 'desc', disableClear: false });
      }

    });

  }


  // RIFERIMENTI AI COMPONENTI DI ORDINAMENTO E PAGINAZIONE DELLA TABELLA 
  @ViewChild(MatSort) sortComponent!: MatSort;
  @ViewChild(MatPaginator) paginatorComponent!: MatPaginator;


  // FONTE DATI PER LA TABELLA DELLE RICHIESTE DI RIMBORSO
  dataSource = new MatTableDataSource<RefundRequest>()


  // INIEZIONE DEI SERVIZI
  private authService = inject(AuthService);
  private refundRequestService = inject(RefundRequestService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private notificationService = inject(Notification);
  private cdr = inject(ChangeDetectorRef);


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
      ConfirmAction,
      {
        autoFocus: false,
        data: {
          title: 'Delete Request',
          message: 'Are you sure you want to delete this request?'
        },
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
              this.notificationService.success('Request deleted successfully');
              this.loadRequests();
            },

            error: (err) => {
              this.notificationService.error('Error during request deletion');
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


  // COLONNE DELLA TABELLA
  displayedColumns: string[] = [
    'referenceMonth',
    'creationDate',
    'status',
    'totalRequestedAmount',
    'totalApprovedAmount',
    'actions'
  ];

}



// VS Code Counter: 143 code lines (08/10/2026)