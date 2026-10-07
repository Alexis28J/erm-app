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
    // A differenza di altre aree, le rotte di login e reset-password non sono raggruppate sotto un layout comune e quindi vengono definite separatamente.
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

    // AREA EMPLOYEE
    // {
    //     path: 'employee/dashboard',
    //     canActivate: [authGuard, roleGuard],
    //     data: {
    //         role: UserRole.EMPLOYEE
    //     },
    //     loadComponent: () =>
    //         import(
    //             './features/employee/employee-dashboard/employee-dashboard'
    //         ).then(
    //             m => m.EmployeeDashboard
    //         )
    // },
    // {
    //     path: 'employee/request-list',
    //     loadComponent: () =>
    //         import(
    //             './features/employee/request-list/request-list'
    //         ).then(m => m.RequestList)
    // },
    // {
    //     path: 'employee/request-details/:id',
    //     canActivate: [
    //         authGuard,
    //         roleGuard
    //     ],
    //     data: {
    //         role: UserRole.EMPLOYEE
    //     },
    //     loadComponent: () =>
    //         import(
    //             './features/employee/request-details/request-details'
    //         ).then(m => m.RequestDetails)
    // },
    // {
    //     path: 'employee/edit-request/:id',
    //     canActivate: [authGuard, roleGuard],
    //     data: {
    //         role: UserRole.EMPLOYEE
    //     },
    //     loadComponent: () =>
    //         import(
    //             './features/employee/edit-request/edit-request'
    //         ).then(m => m.EditRequest)
    // },
    // {
    //     path: 'employee/new-request',
    //     canActivate: [authGuard, roleGuard],
    //     data: {
    //         role: UserRole.EMPLOYEE
    //     },
    //     loadComponent: () =>
    //         import(
    //             './features/employee/new-request/new-request'
    //         ).then(m => m.NewRequest)
    // },

    // REFACTORING AREA EMPLOYEE
    // Si può notare che tutte le rotte dell'area employee sono state raggruppate sotto un unico layout con path 'employee'
    // Questo è grazie al fatto che tutte le rotte figlie condividono lo stesso layout e le stesse regole di accesso.
    {
        path: 'employee',
        component: EmployeeLayout,
        canActivate: [authGuard, roleGuard],  // Protegge tutte le rotte figlie dell'area employee
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
    // AREA HR
    // {
    //     path: 'hr/dashboard',
    //     canActivate: [authGuard, roleGuard],
    //     data: {
    //         role: UserRole.HR
    //     },
    //     loadComponent: () =>
    //         import(
    //             './features/hr/hr-dashboard/hr-dashboard'
    //         ).then(
    //             m => m.HrDashboard
    //         )
    // },
    // {
    //     path: 'hr/request-list',
    //     canActivate: [authGuard, roleGuard],
    //     data: {
    //         role: UserRole.HR
    //     },
    //     loadComponent: () =>
    //         import(
    //             './features/hr/request-list/request-list'
    //         ).then(m => m.RequestList)
    // },
    // {
    //     path: 'hr/request-details/:id',
    //     canActivate: [authGuard, roleGuard],
    //     data: {
    //         role: UserRole.HR
    //     },
    //     loadComponent: () =>
    //         import(
    //             './features/hr/request-detail/request-detail'
    //         ).then(m => m.RequestDetail)
    // },
    // {
    //     path: 'hr/employee-list',
    //     canActivate: [authGuard, roleGuard],
    //     data: {
    //         role: UserRole.HR
    //     },
    //     loadComponent: () =>
    //         import(
    //             './features/hr/employee-list/employee-list'
    //         ).then(m => m.EmployeeList)
    // },
    // {
    //     path: 'hr/employee-details/:id',
    //     canActivate: [authGuard, roleGuard],
    //     data: {
    //         role: UserRole.HR
    //     },
    //     loadComponent: () =>
    //         import(
    //             './features/hr/employee-details/employee-details'
    //         ).then(m => m.EmployeeDetails)
    // },

    // REFACTORING AREA HR
    // Come con l'area employee, tutte le rotte dell'area HR sono state raggruppate sotto un unico layout con path 'hr'
    // Questo permette di applicare facilmente le stesse regole di accesso e lo stesso layout a tutte le pagine dell'area HR.
    {
        path: 'hr',
        component: HrLayout,
        canActivate: [authGuard, roleGuard],  // Applica le regole di accesso definite per l'area HR a tutte le rotte figlie
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
        path: '**',   // deve essere impostato come fallback per tutte le rotte non definite quindi deve essere l'ultima definita
        redirectTo: ''
    }

]; 
