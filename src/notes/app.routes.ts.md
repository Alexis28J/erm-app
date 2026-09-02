# COMMENTI

Ho configurato la rotta delle pagine `home` e `login`. 

```TYPESCRIPT
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

        // Perché loadComponent viene utilizzato qui invece di component?
        // loadComponent viene utilizzato per il lazy loading del componente (cioè, il componente viene caricato solo quando necessario), il che significa che il modulo del componente viene caricato solo quando l'utente naviga verso questa rotta.

        //m sta per "module", carica il componente Login in modo lazy. Posso usare un'altra lettera se voglio.
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


