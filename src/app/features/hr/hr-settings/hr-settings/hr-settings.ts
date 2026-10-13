import { Component, inject, signal } from '@angular/core';
import { Notification } from '../../../../shared/notification-service/notification';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppConfig } from '../../../../core/interfaces/app-config';
import { ConfigService } from '../../../../core/services/config-service';
import { ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ExpenseLimit } from '../../../../core/interfaces/expense-limit';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  imports: [CommonModule, ReactiveFormsModule, MatTableModule,
    MatCardModule, MatInputModule, MatCheckboxModule,
    MatButtonModule, MatIconModule, RouterLink,
    MatTooltipModule],
  selector: 'app-hr-settings',
  styleUrls: ['./hr-settings.scss'],
  templateUrl: './hr-settings.html',
})
export class HrSettings {

  constructor() {
    this.initializeForm();
  }


  // INIETTAZIONE DELLA ROTTA ATTIVA
  private readonly route = inject(ActivatedRoute);


  // INIETTAZIONE DEL FORM BUILDER
  private readonly fb = inject(FormBuilder);


  // INIETTAZIONE DEL SERVIZIO DI CONFIGURAZIONE HR
  private readonly hrConfigService = inject(ConfigService);


  // INIETTAZIONE DEL SERVIZIO DI NOTIFICHE
  private readonly notification = inject(Notification);


  // INIETTAZIONE DEL ROUTER
  private readonly router = inject(Router);


  // COLONNE DA VISUALIZZARE NELLA TABELLA DEI LIMITI DI SPESE
  displayedColumns = [
    'category',
    'maxAmount',
    'receiptRequired'
  ]


  // SIGNAL PER LA CONFIGURAZIONE OTTENUTA DAL RESOLVER
  config = signal<AppConfig>(
    this.route.snapshot.data['config']
  );


  // INIZIALIZZAZIONE DEL FORM REATTIVO
  form = this.fb.group({
    expenseLimits: this.fb.array([])
  });


  // GETTER PER L'ARRAY REATTIVO DEI LIMITI DI SPESE
  get expenseLimits(): FormArray {
    return this.form.get('expenseLimits') as FormArray;
  }


  // INIZIALIZZAZIONE DEI CONTROLLI DEL FORM CON I DATI DELLA CONFIGURAZIONE HR
  private initializeForm(): void {
    this.config()?.expenseLimits.forEach(limit => {

      this.expenseLimits.push(
        this.fb.group({
          id: [limit.id],
          name: [limit.name],
          maxAmount: [limit.maxAmount],
          receiptRequired: [limit.receiptRequired]
        })
      );

    });
  }


  // METODO PER SALVARE LE MODIFICHE ALLA CONFIGURAZIONE HR
  save(): void {

    const updatedConfig: AppConfig = {
      ...this.config(),
      expenseLimits: this.form.value.expenseLimits as ExpenseLimit[] ?? []
    };

    this.hrConfigService
      .updateConfig(updatedConfig)
      .subscribe(config => {
        this.config.set(config);
      });


    this.notification.success('Configuration saved successfully.');


    this.router.navigate(['/hr/dashboard']);
  }


}



// VS Code Counter: 73 code lines (13/10/2026)
