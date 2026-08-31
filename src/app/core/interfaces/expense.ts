import { ExpenseCategoryName } from './enum';

export interface Expense {
    id: string;
    requesterId: string;
    category: ExpenseCategoryName;
    date: string;
    description: string;
    requestedAmount: number;
    approvedAmount?: number;
    receiptAttached?: boolean;
    noteHr?: string;
}


