import { Component, inject, signal } from '@angular/core';
import { AppConfig } from '../../../core/interfaces/app-config';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray } from '@angular/forms';
import { ConfigService } from '../../../core/services/config-service';
import { ExpenseLimit } from '../../../core/interfaces/expense-limit';
import { Notification } from '../../../shared/notification-service/notification';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';


@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink
  ],
  selector: 'app-expense-limits-settings',
  styleUrls: ['./expense-limits-settings.scss'],
  templateUrl: './expense-limits-settings.html',
})
export class ExpenseLimitsSettings {

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


    this.router.navigate(['/hr/settings']);
  }


  // METODO PER IMPORTARE I LIMITI DI SPESE DA UN FILE EXCEL
  importExpenseLimits(event: Event): void {

    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {

      try {

        const arrayBuffer = e.target?.result as ArrayBuffer;

        const workbook = XLSX.read(
          arrayBuffer,
          {
            type: 'array'
          }
        );

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const rawData = XLSX.utils.sheet_to_json(
          worksheet
        );

        console.log('RAW DATA', rawData);


        // CONVERSIONE DEI DATI RAW IN OGGETTI DI TIPO ExpenseLimit
        const limits: ExpenseLimit[] = rawData.map(
          (row: any) => {

            const currentLimitId = this.config().expenseLimits.find(limit => limit.name === row.Name);

            return {
              id: currentLimitId?.id ?? crypto.randomUUID(),
              name: row.Name?.trim(),
              maxAmount: Number(row.MaxAmount),
              receiptRequired:
                row.ReceiptRequired === true ||
                row.ReceiptRequired === 'true'
            };
          }
        );

        console.log('CONVERTED LIMITS', limits);


        // VALIDAZIONE DEI LIMITI DI SPESE IMPORTATI
        const hasInvalidRows = limits.some(limit =>
          !limit.name ||
          Number.isNaN(
            limit.maxAmount
          ) ||
          limit.maxAmount < 0
        );

        if (hasInvalidRows) {
          this.notification.error('The Excel file contains invalid data');
          return;
        }


        // AGGIORNAMENTO CONFIG 
        const mergedLimits = this.config().expenseLimits.map(

          existingLimit => {

            const importedLimit = limits.find(
              limit =>
                limit.name === existingLimit.name
            );

            if (!importedLimit) {
              return existingLimit;
            }

            return {
              ...existingLimit,
              maxAmount: importedLimit.maxAmount,
              receiptRequired: importedLimit.receiptRequired
            };
          }
        );


        const updateConfig = {
          ...this.config(),
          expenseLimits: mergedLimits
        };


        this.hrConfigService
          .updateConfig(updateConfig)
          .subscribe({

            next: () => {
              this.notification.success(
                'Expense limits imported successfully'
              );

              location.reload();
            },

            error: () => {
              this.notification.error(
                'Error while importing expense limits'
              );
            }
          });

      }
      catch (error) {
        console.error(error);

        this.notification.error(
          'Unable to read the Excel file'
        );

      }
    };

    reader.readAsArrayBuffer(file);
  }


}



// VS Code counter: 174 code lines (27/10/2026)