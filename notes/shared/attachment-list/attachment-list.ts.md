# COMMENTI

```TYPESCRIPT
import { Component, input } from '@angular/core';
import { ExpenseAttachment } from '../../../core/interfaces/expense';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule],
  selector: 'app-attachment-list',
  styleUrls: ['./attachment-list.scss'],
  templateUrl: './attachment-list.html',
})
export class AttachmentList {

  // Proprietà per memorizzare la lista degli allegati da visualizzare
  // Questo input permette di passare la lista degli allegati al componente.
  attachments =
  input<ExpenseAttachment[]>([]);  // Significa che questo componente riceve un array di allegati come input


  // Nuovo input per gestire la lunghezza del taglio (0 significa nessun taglio)
  // Con questo input posso controllare la lunghezza massima del nome del file visualizzato. 
  // In ogni componente che utilizza questa lista di allegati, posso specificare la lunghezza massima del nome del file tramite questo input.
    truncateLength = input<number>(0);


  // Metodo per aprire un allegato in una nuova finestra del browser (scheda separata)
  openAttachment(attachment: ExpenseAttachment): void {  // Apre l'allegato in una nuova finestra del browser

    window.open(attachment.fileContent, '_blank');  // window è l'oggetto globale del browser che rappresenta la finestra corrente
    // attachment è l'allegato corrente che si sta aprendo
    // fileContent è il contenuto del file codificato in Base64
    // _blank indica che il file deve essere aperto in una nuova finestra o scheda del browser
    
  }

}
```