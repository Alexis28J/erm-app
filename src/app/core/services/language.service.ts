import { computed, Injectable, signal } from '@angular/core';
import { Language } from '../i18n/language.type';
import { translations } from '../i18n/translations';

@Injectable({
    providedIn: "root"
})

export class LanguageService {

    // SIGNAL CHE CONTIENE LA LINGUA CORRENTE
    private readonly _language = signal<Language>(
        (localStorage.getItem('language') as Language) ?? 'it'
    );


    // SIGNAL PUBBLICA CHE ESPONE LA LINGUA CORRENTE COME READONLY
    readonly language = this._language.asReadonly();


    // SIGNAL CHE CONTIENE IL DIZIONARIO DELLA LINGUA CORRENTE
    readonly dictionary = computed(
        () => translations[this.language()]
    );


    // METODO PER IMPOSTARE LA LINGUA CORRENTE
    setLanguage(language: Language): void {
        localStorage.setItem('language', language);
        this._language.set(language);
    }


    // METODO PER TOGGLE LA LINGUA CORRENTE
    toggleLanguage(): void {
        this.setLanguage(
            this.language() === 'it'
                ? 'en'
                : 'it'
        );
    }

}



// VS Code Counter: 26 code lines (13/11/2026)