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

  attachments =
    input<ExpenseAttachment[]>([]);

    // Nuovo input per gestire la lunghezza del taglio (0 significa nessun taglio)
    // Con questo input posso controllare la lunghezza massima del nome del file visualizzato. 
    // In ogni componente che utilizza questa lista di allegati, 
    // posso specificare la lunghezza massima del nome del file tramite questo input.
    truncateLength = input<number>(0);
    
  openAttachment(attachment: ExpenseAttachment): void {
    window.open(attachment.fileContent, '_blank');
  }

}
