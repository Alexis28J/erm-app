import { ExpenseCategoryName } from './enum';

export interface ExpenseCategory {
    id: string;
    name: ExpenseCategoryName;
    maxAmount: number;
    receiptRequired: boolean;
}


// VS Code counter: 7 code lines (08/10/2026)