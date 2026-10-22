import { Component, input } from '@angular/core';
import { RefundRequest } from '../../../../core/interfaces/refund-request';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  imports: [MatCardModule, MatIconModule, CommonModule ],
  selector: 'app-request-info',
  styleUrls: ['./request-info.scss'],
  templateUrl: './request-info.html',
})
export class RequestInfo {

  // INPUTS

  request = input.required<RefundRequest>();  

  reviewMode = input(false);  

  requestData = input<any | null>(null);  

}



// VS Code Counter: 16 code lines (22/10/2026)