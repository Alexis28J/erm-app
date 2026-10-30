import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  imports: [CommonModule, MatCardModule, MatInputModule,
    MatButtonModule, MatIconModule, RouterLink, MatTooltipModule],
  selector: 'app-hr-settings',
  styleUrls: ['./hr-settings.scss'],
  templateUrl: './hr-settings.html',
})
export class HrSettings { }



// VS Code counter: 16 code lines (14/10/2026)