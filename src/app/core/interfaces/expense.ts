import { ExpenseCategoryName } from './enum';


export interface ExpenseAttachment {
    // id: string;  
    fileName: string;
    fileContent: string;  
    fileType: string;
}

export interface Expense {
    id: string;
    category: ExpenseCategoryName;
    date: string;
    description: string;
    requestedAmount: number;
    approvedAmount?: number;
    noteHr?: string;

    attachments?: ExpenseAttachment[];  
}




