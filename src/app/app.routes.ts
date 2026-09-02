import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [

    {
        path: '',
        component: Home
    },

    {
        path: 'login',
        loadComponent: () => 
            import('./features/login/login').then(m => m.Login)
    }, 

    {
        path: '**',  
        redirectTo: ''
    }

];
