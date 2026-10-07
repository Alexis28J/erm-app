# COMMENTI

```HTML
@for(attachment of attachments(); track attachment.fileName) {

<button mat-stroked-button (click)="openAttachment(attachment)" class="attachment-btn">

    <mat-icon>
        @if (attachment.fileType.includes('pdf')) {
        picture_as_pdf
        } @else {
        image
        }
    </mat-icon>


    <!-- ANTEPRIMA DEL NOME DEL FILE -->
    <!-- {{ attachment.fileName }} -->



    <!-- NOME DEL FILE ALLEGATO TRONCATO SE TROPPO LUNGO -->
    <!-- Imposto un limite di lunghezza di 20 caratteri per il nome del file e aggiungo "..." se è più lungo -->

    <!-- slice è un pipe di Angular che permette di prendere una porzione di una stringa o di un array, in questo caso prendiamo solo i primi 20 caratteri del nome del file -->

    <!-- {{ attachment.fileName | slice:0:20 }}{{ attachment.fileName.length > 20 ? '...' : '' }} -->



    <!-- LOGICA DI TRONCAMENTO DINAMICA | TRONCAMENTO DEL NOME DEL FILE UTILIZZANDO truncateLength() -->
    @if (truncateLength() > 0 && attachment.fileName.length > truncateLength()) {
        {{ attachment.fileName | slice:0:truncateLength() }}...
    } @else {
        {{ attachment.fileName }}
    }

    <!-- Il metodo slice viene utilizzato per troncare il nome del file se supera la lunghezza specificata da truncateLength.
     0 e truncateLength sono gli indici utilizzati per il metodo slice e indicano l'inizio e la fine del taglio del nome del file. -->
    <!-- "..." indica che il nome del file è stato troncato. Se non lo scrivo, il nome del file sarà mostrato per intero. -->


</button>

}
```