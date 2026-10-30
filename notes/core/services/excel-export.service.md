# COMMENTI

```TYPESCRIPT
import { Injectable } from '@angular/core';
import { RefundRequest } from '../interfaces/refund-request';
import { User } from '../interfaces/user';
import * as XLSX from 'xlsx';  // Indica che stiamo importando tutte le funzionalità della libreria XLSX sotto il namespace XLSX

@Injectable({
    providedIn: 'root'
})

export class ExcelExportService {

    // METODO PER ESPORTARE LE RICHIESTE DI RIMBORSO IN UN FILE EXCEL
    // Questo metodo prende un array di richieste di rimborso e un array di utenti,
    // e genera un file Excel contenente le informazioni delle richieste di rimborso,
    // inclusi i dettagli dell'impiegato associato a ciascuna richiesta.
    exportRequests(requests: RefundRequest[], users: User[]): void {

        const data = requests.map(request => {  // Mappo ogni richiesta di rimborso in un oggetto contenente le informazioni da esportare in Excel

            const employee = users.find(  // Trovo l'impiegato associato alla richiesta di rimborso corrente
                user => Number(user.id) === Number(request.userId)
            );

            return {
                Employee: `${employee?.name ?? ''} ${employee?.surname ?? ''}`,  // Nome e cognome dell'impiegato associato alla richiesta di rimborso 
                ReferenceMonth: request.referenceMonth,  // Mese di riferimento della richiesta di rimborso

                Status:  // Stato della richiesta di rimborso (Pending, Approved, Rejected, Partial Approved, In Progress, ecc.)
                    request.status === 'PENDING' ? 'Pending'
                        : request.status === 'APPROVED' ? 'Approved'
                            : request.status === 'REJECTED' ? 'Rejected'
                                : request.status === 'PARTIAL_APPROVED' ? 'Partial Approved'
                                    : request.status === 'IN_PROGRESS' ? 'In Progress'
                                        : request.status === 'DRAFT' ? 'Draft'
                                            : request.status,  // Stato della richiesta di rimborso non riconosciuto, viene riportato così com'è

                RequestedAmount: `${request.totalRequestedAmount.toFixed(2)} €`,  // toFixed(2) per formattare l'importo con due decimali
                ApprovedAmount: `${request.totalApprovedAmount?.toFixed(2) ?? '0.00'} €`, // '0.00' se l'importo approvato non è disponibile

                //CreationDate: request.creationDate,
                CreationDate: new Date(request.creationDate).toLocaleDateString(),  // Data di creazione della richiesta di rimborso formattata come stringa locale 
                //LastUpdateDate: request.lastUpdateDate
                LastUpdateDate: new Date(request.lastUpdateDate).toLocaleDateString() // New Date() crea un oggetto Date e toLocaleDateString() lo formatta come stringa locale (cioè leggibile dall'utente)
            }
        })

        // 2. Creo un foglio di lavoro (worksheet) a partire dai dati 
        const worksheet = XLSX.utils.json_to_sheet(data);

            worksheet['!cols'] = [  // '!cols' è un array che definisce la larghezza delle colonne del foglio di lavoro
            { wch: 30 },  // wch significa "width in characters" cioè la larghezza della colonna in numero di caratteri
            { wch: 20 },
            { wch: 25 },
            { wch: 20 },
            { wch: 20 },
            { wch: 25 },
            { wch: 25 }
        ]


        // 3. Creo un nuovo workbook (cartella di lavoro)
        const workbook = XLSX.utils.book_new();

        // 4. Aggiungo il foglio di lavoro al workbook
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Requests'
        );


        //  5. Scrivo il workbook su un file Excel
        // XLSX.writeFile(
        //     workbook,
        //     'refund-request.xlsx'
        // );

        // 5. Creo il nome del file Excel basato sulla data corrente
        const fileName = `refund-request-${new Date().toISOString().slice(0, 10)}.xlsx`;
        // slice(0, 10) prende solo la parte della data (YYYY-MM-DD) dall'ISO string

        // 6. Scrivo il workbook su un file Excel
        XLSX.writeFile(
            workbook,
            fileName
        );




    }


    // METODO PER ESPORTARE GLI UTENTI IN UN FILE EXCEL
    exportEmployees(users: User[]): void {
        const data = users.map(user => ({  // Mappo i dati degli utenti per l'esportazione in Excel
            Name: user.name,
            Surname: user.surname,
            Email: user.email,
            // Role: user.role === 'HR' ? 'HR' : 'Employee',  // Siccome, nel componente employee-list, il signal employee esclude il ruolo HR non è necessario esportarlo
            Active: user.active ? 'Active' : 'Inactive'
        }));


        const worksheet = XLSX.utils.json_to_sheet(data);

        worksheet['!cols'] = [  // '!cols' è un array che definisce la larghezza delle colonne del foglio di lavoro
            { wch: 20 },  // wch significa "width in characters" cioè la larghezza della colonna in numero di caratteri
            { wch: 20 },
            { wch: 35 },
            { wch: 15 }
        ]

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Employees'
        );


        // XLSX.writeFile(
        //     workbook,
        //     'employee-list.xlsx'
        // )

        const fileName = `employee-list-${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(
            workbook,
            fileName
        )

    }
}

// worksheet è il foglio di lavoro creato a partire dai dati delle richieste di rimborso
// workbook è la cartella di lavoro che contiene il foglio di lavoro e che verrà scritto su un file Excel
// In parole semplici, worksheet contiene i dati delle richieste di rimborso in formato tabellare,
// mentre workbook è il contenitore che include il worksheet e che viene salvato come file Excel
```