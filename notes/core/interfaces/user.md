# COMMENTI

```TYPESCRIPT
import { UserRole } from './enum';

export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    password: string; // in un progetto reale, la password non dovrebbe essere memorizzata in chiaro
    employeeCode: string;
    role: UserRole;
    active?: boolean; 
      // La differenza tra 'id' e 'employeeCode' è che 'id' è l'identificativo univoco dell'utente nel sistema, mentre 'employeeCode' è il codice identificativo dell'impiegato.
}
```

- `UserRole` è un `enum` che definisce i ruoli degli utenti, come EMPLOYEE o HR ma su mockapi devo usare stringa perche non supporta enum


- `active` è un campo opzionale che indica se l'utente è attivo o meno. 

  Attivo significa che l'utente può accedere al sistema e fare richieste di rimborso, mentre inattivo significa che l'utente non può accedere al sistema e non può fare richieste di rimborso.

  Un utente può essere disattivato dall'amministratore del sistema per vari motivi, come ad esempio la cessazione del rapporto di lavoro o la sospensione dell'account.


