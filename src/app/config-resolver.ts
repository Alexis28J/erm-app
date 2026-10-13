import { ResolveFn } from '@angular/router';
import { AppConfig } from './core/interfaces/app-config';
import { inject } from '@angular/core';
import { ConfigService } from './core/services/config-service';

export const configResolver: ResolveFn<AppConfig> = () => {
  const configService = inject(ConfigService);
  return configService.getConfig();
};



// VS Code Counter: 8 code lines (13/10/2026)