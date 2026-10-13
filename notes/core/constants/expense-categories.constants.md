# COMMENTI

Questo file contiene le categorie di spesa disponibili per l'applicazione. 

Ogni categoria ha un ID univoco, un nome (definito nell'enumerazione `ExpenseCategoryName`), 
un importo massimo consentito e un flag che indica se è necessario fornire una ricevuta per quella categoria.

I file di tipo `constants` sono utilizzati per definire valori costanti che possono essere utilizzati in tutto il progetto, in questo caso le categorie di spesa.


```TYPESCRIPT
// VALORI STATICI DELLE CATEGORIE DI SPESA (COMMENTATI PERCHE' ORA GESTITI TRAMITE MOCKAPI)

// export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
//   {
//     id: '1',
//     name: ExpenseCategoryName.TAXI,
//     maxAmount: 20,
//     receiptRequired: true
//   },
//   {
//     id: '2',
//     name: ExpenseCategoryName.TRAIN,
//     maxAmount: 50,
//     receiptRequired: true
//   },
//   {
//     id: '3',
//     name: ExpenseCategoryName.MEAL,
//     maxAmount: 25,
//     receiptRequired: true
//   },
//   {
//     id: '4',
//     name: ExpenseCategoryName.HOTEL,
//     maxAmount: 100,
//     receiptRequired: true
//   },
//   {
//     id: '5',
//     name: ExpenseCategoryName.FUEL,
//     maxAmount: 70,
//     receiptRequired: true
//   },
//   {
//     id: '6',
//     name: ExpenseCategoryName.OTHER,
//     maxAmount: 30,
//     receiptRequired: false
//   }
// ];
```

///////////////////////////////////////////////////////////////////////////////////////////////////////////

# FLUSSO LOGICO COMPLETO DEL PASSAGGIO ALLA CONFIGURAZIONE DINAMICA

All'inizio avevo:  `export const EXPENSE_CATEGORIES: ExpenseCategory[] = [...]`

Questa soluzione ha un grosso limite: 
HR vuole cambiare TAXI
20€ → 30€


Devo:
1. modificare il codice
2. ricompilare Angular
3. fare deploy

In un'azienda reale non è accettabile.


L'HR deve poter fare:

Settings
↓
Modifica limite
↓
Save
↓
Fine

senza toccare il codice



## Come ragiona l'applicazione

Invece di leggere: `expense-categories.constant.ts`

Leggi: 

```TYPESCRIPT
{
  "id": "config",
  ...
  "expenseLimits": [...]
}
```
 salvato su MockAPI.

A questo punto MockAPI diventa il database della configurazione.


Perché proprio un "utente tecnico"?
Perché MockAPI non ha una resource: configurations

Ho soltanto 2 resources disponibili:
1. users
2. refundRequests


Quindi devo conservare i dati da qualche parte.

Creo un record speciale:

```TYPESCRIPT
{
  "id": "config"
}
```
che non rappresenta una persona.
Rappresenta: `CONFIGURAZIONE APPLICATIVA`


## Come vede MockAPI i dati

La resource users diventa:

```TYPESCRIPT
[
  {
    "id": "1",
    "name": "Mario"
  },
  {
    "id": "2",
    "name": "Giulia"
  },
  {
    "id": "config",
    "name": "SYSTEM"
  }
]
```
Per MockAPI sono tutti record.

MockAPI non sa che:

```TYPESCRIPT
{
  "id": "config"
}
```
non è un vero utente.

Per lui è solo un altro oggetto JSON.


## Flusso completo

1. L'app parte : Angular start
2. L'HR apre:  `/HR/settings`
3. Parte il Resolver: `configResolver`
4. Il Resolver chiama: `ConfigService.getConfig()`
5. Il service esegue: `GET /users/config`  oppure  `GET /users?id=config`
6. MockAPI restituisce:

```TYPESCRIPT
{
  "id": "config",
  "expenseLimits": [...]
}
```

7. Il resolver consegna i dati al componente : `route.snapshot.data['config']`

8. Il componente costruisce il form.
TAXI     20
TRAIN    50
MEAL     25
...


9. Modifica della configurazione

L'HR cambia:

TAXI

20
↓
30


10. Salvataggio
Quando preme Save:  `save()`
viene creato:

```TYPESCRIPT
const updatedConfig = {
  ...this.config(),
  expenseLimits: [...]
}
```

11. Chiamata http:  `PUT /users/config`
con payload:  (payload significa "dati inviati" o "contenuto della richiesta" in un contesto di API o funzioni.)

```TYPESCRIPT
{
  "id": "config",
  "expenseLimits": [
    {
      "name": "TAXI",
      "maxAmount": 30
    }
  ]
}
```

12. MockAPI aggiorna il record 

Prima "TAXI": 20

Dopo "TAXI": 30


## Cosa succede nel request?

Un dipendente apre "New Request"

Prima:
Leggeva  `EXPENSE_CATEGORIES`
quindi trovava sempre:  "TAXI = 20"  fisso nel codice.

Adesso: 
Leggi la configurazione `config.expenseLimits`
quindi trovi: "TAXI = 30" appena modificato dall'HR.


## Flusso completo reale 

MockAPI
│
└── users
     │
     ├── Mario Rossi
     ├── Giulia Bianchi
     └── SYSTEM CONFIG
             │
             └── expenseLimits


HR Settings
      │
      ▼
Resolver
      │
      ▼
ConfigService
      │
      ▼
GET users/config
      │
      ▼
MockAPI
      │
      ▼
Expense Limits
      │
      ▼
Modifica
      │
      ▼
PUT users/config
      │
      ▼
MockAPI aggiornato



# Perché è una soluzione valida?

Perché sto simulando questa struttura che troverei in un backend reale:

`application_configuration` (SQL)
`expense_limits` (SQL)

con una tabella dedicata.


Non avendo una terza resource MockAPI, uso un record speciale:

```TYPESCRIPT
{
  "id": "config"
}
```
come contenitore della configurazione.

È un trucco molto comune nei progetti demo, PoC e corsi Angular.


## ULTERIORE MIGLIORAMENTO

Per evitare che questo record compaia nella login o nella gestione utenti, ho aggiunto:

```TYPESCRIPT
export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  employeeCode: string;
  role: UserRole;
  active?: boolean;

  systemConfig?: boolean;
}
```
e nel record:

```TYPESCRIPT
{
  "id": "config",
  "systemConfig": true,
  ...
}
```


Così quando carico gli utenti: `users.filter(user => !user.systemConfig)` (user.service)
e l'utente tecnico non verrà mai mostrato nelle schermate applicative.