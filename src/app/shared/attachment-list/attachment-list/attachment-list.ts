import { Component, input } from '@angular/core';
import { ExpenseAttachment } from '../../../core/interfaces/expense';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatIconModule, CommonModule, MatButtonModule],
  selector: 'app-attachment-list',
  styleUrls: ['./attachment-list.scss'],
  templateUrl: './attachment-list.html',
})
export class AttachmentList {

  // Input per memorizzare la lista degli allegati da visualizzare
  attachments =
    input<ExpenseAttachment[]>([]);


  // Input per gestire la lunghezza del taglio (0 significa nessun taglio)
  truncateLength = input<number>(0);


  // Metodo per aprire un allegato in una nuova finestra del browser (scheda separata)
  openAttachment(attachment: ExpenseAttachment): void {
    window.open(attachment.fileContent, '_blank');
  }

}
