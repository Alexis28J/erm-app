import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [
    RouterLink, MatButtonModule, MatToolbarModule,
    MatMenuModule, MatIconModule, MatCardModule, MatTooltipModule
  ],
  selector: 'app-home',
  styleUrls: ['./home.scss'],
  templateUrl: './home.html',
})
export class Home { }
