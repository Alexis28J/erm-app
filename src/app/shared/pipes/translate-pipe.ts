import { inject, Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'translate',
  pure: false
})

export class TranslatePipe implements PipeTransform {

  private readonly languageService = inject(LanguageService);

  // METODO PER TRADURRE UNA CHIAVE IN BASE AL DIZIONARIO DELLA LINGUA CORRENTE
  transform(key: string): string {  

    const dictionary = this.languageService.dictionary();

    const value = key
    .split('.')
    .reduce<any>(
      (obj, current) => obj?.[current],
      dictionary
    );

    return value ?? key;

  }

}


