import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeStatistics } from './employee-statistics/employee-statistics';
import { EmployeeRequestHistory } from './employee-request-history/employee-request-history';

@Component({
  imports: [CommonModule, MatCardModule, RouterLink,
    MatButtonModule, MatIconModule, EmployeeStatistics,
    EmployeeRequestHistory],
  selector: 'app-employee-details',
  styleUrls: ['./employee-details.scss'],
  templateUrl: './employee-details.html',
})
export class EmployeeDetails {

  // INIEZIONE DELLE DIPENDENZE
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);


  // SIGNAL PER L'ID DELL'IMPIEGATO
  employeeId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') ?? '')
    ),
    {
      initialValue: ''
    }
  );


  // SIGNAL PER I DETTAGLI DELL'IMPIEGATO
  employee = toSignal(
    this.route.paramMap.pipe(
      switchMap(params =>
        this.userService.getUserById(params.get('id')!)
      )
    ),
    {
      initialValue: undefined
    }
  );

}



// VS Code Counter: 41 code lines (20/10/2026)