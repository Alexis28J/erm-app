# COMMENTI

I file .spec.ts sono i file di test in cui vengono verificati i comportamenti dei componenti,servizi o facade dell'applicazione Angular.

## COMANDO PER ESEGUIRE I TEST DI UN FILE SPECIFICO
ng test --include="path del file"


```TYPESCRIPT
import { TestBed } from '@angular/core/testing';
import { AttachmentService } from './attachment.service';

describe('AttachmentService', () => {
// Cosa dobbiamo verificare? 
// Il metodo fileToAttachment deve: 
// 1. leggere il file tramite FileReader
// 2. convertire il contenuto in Base64 (DataURL)
// 3. restituire un ExpenseAttachment corretto

  let service: AttachmentService;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentService);
  });


  // VERIFICA DELLA CONVERSIONE CORRETTA DEL FILE
  // Questo test verifica che il metodo fileToAttachment converta correttamente un file 
  // in un ExpenseAttachment
  it('should convert file to attachment', async () => { // async indica che la funzione di test è asincrona

    // Arrange: Prepariamo i dati necessari per il test
    // Creiamo un file di testo di esempio da convertire in attachment
    const file = new File(
      ['Hello World'], // Contenuto del file di esempio
      'text.txt', // Nome del file di esempio
      { type: 'text/plain' }  // Tipo MIME (testo semplice) del file di esempio
    );


    // Act: Convertiamo il file in un attachment utilizzando il servizio
    const attachment = await service.fileToAttachment(file);  // await indica che aspettiamo il risultato della Promise


    // Assert: Verifichiamo che l'attachment abbia le proprietà corrette
    expect(attachment.fileName).toBe('text.txt'); // Verifica che il nome del file sia corretto
    expect(attachment.fileType).toBe('text/plain'); // Verifica che il tipo MIME del file sia corretto
    expect(attachment.fileContent).toContain('data:text/plain;base64'); // Verifica che il contenuto del file sia in formato Base64 (DataURL)

  });

  // Perché funziona?
  // Il browser converte: Hello World (contenuto del file)
  // in qualcosa di simile: data:text/plain;base64,SGVsbG8gV29ybGQ= (Hello World in Base64)
  // Non è necessario confrontare (verificare) tutta la stringa Base64 cioè il contenuto effettivo del file.
  // È sufficiente verificare:
  //   expect(
  //   attachment.fileContent
  // ).toContain('data:text/plain;base64');
  // per rendere il test più robusto. In altre parole, non ci preoccupiamo del contenuto esatto del file, ma solo del formato Base64.


  //////////////////////////////////////////////////////////////////////////////////////////////////

  // VERIFICA COMPLETA DEL MAPPING (fileName e fileType) 
  // Questo test non verifica il contenuto del file, ma solo il corretto mapping delle proprietà fileName e fileType.
  // A cosa serve questo test? Serve a garantire che le proprietà principali del file siano correttamente 
  // trasferite nell'attachment (fileName e fileType).
  // Se non testiamo questo aspetto, potremmo avere attachment con proprietà principali mancanti o errate, anche se il contenuto del file è corretto.
  it('should map files properties correctly', async () => {

    // Arrange
    // Creiamo un file fittizio con nome e tipo specifici per testare il mapping delle proprietà.
    const file = new File(
      ['content'],
      'receipt.pdf',
      { type: 'application/pdf' }
    );


    // Act
    // Convertiamo il file in attachment utilizzando il servizio.
    const attachment = await service.fileToAttachment(file);


    // Assert
    // Verifichiamo che le proprietà principali del file siano correttamente mappate nell'attachment.
    expect(attachment).toMatchObject({  // toMatchObject verifica che l'oggetto contenga le proprietà specificate
      fileName: 'receipt.pdf',   // fileName e fileType sono le proprietà principali del file che devono essere mappate correttamente
      fileType: 'application/pdf'
    });

  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  
  // VERIFICA FILE VUOTO
  // Questa verifica controlla che il servizio gestisca correttamente un file vuoto
  // Il file vuoto dovrebbe essere convertito correttamente in un attachment con contenuto Base64 valido
  it('should handle empty file', async () => {

    // Arrange
    const file = new File(  
      [''],
      'empty.txt',
      {
        type: 'text/plain'
      }
    );

    // Act
    const attachment = await service.fileToAttachment(file);

    // Assert
    expect(attachment.fileName).toBe('empty.txt'); // Verifica che il nome del file sia corretto
    expect(attachment.fileContent).toContain('data:text/plain;base64'); // Verifica che il contenuto del file sia in Base64

  });


});
```


- vi.fn è una funzione di Vitest che crea un mock function, utile per intercettare e verificare le chiamate ai metodi durante i test.

Come funziona? 
Quando viene chiamata una funzione mockata con vi.fn, Vitest registra le chiamate e i parametri passati.
Questo permette di verificare se la funzione è stata chiamata, quante volte e con quali argomenti.


- it(...): è la funzione di Vitest che definisce un singolo unit test.
La stringa passata a it(...) descrive il comportamento atteso dal test.

- expect(...): è la funzione di Vitest che verifica che una condizione sia vera.

- toHaveBeenCalled(): è un matcher di Vitest che verifica che un mock sia stato chiamato almeno una volta.

- toBe(...): è un matcher di Vitest che verifica che il valore atteso sia uguale al valore ricevuto.

- Pattern AAA è un approccio comune nei test unitari che suddivide il test in tre fasi distinte: Arrange, Act e Assert.

1. Arrange: prepara l'ambiente di test, inizializza mock e dati necessari.

2. Act: esegue l'azione da testare (ad esempio chiamata a facade.saveDraft() o facade.submitRequest()).

3. Assert: verifica che il risultato sia quello atteso, utilizzando expect(...) e matcher come toBe(...) o toHaveBeenCalled().

Non sempre è necessario utilizzare tutti e tre i passaggi del pattern AAA, soprattutto nei test più semplici, ma è una buona pratica mantenerli separati per chiarezza e manutenzione del test.

- Quando il metodo delega a un altro servizio, è utile intercettare le chiamate ai mock per verificare che i dati passati siano corretti.
Quindi è necessario usare un mock per "spiare" (spy) le chiamate al servizio e verificare i dati passati, tramite .mock.calls (o toHaveBeenCalledWith).