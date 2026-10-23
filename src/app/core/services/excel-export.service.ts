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
                ReferenceMonth: request.referenceMonth,

                Status:
                    request.status === 'PENDING' ? 'Pending'
                        : request.status === 'APPROVED' ? 'Approved'
                            : request.status === 'REJECTED' ? 'Rejected'
                                : request.status === 'PARTIAL_APPROVED' ? 'Partial Approved'
                                    : request.status === 'IN_PROGRESS' ? 'In Progress'
                                        : request.status,

                RequestedAmount: `${request.totalRequestedAmount.toFixed(2)} €`,
                ApprovedAmount: `${request.totalApprovedAmount?.toFixed(2) ?? '0.00'} €`,
                CreationDate: new Date(request.creationDate).toLocaleDateString(),
                LastUpdateDate: new Date(request.lastUpdateDate).toLocaleDateString()
            }
        })

        // 2. Creo un foglio di lavoro (worksheet) a partire dai dati 
        const worksheet = XLSX.utils.json_to_sheet(data);

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



// VS Code Counter: 78 code lines (23/10/2026)