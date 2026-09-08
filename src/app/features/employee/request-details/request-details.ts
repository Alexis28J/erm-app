import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RefundRequestService } from '../../../core/services/refund-request.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RefundRequest } from '../../../core/interfaces/refund-request';
import { MatCardModule } from '@angular/material/card';


@Component({
  imports: [CommonModule, MatCardModule],
  selector: 'app-request-details',
  styleUrls: ['./request-details.scss'],
  templateUrl: './request-details.html',
})
export class RequestDetails {

  // INIEZIONE DEI SERVIZI E RECUPERO DELL'ID DELLA RICHIESTA DI RIMBORSO
  private route = inject(ActivatedRoute);
  private refundRequestService = inject(RefundRequestService);


  // RECUPERO DELL'ID DELLA RICHIESTA DI RIMBORSO
  private requestId = this.route.snapshot.paramMap.get('id');

  
  // CONVERSIONE DELL'OBSERVABLE IN SIGNAL
  request = toSignal<RefundRequest | null>(
    this.refundRequestService
      .getRequestById(this.requestId!),
    {
      initialValue: null
    }
  );

}


