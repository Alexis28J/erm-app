import { Injectable } from '@angular/core';
import { ExpenseAttachment } from '../interfaces/expense';

@Injectable({
    providedIn: 'root'
})

export class AttachmentService {

    // METODO PER CONVERTIRE UN FILE IN UN OGGETTO ExpenseAttachment
    fileToAttachment(
        file: File
    ): Promise<ExpenseAttachment> {

        return new Promise(resolve => {

            const reader = new FileReader();

            reader.onload = () => {

                resolve({
                    fileName: file.name,
                    fileType: file.type,
                    fileContent: reader.result as string
                })
            }
            reader.readAsDataURL(file);
        })
    }

}



// VS Code Counter: 22 code lines (16/11/2026)
