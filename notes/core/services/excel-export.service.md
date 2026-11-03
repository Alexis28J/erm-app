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
                ReferenceMonth: new Date(request.referenceMonth).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric' }), // Mese di riferimento della richiesta di rimborso. Mostro solo mese e anno. // undefined indica che verrà utilizzata la localizzazione predefinita dell'ambiente 
                // cioè la lingua e il formato della data del sistema in uso

                Status:  // Stato della richiesta di rimborso (Pending, Approved, Rejected, Partial Approved, In Progress, ecc.)
                    request.status === 'PENDING' ? 'Pending'
                        : request.status === 'APPROVED' ? 'Approved'
                            : request.status === 'REJECTED' ? 'Rejected'
                                : request.status === 'PARTIAL_APPROVED' ? 'Partial Approved'
                                    : request.status === 'IN_PROGRESS' ? 'In Progress'
                                        : request.status === 'DRAFT' ? 'Draft'
                                            : request.status,  // Stato della richiesta di rimborso non riconosciuto, viene riportato così com'è


                RequestedAmount: Number(request.totalRequestedAmount),  // Converto l'importo richiesto in numero 
                ApprovedAmount: Number(request.totalApprovedAmount ?? 0),  // Converto l'importo approvato in numero 

                //CreationDate: request.creationDate,
                CreationDate: new Date(request.creationDate).toLocaleDateString(),  // Data di creazione della richiesta di rimborso formattata come stringa locale 
                //LastUpdateDate: request.lastUpdateDate
                LastUpdateDate: new Date(request.lastUpdateDate).toLocaleDateString() // New Date() crea un oggetto Date e toLocaleDateString() lo formatta come stringa locale (cioè leggibile dall'utente)
            }
        })

        // 2. Creo un foglio di lavoro (worksheet) a partire dai dati 
        const worksheet = XLSX.utils.json_to_sheet(data);


        // 2.1. Ottengo l'intervallo di celle del foglio di lavoro
        const range = XLSX.utils.decode_range(worksheet['!ref']!);
        // decode_range restituisce l'intervallo di celle effettivamente utilizzate nel foglio di lavoro
        // worksheet['!ref'] contiene l'intervallo di celle in formato stringa, ad esempio "A1:G10"  // Il simbolo ! indica che si tratta di una proprietà speciale di XLSX
        // In parole molto semplici, ottengo l'intervallo di celle che contengono effettivamente dei dati nel foglio di lavoro


        // Colonna D = RequestedAmount
        // Itero su tutte le righe della colonna D (RequestedAmount) per formattarle come numeri con due decimali e simbolo dell'euro
        for (let row = 1; row <= range.e.r; row++) {   // range.e.r è l'ultima riga effettivamente utilizzata nel foglio di lavoro
            const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: 3 })];  // Ottengo la cella corrispondente alla colonna D (RequestedAmount) della riga corrente

            if (cell) {   // Se la cella esiste, la formatto come numero con due decimali e simbolo dell'euro
                cell.t = 'n';  // Imposto il tipo della cella come numero cioè il valore sarà trattato come numero e non come testo
                cell.z = '#,##0.00 €';  // Imposto il formato della cella come numero con due decimali e simbolo dell'euro
            }
        }


        // Colonna E = ApprovedAmount 
        for (let row = 1; row <= range.e.r; row++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: 4 })];

            if (cell) {
                cell.t = 'n';
                cell.z = '#,##0.00 €';
            }
        }

        //In sintesi, nel punto 2.1 ottengo l'intervallo di celle effettivamente utilizzate 
        // nel foglio di lavoro e formatto le colonne D e E come numeri con due decimali e simbolo dell'euro


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