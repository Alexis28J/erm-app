import { ResolveFn } from '@angular/router';
import { RefundRequest } from '../core/interfaces/refund-request';
import { inject } from '@angular/core';
import { RefundRequestService } from '../core/services/refund-request.service';

export const requestResolver: ResolveFn<RefundRequest> = (route) => {

  const refundRequestService = inject(RefundRequestService);

  const id = route.paramMap.get('id');

  if (!id) {
    throw new Error('Request id not found');
  }

  return refundRequestService.getRequestById(id);

};



// VS Code Counter: 12 code lines (20/11/2026)


