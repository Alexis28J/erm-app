import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { UserRole } from './core/interfaces/enum';
import { EmployeeLayout } from './shared/layouts/employee-layout/employee-layout';
import { HrLayout } from './shared/layouts/hr-layout/hr-layout';
import { configResolver } from './config-resolver';
import { HrSettings } from './features/hr/hr-settings/hr-settings';
import { ExpenseLimitsSettings } from './features/hr/expense-limits-settings/expense-limits-settings';
import { UserManagement } from './features/hr/user-management/user-management';

export const routes: Routes = [

    {
        path: '',
        component: Home,
        title: 'J-ERM App: Home'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/login/login/login')
                .then(m => m.Login),
        title: 'J-ERM App: Login'
    },
    {
        path: 'reset-password',
        loadComponent: () =>
            import('./features/login/reset-password/reset-password')
                .then(c => c.ResetPassword),
        title: 'J-ERM App: Reset Password'
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
                    ).then(m => m.EmployeeDashboard),
                title: 'Employee Area: Dashboard'
            },

            {
                path: 'request-list',
                loadComponent: () =>
                    import(
                        './features/employee/request-list/request-list'
                    ).then(m => m.RequestList),
                title: 'Employee Area: Request List'
            },

            {
                path: 'request-details/:id',
                loadComponent: () =>
                    import(
                        './features/employee/request-details/request-details'
                    ).then(m => m.RequestDetails),
                title: 'Employee Area: Request Details',
                resolve: {
                    config: configResolver
                }
            },

            {
                path: 'edit-request/:id',
                loadComponent: () =>
                    import(
                        './features/employee/edit-request/edit-request'
                    ).then(m => m.EditRequest),
                title: 'Employee Area: Edit Request',
                resolve: {
                    config: configResolver
                }
            },

            {
                path: 'new-request',
                loadComponent: () =>
                    import(
                        './features/employee/new-request/new-request'
                    ).then(m => m.NewRequest),
                title: 'Employee Area: New Request',
                resolve: {
                    config: configResolver
                }
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
                path: 'settings',
                component: HrSettings,
                title: 'HR Area: Settings'
            },
            {
                path: 'settings/expense-limits',
                component: ExpenseLimitsSettings,
                title: 'HR Area: Expense Limits Settings',
                resolve: {
                    config: configResolver
                }
            },
            {
                path: 'settings/user-management',
                component: UserManagement,
                title: 'HR Area: User Management'
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import(
                        './features/hr/hr-dashboard/hr-dashboard'
                    ).then(m => m.HrDashboard),
                title: 'HR Area: Dashboard'
            },

            {
                path: 'request-list',
                loadComponent: () =>
                    import(
                        './features/hr/request-list/request-list'
                    ).then(m => m.RequestList),
                title: 'HR Area: Request List'
            },

            {
                path: 'request-details/:id',
                loadComponent: () =>
                    import(
                        './features/hr/request-detail/request-detail'
                    ).then(m => m.RequestDetail),
                title: 'HR Area: Request Details',
                resolve: {
                    config: configResolver
                }
            },

            {
                path: 'employee-list',
                loadComponent: () =>
                    import(
                        './features/hr/employee-list/employee-list'
                    ).then(m => m.EmployeeList),
                title: 'HR Area: Employee List'
            },

            {
                path: 'employee-details/:id',
                loadComponent: () =>
                    import(
                        './features/hr/employee-details/employee-details'
                    ).then(m => m.EmployeeDetails),
                title: 'HR Area: Employee Details'
            }

        ]
    },
    {
        path: '**',
        redirectTo: ''
    }

];



// VS Code Counter: 166 code lines (22/10/2026)

