import { ResolveFn } from '@angular/router';
import { AppConfig } from './core/interfaces/app-config';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigService } from './core/services/config-service';

export const configResolver: ResolveFn<AppConfig> = () => {

  // INIIZIALIZZAZIONE DEL SERVIZIO DI CONFIGURAZIONE
  const configService = inject(ConfigService);


  // CARICAMENTO DELLA CONFIGURAZIONE DEGLI UTENTI
  return configService.loadConfig().pipe(
    tap(config => configService.setConfig(config))
  );

};



// VS Code Counter: 11 code lines (20/11/2026)



