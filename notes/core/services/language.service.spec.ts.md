# COMMENTI

I file .spec.ts sono i file di test in cui vengono verificati i comportamenti dei componenti,servizi o facade dell'applicazione Angular.

## COMANDO PER ESEGUIRE I TEST DI UN FILE SPECIFICO
ng test --include="path del file"


```TYPESCRIPT
import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { translations } from '../i18n/translations';

describe('LanguageService', () => {

  let service: LanguageService;

  beforeEach(() => {
    localStorage.clear();  // Pulisce il localStorage prima di ogni test in modo da evitare interferenze tra i test
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
  });


  // LINGUA ITALIANA COME DEFAULT
  // Questo test verifica che la lingua predefinita sia l'italiano
  it('should initialize with italian language by default', () => {

    expect(
      service.language()  // .language() è il metodo che restituisce la lingua corrente
    ).toBe('it');

  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // INIZIALIZZARE LINGUA DAL LOCAL STORAGE
  // Questo test verifica che la lingua venga inizializzata correttamente dal localStorage
  it('should initialize language from localStorage', () => {

    // 1. Imposta la lingua nel localStorage prima di inizializzare il servizio
    localStorage.setItem(  
      'language',
      'en'  // Imposta la lingua inglese nel localStorage
    );


    // 2. Resetta il modulo di test per assicurarsi 
    TestBed.resetTestingModule(); 


    // 3. Configura nuovamente il modulo di test 
    TestBed.configureTestingModule({});

    // Resettare e configurare nuovamente il modulo di test garantisce che il servizio (LanguageService) venga inizializzato 
    // con il localStorage aggiornato cioè con la lingua impostata nel localStorage


    // 4. Inietta il servizio (LanguageService) 
    const service = TestBed.inject(LanguageService);

    
    // 5. Verifica che la lingua corrente sia quella impostata nel localStorage
    expect(service.language())
      .toBe('en')

  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // IMPOSTARE LINGUA
  it('should set language', () => {

    // 1. Imposta la lingua corrente su 'en'
    service.setLanguage('en');  

    // 2. Verifica che la lingua corrente sia stata aggiornata correttamente
    expect(   
      service.language()  
    ).toBe('en');  // Si spera che la lingua corrente sia stata aggiornata correttamente a 'en'

  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // SALVARE LINGUA NEL LOCAL STORAGE
  // Questo test verifica che la lingua venga salvata correttamente nel localStorage dopo averla impostata
  it('should save language in localStorage', () => {

    // 1. Imposta la lingua corrente su 'en'
    service.setLanguage('en');  

    // 2. Verifica che la lingua sia stata salvata correttamente nel localStorage
    expect(
      localStorage.getItem('language')
    ).toBe('en');

  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // CAMBIARE LINGUA DA IT A EN
  // Questo test verifica che la lingua venga cambiata da italiana a inglese usando toggleLanguage()
  it('should toggle from italian to english', () => {

    // 1. Chiama toggleLanguage() per cambiare la lingua corrente da italiana a inglese
    service.toggleLanguage();

    // 2. Verifica che la lingua corrente sia stata aggiornata correttamente cioè che sia 'en'
    expect(
      service.language()
    ).toBe('en');

  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // CAMBIARE LINGUA DA EN A IT
  // Questo test verifica che la lingua venga cambiata da inglese a italiana usando toggleLanguage()
  it('should toggle from english to italian', () => {

    // 1. Imposta la lingua corrente su 'en'
    service.setLanguage('en');

    // 2. Chiama toggleLanguage() per cambiare la lingua corrente da inglese a italiana
    service.toggleLanguage();

    // 3. Verifica che la lingua corrente sia stata aggiornata correttamente cioè che sia 'it'
    expect(
      service.language()
    ).toBe('it');

  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // AGGIORNARE LOCAL STORAGE DOPO AVER CAMBIATO LINGUA
  // Questo test verifica che il localStorage venga aggiornato correttamente dopo aver cambiato la lingua usando toggleLanguage()
  it('should update localStorage after toggle', () => {

    // 1. Chiama toggleLanguage() per cambiare la lingua corrente da italiana a inglese
    service.toggleLanguage();

    // 2. Verifica che il localStorage sia stato aggiornato correttamente con la nuova lingua
    expect(
      localStorage.getItem('language')
    ).toBe('en');

  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //  DICTIONARY RESTITUISCE TRADUZIONI ITALIANE
  // Questo test verifica che il dizionario restituisca le traduzioni italiane quando la lingua corrente è impostata su 'it'
  it('should return italian dictionary', () => {

    // 1. Imposta la lingua corrente su 'it'
    service.setLanguage('it');

    // 2. Verifica che il dizionario restituisca le traduzioni italiane
    expect(
      service.dictionary()
    ).toEqual(
      translations.it
    );

  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // DICTIONARY CAMBIA QUANDO CAMBIA LINGUA
  // Questo test verifica che il dizionario venga aggiornato correttamente quando la lingua cambia
  it('should update dictionary when language changes', () => {

    // 1. Imposta la lingua corrente su 'en'
    service.setLanguage('en');

    // 2. Verifica che il dizionario restituisca le traduzioni inglesi
    expect(
      service.dictionary()  // dictorionary() è un metodo che restituisce il dizionario corrente basato sulla lingua impostata
    ).toEqual(   // toEqual si usa per confrontare oggetti o array profondamente, verificando che abbiano lo stesso contenuto
      translations.en
    );

  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // DICTIONARY SI AGGIORNA DOPO IL CAMBIO LINGUA
  // Questo test verifica che il dizionario venga aggiornato correttamente dopo aver cambiato la lingua con toggleLanguage()
  it('should update dictionary after toggle', () => {

    // 1. Chiama toggleLanguage() per cambiare la lingua corrente da italiana a inglese
    service.toggleLanguage();

    // 2. Verifica che il dizionario sia stato aggiornato correttamente con le traduzioni inglesi
    expect(
      service.dictionary()
    ).toEqual(
      translations.en
    );

  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // toggleLanguage() DEVE UTILIZZARE setLanguage()
  // Questo test verifica che toggleLanguage() utilizzi internamente setLanguage() per cambiare la lingua corrente
  it('should call setLanguage when toggling', () => {

    // 1. Crea uno spy su setLanguage() per verificare che venga chiamato correttamente
    const spy = vi.spyOn(   // SpyOn è un metodo per creare uno spy su una funzione esistente, in questo caso su setLanguage()
      service,             // Uno spy è un oggetto che intercetta le chiamate a una funzione e permette di verificarle successivamente
      'setLanguage'   // In questo caso stiamo creando uno spy sulla funzione setLanguage del service 
    ); // per poter verificare che venga chiamata correttamente durante il toggle della lingua

    // 2. Chiama toggleLanguage() per cambiare la lingua corrente
    service.toggleLanguage();

    // 3. Verifica che setLanguage sia stato chiamato con 'en' durante il toggle della lingua
    expect(spy).toHaveBeenCalledWith('en');  // Quindi si spera che setLanguage, cioè la funzione intercettata dallo spy, 
    // sia stato chiamato correttamente con 'en' durante il toggle della lingua

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