import { ExpenseCategoryName } from './enum';

export interface ExpenseCategory {
    id: string;
    name: ExpenseCategoryName;
    maxAmount: number;
    receiptRequired: boolean;
}
