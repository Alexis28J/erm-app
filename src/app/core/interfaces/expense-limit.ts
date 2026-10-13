import { ExpenseCategoryName } from './enum';

export interface ExpenseLimit {
    id: string;
    name: ExpenseCategoryName;
    maxAmount: number;
    receiptRequired: boolean;
}



// VS Code counter: 7 code lines (13/10/2026)