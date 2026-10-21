import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  imports: [MatCardModule, CommonModule, MatIconModule],
  selector: 'app-employee-note',
  styleUrls: ['./employee-note.scss'],
  templateUrl: './employee-note.html',
})
export class EmployeeNote {

  // INPUT PER LA NOTA DEL DIPENDENTE
  note = input('');

}



// VS Code Counter: 13 code lines (21/10/2026)
