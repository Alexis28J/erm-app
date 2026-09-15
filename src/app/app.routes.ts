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
        path: 'employee/request-list',
        loadComponent: () =>
            import(
                './features/employee/request-list/request-list'
            ).then(m => m.RequestList)
    },
    {
        path: 'employee/request-details/:id',
        canActivate: [
            authGuard,
            roleGuard
        ],
        data: {
            role: UserRole.EMPLOYEE
        },
        loadComponent: () =>
            import(
                './features/employee/request-details/request-details'
            ).then(m => m.RequestDetails)
    },
    {
        path: 'employee/edit-request/:id',
        canActivate: [authGuard, roleGuard],
        data: {
            role: UserRole.EMPLOYEE
        },
        loadComponent: () =>
            import(
                './features/employee/edit-request/edit-request'
            ).then(m => m.EditRequest)
    },
    {
        path: 'employee/new-request',
        canActivate: [authGuard, roleGuard],
        data: {
            role: UserRole.EMPLOYEE
        },
        loadComponent: () =>
            import(
                './features/employee/new-request/new-request'
            ).then(m => m.NewRequest)
    },
    {
        path: 'hr/request-list',
        canActivate: [authGuard, roleGuard],
        data: {
            role: UserRole.HR
        },
        loadComponent: () =>
            import(
                './features/hr/request-list/request-list'
            ).then(m => m.RequestList)
    },
    {
        path: 'hr/request-details/:id',
        canActivate: [authGuard, roleGuard],
        data: {
            role: UserRole.HR
        },
        loadComponent: () =>
            import(
                './features/hr/request-detail/request-detail'
            ).then(m => m.RequestDetail)
    },
    {
        path: 'hr/employee-list',
        canActivate: [authGuard, roleGuard],
        data: {
            role: UserRole.HR
        },
        loadComponent: () =>
            import(
                './features/hr/employee-list/employee-list'
            ).then(m => m.EmployeeList)
    },
    {
        path: 'hr/employee-details/:id',
        canActivate: [authGuard, roleGuard],
        data: {
            role: UserRole.HR
        },
        loadComponent: () =>
            import(
                './features/hr/employee-details/employee-details'
            ).then(m => m.EmployeeDetails)
    },
    {
        path: '**',
        redirectTo: ''
    },

]; 
