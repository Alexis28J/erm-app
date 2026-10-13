# COMMENTI

```TYPESCRIPT
// Ho creato questa interfaccia per rappresentare i limiti di spesa associati a ciascuna categoria di spesa.

import { ExpenseCategoryName } from './enum';

export interface ExpenseLimit {
    id: string;
    name: ExpenseCategoryName;
    maxAmount: number;
    receiptRequired: boolean;
}
```