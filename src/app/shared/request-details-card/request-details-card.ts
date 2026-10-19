import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { DatePipe } from '@angular/common';

import { RefundRequest } from '../../core/interfaces/refund-request';

@Component({
  selector: 'app-request-details-card',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './request-details-card.html',
  styleUrls: ['./request-details-card.scss']
})
export class RequestDetailsCard {

  form = input.required<FormGroup>();

  request = input<RefundRequest | null>(null);

}



// VS Code Counter: 27 code lines (19/10/2026)