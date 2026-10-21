import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RefundRequest } from '../../../../core/interfaces/refund-request';
import { RouterLink } from '@angular/router';


@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  selector: 'app-review-actions',
  styleUrls: ['./review-actions.scss'],
  templateUrl: './review-actions.html',
})
export class ReviewActions {

  // INPUTS 

  request = input.required<RefundRequest>();

  reviewMode = input.required<boolean>();


  // OUTPUTS 

  approve = output<void>();

  reject = output<void>();

  startReview = output<void>();

  exitReview = output<void>();

}



// VS Code Counter: 20 code lines (21/10/2026)