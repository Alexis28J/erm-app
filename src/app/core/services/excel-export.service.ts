import { Injectable } from '@angular/core';
import { RefundRequest } from '../interfaces/refund-request';
import { User } from '../interfaces/user';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})

export class ExcelExportService {

    // METODO PER ESPORTARE LE RICHIESTE DI RIMBORSO IN UN FILE EXCEL
    exportRequests(requests: RefundRequest[], users: User[]): void {

        const data = requests.map(request => {

            const employee = users.find(
                user => Number(user.id) === Number(request.userId)
            );

            return {
                Employee: `${employee?.name ?? ''} ${employee?.surname ?? ''}`,
                ReferenceMonth: new Date(request.referenceMonth).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric' }),

                Status:
                    request.status === 'PENDING' ? 'Pending'
                        : request.status === 'APPROVED' ? 'Approved'
                            : request.status === 'REJECTED' ? 'Rejected'
                                : request.status === 'PARTIAL_APPROVED' ? 'Partial Approved'
                                    : request.status === 'IN_PROGRESS' ? 'In Progress'
                                        : request.status === 'DRAFT' ? 'Draft'
                                            : request.status,

                RequestedAmount: Number(request.totalRequestedAmount),
                ApprovedAmount: Number(request.totalApprovedAmount ?? 0),
                CreationDate: new Date(request.creationDate).toLocaleDateString(),
                LastUpdateDate: new Date(request.lastUpdateDate).toLocaleDateString()
            }
        })

        // 2. Creo un foglio di lavoro (worksheet) a partire dai dati 
        const worksheet = XLSX.utils.json_to_sheet(data);

        // 2.1. Ottengo l'intervallo di celle del foglio di lavoro
        const range = XLSX.utils.decode_range(worksheet['!ref']!);


        // Colonna D = RequestedAmount
        for (let row = 1; row <= range.e.r; row++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: 3 })];

            if (cell) {
                cell.t = 'n';
                cell.z = '#,##0.00 €';
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


        worksheet['!cols'] = [
            { wch: 30 },
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


        // 5. Creo il nome del file Excel basato sulla data corrente
        const fileName = `refund-request-${new Date().toISOString().slice(0, 10)}.xlsx`;

        // 6. Scrivo il workbook su un file Excel
        XLSX.writeFile(
            workbook,
            fileName
        );

    }


    // METODO PER ESPORTARE GLI UTENTI IN UN FILE EXCEL
    exportEmployees(users: User[]): void {
        const data = users.map(user => ({
            Name: user.name,
            Surname: user.surname,
            Email: user.email,
            Active: user.active ? 'Active' : 'Inactive'
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        worksheet['!cols'] = [
            { wch: 20 },
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


        const fileName = `employee-list-${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(
            workbook,
            fileName
        )

    }

}



// VS Code Counter: 94 code lines (03/11/2026)