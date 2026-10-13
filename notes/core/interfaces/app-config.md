# COMMENTI

```TYPESCRIPT
// Questa interfaccia viene usata per tipizzare (cioè definire il tipo di dati) la configurazione dell'applicazione ottenuta dall'endpoint "users/config" del servizio MockAPI.

// Nel mio caso, questa configurazione mi permette di gestire centralmente i limiti di spesa per ciascuna categoria.


import { ExpenseLimit } from './expense-limit'

export interface AppConfig {
    id: string;    // Identificatore univoco della configurazione dell'applicazione 
    expenseLimits: ExpenseLimit[]; // Array dei limiti di spesa per ciascuna categoria
}
```