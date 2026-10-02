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

  attachments =
  input<ExpenseAttachment[]>([]);  // Significa che questo componente riceve un array di allegati come input


  openAttachment(attachment: ExpenseAttachment): void {  // Apre l'allegato in una nuova finestra del browser

    window.open(attachment.fileContent, '_blank');  // window è l'oggetto globale del browser che rappresenta la finestra corrente
    // attachment è l'allegato corrente che si sta aprendo
    // fileContent è il contenuto del file codificato in Base64
    // _blank indica che il file deve essere aperto in una nuova finestra o scheda del browser
    
  }

}
```