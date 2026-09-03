# COMMENTI

Ho configurato la rotta delle pagine `home` e `login`. 

```TYPESCRIPT
import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { UserRole } from './core/interfaces/enum';

export const routes: Routes = [

    {
        path: '',
        component: Home
    },

    {
        path: 'login',
        loadComponent: () => 
            import('./features/login/login').then(m => m.Login)

        // Perché loadComponent viene utilizzato qui invece di component?
        // loadComponent viene utilizzato per il lazy loading del componente (cioè, il componente viene caricato solo quando necessario), il che significa che il modulo del componente viene caricato solo quando l'utente naviga verso questa rotta.

        //m sta per "module", carica il componente Login in modo lazy. Posso usare un'altra lettera se voglio.
    },
    {
        path: 'employee/dashboard',
        canActivate: [ authGuard, roleGuard ],
        data: {
            role: UserRole.EMPLOYYE
        },
        loadComponent: () =>
            import(
                './features/employee/employee-dashboard/employee-dashboard'
            ).then(   // .then significa che una volta importato il modulo, esegue la funzione passata come argomento
                m => m.EmployeeDashboard  // restituisce il componente EmployeeDashboard una volta importato il modulo
            )
    },
    {
        path: 'hr/dashboard',
        canActivate: [authGuard, roleGuard],
        data: {
            role: UserRole.HR
        },
        loadComponent: () =>
            import(
                './features/hr/hr-dashboard/hr-dashboard'
            ).then(
                m => m.HrDashboard
            )
    },
    {
        path: '**',
        redirectTo: ''
    
        // Questa route cattura tutti i percorsi non definiti e reindirizza alla home
    }
    
];
```

# Cos'è il Lazy loading in Angular?
Il lazy loading in Angular è una tecnica di ottimizzazione che carica i moduli o i componenti solo quando l'utente li richiede e naviga verso una determinata rotta.


