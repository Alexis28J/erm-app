import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { translations } from '../i18n/translations';

describe('LanguageService', () => {

  let service: LanguageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
  });


  // LINGUA ITALIANA COME DEFAULT
  it('should initialize with italian language by default', () => {

    expect(
      service.language()  // .language() è il metodo che restituisce la lingua corrente
    ).toBe('it');

  });


  // INIZIALIZZARE LINGUA DAL LOCAL STORAGE
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


    // 4. Inietta il servizio (LanguageService) 
    const service = TestBed.inject(LanguageService);


    // 5. Verifica che la lingua corrente sia quella impostata nel localStorage
    expect(service.language())
      .toBe('en')

  });


  // IMPOSTARE LINGUA
  it('should set language', () => {

    // 1. Imposta la lingua corrente su 'en'
    service.setLanguage('en');

    // 2. Verifica che la lingua corrente sia stata aggiornata correttamente
    expect(
      service.language()
    ).toBe('en');

  });


  // SALVARE LINGUA NEL LOCAL STORAGE
  it('should save language in localStorage', () => {

    // 1. Imposta la lingua corrente su 'en'
    service.setLanguage('en');

    // 2. Verifica che la lingua sia stata salvata correttamente nel localStorage
    expect(
      localStorage.getItem('language')
    ).toBe('en');

  });


  // CAMBIARE LINGUA DA IT A EN
  it('should toggle from italian to english', () => {

    // 1. Chiama toggleLanguage() per cambiare la lingua corrente da italiana a inglese
    service.toggleLanguage();

    // 2. Verifica che la lingua corrente sia stata aggiornata correttamente cioè che sia 'en'
    expect(
      service.language()
    ).toBe('en');

  });


  // CAMBIARE LINGUA DA EN A IT
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


  // AGGIORNARE LOCAL STORAGE DOPO AVER CAMBIATO LINGUA
  it('should update localStorage after toggle', () => {

    // 1. Chiama toggleLanguage() per cambiare la lingua corrente da italiana a inglese
    service.toggleLanguage();

    // 2. Verifica che il localStorage sia stato aggiornato correttamente con la nuova lingua
    expect(
      localStorage.getItem('language')
    ).toBe('en');

  });


  //  DICTIONARY RESTITUISCE TRADUZIONI ITALIANE
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


  // DICTIONARY CAMBIA QUANDO CAMBIA LINGUA
  it('should update dictionary when language changes', () => {

    // 1. Imposta la lingua corrente su 'en'
    service.setLanguage('en');

    // 2. Verifica che il dizionario restituisca le traduzioni inglesi
    expect(
      service.dictionary()
    ).toEqual(
      translations.en
    );

  });


  // DICTIONARY SI AGGIORNA DOPO IL CAMBIO LINGUA
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


  // toggleLanguage() DEVE UTILIZZARE setLanguage()
  it('should call setLanguage when toggling', () => {

    // 1. Crea uno spy su setLanguage() per verificare che venga chiamato correttamente
    const spy = vi.spyOn(
      service,
      'setLanguage'
    );

    // 2. Chiama toggleLanguage() per cambiare la lingua corrente
    service.toggleLanguage();

    // 3. Verifica che setLanguage sia stato chiamato con 'en' durante il toggle della lingua
    expect(spy).toHaveBeenCalledWith('en');

  });

});



// VS Code Counter: 90 code lines (26/11/2026)



// TEST VERIFICATI (26/11/2026):
// - 'should initialize with italian language by default' (Lingua italiana di default) (Avvenuto con successo)
// - 'should initialize language from localStorage' (Inizializzazione lingua da localStorage) (Avvenuto con successo)
// - 'should set language' (Impostare lingua) (Avvenuto con successo)
// - 'should save language in localStorage' (Salvare lingua nel localStorage) (Avvenuto con successo)
// - 'should toggle from italian to english' (Cambiare lingua da IT a EN) (Avvenuto con successo)
// - 'should toggle from english to italian' (Cambiare lingua da EN a IT) (Avvenuto con successo)
// - 'should update localStorage after toggle' (Aggiornare localStorage dopo aver cambiato lingua) (Avvenuto con successo)
// - 'should return italian dictionary' (Dictionary restituisce traduzioni italiane) (Avvenuto con successo)
// - 'should update dictionary when language changes' (Dictionary cambia quando cambia lingua) (Avvenuto con successo)
// - 'should update dictionary after toggle' (Dictionary si aggiorna dopo il cambio lingua) (Avvenuto con successo)
// - 'should call setLanguage when toggling' (toggleLanguage() deve utilizzare setLanguage()) (Avvenuto con successo)

