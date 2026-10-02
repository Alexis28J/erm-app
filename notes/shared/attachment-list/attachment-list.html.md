# COMMENTI

```HTML
@for(attachment of attachments(); track attachment.fileName) {

<button mat-stroked-button (click)="openAttachment(attachment)">

    <mat-icon>
        description
    </mat-icon>

    <!-- Imposto un limite di lunghezza di 20 caratteri per il nome del file e aggiungo "..." se è più lungo -->
    <!-- {{ attachment.fileName }} -->
    {{ attachment.fileName | slice:0:20 }}{{ attachment.fileName.length > 20 ? '...' : '' }}
    <!-- slice è un pipe di Angular che permette di prendere una porzione di una stringa o di un array, in questo caso prendiamo solo i primi 20 caratteri del nome del file -->

    <mat-icon>
        @if (attachment.fileType.includes('pdf')) {
        picture_as_pdf
        } @else {
        image
        }
    </mat-icon>

</button>

}
```