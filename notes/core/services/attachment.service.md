# COMMENTI

```TYPESCRIPT
import { Injectable } from '@angular/core';
import { ExpenseAttachment } from '../interfaces/expense';

@Injectable({
    providedIn: 'root'
})

export class AttachmentService {

    // Questo servizio fornisce un metodo per convertire un file in un oggetto ExpenseAttachment, 
    // utile per gestire gli allegati delle spese in modo asincrono.


    // METODO PER CONVERTIRE UN FILE IN UN OGGETTO ExpenseAttachment
    // Questo metodo legge il contenuto del file e lo converte in un oggetto ExpenseAttachment.
    fileToAttachment(
        file: File
    ): Promise<ExpenseAttachment> {  // Il metodo restituisce una Promise che risolve in un oggetto ExpenseAttachment.
        // Una Promise è un oggetto che rappresenta un'operazione asincrona che può completarsi con un valore o con un errore.
        // In questo caso, la Promise si risolve con un oggetto ExpenseAttachment contenente le informazioni del file.

        return new Promise(resolve => {  // return new Promise = crea una nuova Promise che esegue il codice asincrono al suo interno.

            const reader = new FileReader();  // FileReader è un oggetto che permette di leggere il contenuto di un file in modo asincrono.

            reader.onload = () => {  // Quando il file è stato letto correttamente (evento onload), viene eseguita questa funzione.

                resolve({  // resolve è la funzione che risolve (completa) la Promise con il valore passato come argomento.
                    fileName: file.name,
                    fileType: file.type,
                    fileContent: reader.result as string
                })
            }
            reader.readAsDataURL(file);  // Legge il contenuto del file come Data URL (base64) e attiva l'evento onload quando la lettura è completata.
        })
    }

    // Se analizzo il metodo fileToAttachment:
    // 1. Riceve un file come input.
    // 2. Crea una nuova Promise per gestire la lettura asincrona del file.
    // 3. Utilizza un FileReader per leggere il contenuto del file come Data URL.
    // 4. Quando la lettura è completata (grazie all'evento onload), risolve (completa) la Promise 
    // con un oggetto ExpenseAttachment contenente il nome, il tipo e il contenuto del file.
    // 5. Restituisce la Promise che si risolve con l'oggetto ExpenseAttachment.

}
```