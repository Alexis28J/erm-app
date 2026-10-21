import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RefundRequest } from '../../../../core/interfaces/refund-request';

@Component({
  imports: [CommonModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatLabel, ReactiveFormsModule],
  selector: 'app-hr-notes',
  styleUrls: ['./hr-notes.scss'],
  templateUrl: './hr-notes.html',
})
export class HrNotes {

  // INPUTS
  form = input.required<FormGroup>();

  reviewMode = input.required<boolean>();

  request = input.required<RefundRequest>();

}



// VS Code Counter: 19 code lines (21/10/2026)