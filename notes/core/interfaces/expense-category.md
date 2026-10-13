# COMMENTI

```TYPESCRIPT
// Questa interfaccia rappresenta una categoria di spesa, inclusi il limite massimo e se è richiesto uno scontrino.

import { ExpenseCategoryName } from './enum';

export interface ExpenseCategory {
    id: string;
    name: ExpenseCategoryName;
    maxAmount: number;
    receiptRequired: boolean;
}
```