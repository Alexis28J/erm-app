# COMMENTI

```TYPESCRIPT
import { ExpenseCategoryName } from './enum';


export interface ExpenseAttachment {
    // id: string;   // Non necessario poiché gli allegati sono gestiti all'interno della spesa stessa
    fileName: string;
    fileContent: string;  // Userò Base64 che mi permette di gestire i file direttamente nel frontend
    // Files are converted to Base64 and stored inside the request
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

    attachments?: ExpenseAttachment[];  // Allegati relativi alla spesa, opzionali
    // Limite infrastrutturale per gli allegati. MockAPI rifiuta file troppo grandi.
    // Known limitation:
    // MockAPI rejects large payloads (HTTP 413 Request Entity Too Large).
    // A production-ready implementation would store files in dedicated object storage
    // (Azure Blob Storage, AWS S3, etc.) and save only the file URL in the request.
}
```