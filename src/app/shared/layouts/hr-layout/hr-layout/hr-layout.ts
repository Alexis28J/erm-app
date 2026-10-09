import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HrNavbar } from '../../hr-navbar/hr-navbar/hr-navbar';

@Component({
  imports: [RouterOutlet, HrNavbar],
  selector: 'app-hr-layout',
  styleUrls: ['./hr-layout.scss'],
  templateUrl: './hr-layout.html',
})
export class HrLayout {}


///////////////////////////////////////////////////////////////////////////////////////

// COMMENTI:

// Questo componente definisce il layout per le pagine dell'hr, includendo la navbar 
// e il router outlet.

///////////////////////////////////////////////////////////////////////////////////////



// VS Code Counter: 10 code lines (08/10/2026)