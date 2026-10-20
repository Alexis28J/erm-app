import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../../core/services/user.service';
import { RefundRequestService } from '../../../../core/services/refund-request.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';

@Component({
  imports: [CommonModule, MatCardModule, MatIconModule],
  selector: 'app-employee-statistics',
  styleUrl: './employee-statistics.scss',
  templateUrl: './employee-statistics.html',
})
export class EmployeeStatistics {

  private route = inject(ActivatedRoute)
  private userService = inject(UserService)
  private requestService = inject(RefundRequestService);


  // SIGNAL PER L'ID DELL'IMPIEGATO 
  employeeID = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') ?? '')
    ),
    {
      initialValue: ''
    }
  );


  // SIGNAL PER I DETTAGLI DELL'IMPIEGATO
  employee = toSignal(
    this.route.paramMap.pipe(
      switchMap(params =>
        this.userService.getUserById(params.get('id')!)
      )
    ),
    {
      initialValue: undefined
    }
  );


  // SIGNAL PER LE RICHIESTE DI RIMBORSO DELL'IMPIEGATO (WRITABLE SIGNAL) (NON FILTRATE)
  requests = signal<RefundRequestService[]>([]);


  // SIGNAL PER LE RICHIESTE DI RIMBORSO DELL'IMPIEGATO  (READ-ONLY SIGNAL)
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


  // COMPUTED PER IL NUMERO TOTALE DI RICHIESTE
  totalRequests = computed(
    () => this.requestsResource().filter(
      r => r.status !== 'DRAFT'
    ).length
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE APPROVATE
  approvedRequests = computed(
    () => this.requestsResource().filter(
      r => r.status === 'APPROVED'
    ).length
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE RIFIUTATE
  rejectedRequests = computed(
    () => this.requestsResource().filter(
      r => r.status === 'REJECTED'
    ).length
  );


  // COMPUTED PER IL NUMERO DI RICHIESTE IN ATTESA
  pendingRequests = computed(
    () => this.requestsResource().filter(
      r => r.status === 'PENDING' ||
        r.status === 'IN_PROGRESS'
    ).length
  );


  // COMPUTED PER L'IMPORTO TOTALE RICHIESTO (SOMMA DI TUTTE LE RICHIESTE NON IN BOZZA)
  totalRequestedAmount = computed(
    () => this.requestsResource().filter(
      r => r.status !== 'DRAFT'
    ).reduce(
      (sum, request) => sum + request.totalRequestedAmount,
      0
    )
  );


  // COMPUTED PER L'IMPORTO TOTALE APPROVATO (SOMMA DI TUTTE LE RICHIESTE APPROVATE)
  totalApprovedAmount = computed(
    () => this.requestsResource().reduce(
      (sum, request) => sum + (request.totalApprovedAmount ?? 0),
      0
    )
  );

}



// VS Code Counter: 88 code lines (20/10/2026)