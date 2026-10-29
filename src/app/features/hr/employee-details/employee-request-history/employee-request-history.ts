import { afterNextRender, Component, effect, ElementRef, signal, viewChild, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { RefundRequestService } from '../../../../core/services/refund-request.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { RefundRequest } from '../../../../core/interfaces/refund-request';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { ExcelExportService } from '../../../../core/services/excel-export.service';
import { FocusService } from '../../../../shared/focus-service/focus.service';

@Component({
  imports: [CommonModule, MatCardModule, MatTableModule,
    MatSortModule, MatPaginatorModule, MatIconModule, MatButtonModule, RouterLink],
  selector: 'app-employee-request-history',
  styleUrls: ['./employee-request-history.scss'],
  templateUrl: './employee-request-history.html',
})
export class EmployeeRequestHistory {

  constructor() {

    // AFTER NEXT RENDER PER IMPOSTARE IL FOCUS SULLA CARD PRINCIPALE CUSTOM
    afterNextRender(() => {
      this.focusService.setCustomTarget(this.focusCard());
    })


    // EFFECT PER AGGIORNARE I DATI DELLA TABELLA QUANDO LE RICHIESTE CAMBIANO
    effect(() => {

      // Ottiene le richieste correnti dal resource signal
      const currentRequests = this.requestsResource();


      // Esclude le richieste con stato "DRAFT" e aggiorna il signal this.requests
      this.requests.set(
        currentRequests.filter(
          r => r.status !== "DRAFT"
        )
      );


      // Aggiorna il dataSource della tabella con le richieste filtrate
      this.dataSource.data = this.requests();


      // Se non ci sono richieste filtrate, esce dall'effetto per evitare ulteriori operazioni
      if (!this.requests() || this.requests().length === 0) return;


      // Forza il rilevamento delle modifiche per aggiornare la vista con i nuovi dati della tabella
      this.cdr.detectChanges();


      // Imposta l'accessor per l'ordinamento dei dati nella tabella se non è già stato impostato
      if (!this.dataSource.sortingDataAccessor) {
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case "referenceMonth": return item.referenceMonth;
            case "creationDate": return new Date(item.creationDate).getTime();
            case "status": return item.status;
            case "totalRequestedAmount": return item.totalRequestedAmount;
            case "totalApprovedAmount": return item.totalApprovedAmount ?? 0;
            default: return item[property as keyof RefundRequest] as any;
          }
        }
      }


      // Imposta il componente di ordinamento della tabella se non è già stato impostato
      if (this.sortComponent && !this.dataSource.sort) {
        this.dataSource.sort = this.sortComponent;

        this.sortComponent.active = "creationDate";
        this.sortComponent.direction = "desc";
      }


      // Imposta il componente di paginazione della tabella se non è già stato impostato
      if (this.paginatorComponent && !this.dataSource.paginator) {
        this.dataSource.paginator = this.paginatorComponent;
      }


      // Applica l'ordinamento iniziale della tabella se il componente di ordinamento è presente
      if (this.dataSource.sort) {
        this.dataSource.sort.sort({ id: "creationDate", start: "desc", disableClear: false });
      }

    });

  }

  // INIEZIONE DELLE DIPENDENZE
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private requestService = inject(RefundRequestService);
  private cdr = inject(ChangeDetectorRef);
  private excelExportService = inject(ExcelExportService);
  private focusService = inject(FocusService);
  private focusCard = viewChild.required<ElementRef<HTMLElement>>('focusCard');



  // REFERENZE AI COMPONENTI DELLA TABELLA (SORT E PAGINATOR)
  @ViewChild(MatSort) sortComponent!: MatSort;
  @ViewChild(MatPaginator) paginatorComponent!: MatPaginator;


  // DATASOURCE PER LA TABELLA DELLE RICHIESTE
  dataSource = new MatTableDataSource<RefundRequest>();


  // SIGNAL PER LE RICHIESTE DI RIMBORSO DELL'IMPIEGATO (WRITABLE SIGNAL) (NON FILTRATE)
  requests = signal<RefundRequest[]>([]);


  // SIGNAL PER LE RICHIESTE DI RIMBORSO DELL'IMPIEGATO (READ-ONLY SIGNAL)
  requestsResource = toSignal(
    this.route.paramMap.pipe(
      switchMap(params =>
        this.requestService.getRequestsByUserId(params.get('id')!)
          .pipe(catchError(error => {
            console.error(error);
            return of([]);
          }))
      )
    ),
    {
      initialValue: []
    }
  );

  
  // COLONNE DA VISUALIZZARE NELLA TABELLA DELLE RICHIESTE
  displayedColumns = [
    'referenceMonth',
    'creationDate',
    'status',
    'totalRequestedAmount',
    'totalApprovedAmount',
    'actions'
  ]


  // SEGNALE PER MEMORIZZARE GLI UTENTI
  users = toSignal(
    this.userService.getUsers(),
    {
      initialValue: []
    }
  )


  // METODO PER ESPORTARE LE RICHIESTE DI RIMBORSO IN UN FILE EXCEL
  exportRequests(): void {

    this.excelExportService
      .exportRequests(
        this.requests(),
        this.users()
      );

  }

}



// VS Code Counter: 114 code lines (29/10/2026)