import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { UserRole } from './core/interfaces/enum';
import { EmployeeLayout } from './shared/layouts/employee-layout/employee-layout/employee-layout';
import { HrLayout } from './shared/layouts/hr-layout/hr-layout/hr-layout';

export const routes: Routes = [

    {
        path: '',
        component: Home
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/login/login/login')
                .then(m => m.Login)
    },
    {
        path: 'reset-password',
        loadComponent: () =>
            import('./features/login/reset-password/reset-password/reset-password')
                .then(c => c.ResetPassword)
    },
    {  // AREA DIPENDENTE
        path: 'employee',
        component: EmployeeLayout,
        canActivate: [authGuard, roleGuard],
        data: {
            role: UserRole.EMPLOYEE
        },
        children: [

            {
                path: 'dashboard',
                loadComponent: () =>
                    import(
                        './features/employee/employee-dashboard/employee-dashboard'
                    ).then(m => m.EmployeeDashboard)
            },

            {
                path: 'request-list',
                loadComponent: () =>
                    import(
                        './features/employee/request-list/request-list'
                    ).then(m => m.RequestList)
            },

            {
                path: 'request-details/:id',
                loadComponent: () =>
                    import(
                        './features/employee/request-details/request-details'
                    ).then(m => m.RequestDetails)
            },

            {
                path: 'edit-request/:id',
                loadComponent: () =>
                    import(
                        './features/employee/edit-request/edit-request'
                    ).then(m => m.EditRequest)
            },

            {
                path: 'new-request',
                loadComponent: () =>
                    import(
                        './features/employee/new-request/new-request'
                    ).then(m => m.NewRequest)
            }

        ]
    },
    {   // AREA HR
        path: 'hr',
        component: HrLayout,
        canActivate: [authGuard, roleGuard],
        data: {
            role: UserRole.HR
        },
        children: [

            {
                path: 'dashboard',
                loadComponent: () =>
                    import(
                        './features/hr/hr-dashboard/hr-dashboard'
                    ).then(m => m.HrDashboard)
            },

            {
                path: 'request-list',
                loadComponent: () =>
                    import(
                        './features/hr/request-list/request-list'
                    ).then(m => m.RequestList)
            },

            {
                path: 'request-details/:id',
                loadComponent: () =>
                    import(
                        './features/hr/request-detail/request-detail'
                    ).then(m => m.RequestDetail)
            },

            {
                path: 'employee-list',
                loadComponent: () =>
                    import(
                        './features/hr/employee-list/employee-list'
                    ).then(m => m.EmployeeList)
            },

            {
                path: 'employee-details/:id',
                loadComponent: () =>
                    import(
                        './features/hr/employee-details/employee-details'
                    ).then(m => m.EmployeeDetails)
            }

        ]
    },
    {
        path: '**',
        redirectTo: ''
    }

];



// VS Code Counter: 119 code lines (08/10/2026)