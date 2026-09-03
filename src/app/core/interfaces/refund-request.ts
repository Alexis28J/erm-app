import { RequestStatus } from "./enum";
import { Expense } from "./expense";

export interface RefundRequest {
    id: string;  
    userId: string;   
    referenceMonth: string; 
    creationDate: string;   
    lastUpdateDate: string;  
    status: RequestStatus;
    totalRequestedAmount: number;
    totalApprovedAmount?: number;  
    noteEmployee?: string;
    noteHr?: string;
    expenses: Expense[];  
}
