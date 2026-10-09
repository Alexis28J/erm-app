import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeNavbar } from '../../employee-navbar/employee-navbar/employee-navbar';

@Component({
  imports: [RouterOutlet, EmployeeNavbar],
  selector: 'app-employee-layout',
  styleUrls: ['./employee-layout.scss'],
  templateUrl: './employee-layout.html',
})
export class EmployeeLayout {}


////COMMENTI
////////////////////////////////////////////////////////

// Questo componente definisce il layout per le pagine dell'employee, includendo la navbar 
// e il router outlet.

///////////////////////////////////////////////////////


// VS Code Counter: 10 code lines (08/10/2026)