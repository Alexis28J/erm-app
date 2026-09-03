import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { UserRole } from '../interfaces/enum';

export const roleGuard: CanActivateFn = (route) => {   
  
const authService = inject(AuthService);

const router = inject(Router);

const currentUser = authService.getCurrentUser();

const expectedRole = route.data?.['role'];  


// CONTROLO SE L'UTENTE CORRENTE È LOGGATO
if (!currentUser) {
  return router.createUrlTree(['/login']);
}


// CONTROLO SE L'UTENTE CORRENTE HA IL RUOLO ATTESO PER ACCEDERE ALLA ROUTE
if (currentUser && currentUser.role === expectedRole) {
  return true;
}


// CONTROLLO SE L'UTENTE CORRENTE È UN HR
if (currentUser.role === UserRole.HR) {
  return router.createUrlTree(['/hr/dashboard']);
}


// ALTRIMENTI REDIREZIONO ALLA DASHBOARD DELL'EMPLOYEE
return router.createUrlTree(['/employee/dashboard']);


};




