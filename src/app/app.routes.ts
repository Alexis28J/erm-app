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
            import('./features/login/login')
                .then(m => m.Login)
    },
    {
        path: 'employee/dashboard',
        canActivate: [authGuard, roleGuard],
        data: {
            role: UserRole.EMPLOYEE
        },
        loadComponent: () =>
            import(
                './features/employee/employee-dashboard/employee-dashboard'
            ).then(
                m => m.EmployeeDashboard
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
    },

];
