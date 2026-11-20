import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { AppConfig } from '../../../core/interfaces/app-config';
import { Router } from '@angular/router';
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
  imports: [CommonModule, ReactiveFormsModule, MatCardModule,
    MatTableModule, MatInputModule, MatCheckboxModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
    RouterLink],
  selector: 'app-expense-limits-settings',
  styleUrls: ['./expense-limits-settings.scss'],
  templateUrl: './expense-limits-settings.html',
})
export class ExpenseLimitsSettings {

  constructor() {

    // EFFECT CHE OSSERVA IL SIGNAL DELLA CONFIGURAZIONE HR E AGGIORNA I LIMITI DI SPESA DI CONSEGUENZA
    effect(() => {

      const config = this.config();

      if (!config) {
        return;
      }

      this.form.setControl(
        'expenseLimits',
        this.buildExpenseLimitForm(
          config.expenseLimits
        )
      );

      this.cdr.detectChanges();

    });

  }


  // INIETTAZIONE DEL FORM BUILDER
  private readonly fb = inject(FormBuilder);


  // INIETTAZIONE DEL SERVIZIO DI CONFIGURAZIONE HR
  private readonly configService = inject(ConfigService);


  // INIETTAZIONE DEL SERVIZIO DI NOTIFICHE
  private readonly notification = inject(Notification);


  // INIETTAZIONE DEL ROUTER
  private readonly router = inject(Router);


  // INIETTAZIONE DEL CHANGE DETECTOR REF
  private readonly cdr = inject(ChangeDetectorRef);


  // COLONNE DA VISUALIZZARE NELLA TABELLA DEI LIMITI DI SPESE
  displayedColumns = [
    'category',
    'maxAmount',
    'receiptRequired'
  ]


  // SIGNAL CHE CONTIENE LA CONFIGURAZIONE HR
  readonly config = this.configService.config;


  // INIZIALIZZAZIONE DEL FORM REATTIVO
  form = this.fb.group({
    expenseLimits: this.fb.array([])
  });


  // GETTER PER L'ARRAY REATTIVO DEI LIMITI DI SPESE
  get expenseLimits(): FormArray<any> {
    return this.form.controls.expenseLimits;
  }


  // METODO PER SALVARE LE MODIFICHE ALLA CONFIGURAZIONE HR
  save(): void {

    const currentConfig = this.config();

    if (!currentConfig) {
      this.notification.error('No configuration available.');
      return;
    }

    const updatedConfig: AppConfig = {
      ...currentConfig,
      expenseLimits: (this.form.getRawValue().expenseLimits as ExpenseLimit[] ?? [])
    };

    this.configService
      .updateConfig(updatedConfig)
      .subscribe({
        next: (config) => {
          this.configService.setConfig(config);
          this.notification.success('Configuration saved successfully.');
          this.router.navigate(['/hr/settings']);
        },
        error: (err) => {
          this.notification.error('Failed to save configuration.');
        }
      });
  }


  // METODO PER IMPORTARE I LIMITI DI SPESE DA UN FILE EXCEL
  importExpenseLimits(
    event: Event
  ): void {

    const config = this.config();

    if (!config) {
      this.notification.error('Configuration not loaded');
      return;
    }

    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      this.notification.error('No file selected');
      return;
    }


    // LETTURA DEL FILE EXCEL
    const reader = new FileReader();

    reader.onload = (e) => {

      try {

        const arrayBuffer = e.target?.result as ArrayBuffer;

        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const rawData = XLSX.utils.sheet_to_json(worksheet);


        // CONVERSIONE DEI DATI RAW IN OGGETTI DI TIPO ExpenseLimit
        const limits: ExpenseLimit[] =
          rawData.map((row: any) => {

            const existingLimit = config.expenseLimits.find(
              limit => limit.name === row.Name
            );

            return {
              id: existingLimit?.id ?? crypto.randomUUID(),
              name: row.Name?.trim(),
              maxAmount: Number(row.MaxAmount),
              receiptRequired: row.ReceiptRequired === true ||
                row.ReceiptRequired === 'true'
            };

          });


        // VALIDAZIONE DEI LIMITI DI SPESE IMPORTATI
        const hasInvalidRows = limits.some(limit => !limit.name || isNaN(limit.maxAmount) ||
          limit.maxAmount < 0);

        if (hasInvalidRows) {
          this.notification.error('The Excel file contains invalid data');
          return;
        }


        // AGGIORNAMENTO CONFIG 
        const mergedLimits = config.expenseLimits.map(

          existingLimit => {

            const importedLimit = limits.find(limit => limit.name === existingLimit.name);

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


        // CREAZIONE CONFIG AGGIORNATA
        const updatedConfig: AppConfig = {
          ...config,
          expenseLimits: mergedLimits
        };


        this.configService
          .updateConfig(updatedConfig)
          .subscribe({
            next: (saveConfig) => {
              this.configService.setConfig(saveConfig);
              this.notification.success('Expense limits imported successfully');
            },

            error: () => {
              this.notification.error('Error while importing expense limits');
            }
          });

      } catch (error) {
        console.error(error);
        this.notification.error('Unable to read the Excel file');
      }

    };

    reader.readAsArrayBuffer(file);
  }


  // METODO PER COSTRUIRE IL FORM DEI LIMITI DI SPESA
  private buildExpenseLimitForm(
    limits: ExpenseLimit[]
  ): FormArray {
    return this.fb.array(
      limits.map(limit =>
        this.fb.group({
          id: [limit.id],
          name: [limit.name],
          maxAmount: [limit.maxAmount],
          receiptRequired: [limit.receiptRequired]
        })
      )
    );
  }

}



// VS Code counter: 172 code lines (20/11/2026)



// Se analizzo pezzo per pezzo il metodo importExpenseLimits:
// 1. Legge il file Excel come ArrayBuffer.
// 2. Converte il contenuto del file in un workbook.
// 3. Estrae i dati dal primo foglio del workbook.
// 4. Mappa i dati in un array di limiti di spesa.
// 5. Valida i limiti importati.
// 6. Unisce i limiti importati con quelli esistenti.
// 7. Crea una nuova configurazione aggiornata.
// 8. Aggiorna la configurazione tramite il servizio.
// 9. Gestisce eventuali errori durante il processo.