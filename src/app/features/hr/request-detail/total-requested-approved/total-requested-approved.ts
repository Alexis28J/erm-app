import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TotalProgressBar } from '../../../../shared/total-progress-bar/total-progress-bar';

@Component({
  imports: [CommonModule, MatCardModule, MatIconModule, TotalProgressBar],
  selector: 'app-total-requested-approved',
  styleUrls: ['./total-requested-approved.scss'],
  templateUrl: './total-requested-approved.html',
})
export class TotalRequestedApproved {

  // INPUTS

  requestedAmount = input.required<number>();

  allowedAmount = input.required<number>();

  approvedAmount = input.required<number>();

}



// VS Code Counter: 16 code lines (21/10/2026)

