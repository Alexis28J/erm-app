import { TestBed } from '@angular/core/testing';
import { AttachmentService } from './attachment.service';

describe('AttachmentService', () => {

  let service: AttachmentService;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentService);
  });


  // VERIFICA DELLA CONVERSIONE CORRETTA DEL FILE
  it('should convert file to attachment', async () => {

    // Arrange
    const file = new File(
      ['Hello World'],
      'text.txt',
      { type: 'text/plain' }
    );

    // Act
    const attachment = await service.fileToAttachment(file);

    // Assert
    expect(attachment.fileName).toBe('text.txt');
    expect(attachment.fileType).toBe('text/plain');
    expect(attachment.fileContent).toContain('data:text/plain;base64');

  });


  // VERIFICA COMPLETA DEL MAPPING (fileName e fileType) 
  it('should map files properties correctly', async () => {

    // Arrange
    const file = new File(
      ['content'],
      'receipt.pdf',
      { type: 'application/pdf' }
    );

    // Act
    const attachment = await service.fileToAttachment(file);

    // Assert
    expect(attachment).toMatchObject({
      fileName: 'receipt.pdf',
      fileType: 'application/pdf'
    });

  });


  // VERIFICA FILE VUOTO
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
    expect(attachment.fileName).toBe('empty.txt'); 
    expect(attachment.fileContent).toContain('data:text/plain;base64'); 

  });

});



// VS Code Counter: 44 code lines (24/11/2026)



// TEST VERIFICATI (24/11/2026): 
// - 'should convert file to attachment' (Conversione corretta del file)  (avvenuto con successo)
// - 'should map files properties correctly' (Mapping corretto delle proprietà del file) (avvenuto con successo)
// - 'should handle empty file' (Gestione corretta del file vuoto) (avvenuto con successo)

