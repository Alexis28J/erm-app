import { computed, inject, Injectable, signal } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AttachmentService } from '../attachment.service';
import { Expense } from '../../interfaces/expense';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { AppConfig } from '../../interfaces/app-config';


@Injectable({
    providedIn: 'root'
})

export class RequestFormFacade {

    // INIEZIONE DELLE DIPENDENZE
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private attachmentService = inject(AttachmentService);


    // Variabile che rappresenta il form reattivo per la richiesta di rimborso.
    readonly requestForm = this.fb.group({
        referenceMonth: ['', Validators.required],
        noteEmployee: [''],
        expenses: this.fb.array([])
    });


    // GETTER PER L'ARRAY DELLE SPESE DEL FORM
    get expenses(): FormArray {
        return this.requestForm.controls.expenses;
    }


    // METODO PRIVATO PER CREARE UN FORM GROUP PER UNA SINGOLA SPESA
    private createExpenseForm(
        expense?: Partial<Expense>
    ) {
        return this.fb.group({
            id: [expense?.id ?? crypto.randomUUID()],
            date: [expense?.date ?? '', Validators.required],
            category: [expense?.category ?? '', Validators.required],
            description: [expense?.description ?? ''],
            requestedAmount: [expense?.requestedAmount ?? null, Validators.required],
            approvedAmount: [expense?.approvedAmount ?? 0],
            attachments: [expense?.attachments ?? []]
        });
    }


    // METODO PER AGGIUNGERE UNA NUOVA SPESA AL FORM
    addExpense(): void {
        this.expenses.push(
            this.createExpenseForm()
        );
    }


    // METODO PER RIMUOVERE UNA SPESA DAL FORM
    removeExpense(index: number) {
        this.expenses.removeAt(index);
    }


    // METODO PER POPOLARE LE SPESE NEL FORM
    populateExpenses(
        expenses: Expense[]
    ): void {

        this.expenses.clear();

        expenses.forEach(expense => {

            this.expenses.push(
                this.createExpenseForm(expense)
            );

        });
    }


    // SIGNAL PER TENERE TRACCIA DEI VALORI DELLE SPESE (IMPORTO RICHIESTO, CATEGORIA, ETC.)
    readonly expensesValue = toSignal(
        this.expenses.valueChanges.pipe(
            startWith(this.expenses.getRawValue())
        ),
        {
            initialValue: []
        }

    );


    // SIGNAL PER LA CONFIGURAZIONE DELL'APPLICAZIONE
    readonly config = signal<AppConfig>(
        this.route.snapshot.data['config']
    );


    // COMPUTED DELLE CATEGORIE DI SPESA
    readonly expenseCategories = computed(
        () => this.config().expenseLimits
    );


    // COMPUTED PER OTTENERE I DATI DI PROGRESSO DELLE SPESE (CATEGORIA E IMPORTO RICHIESTO)
    readonly expenseProgressData = computed(
        () =>
            this.expensesValue().map(
                (expense: Expense) => ({
                    category: expense.category ?? '',
                    amount: Number(expense.requestedAmount ?? 0)
                })
            )
    );


    // COMPUTED PER OTTENERE L'IMPORTO TOTALE RICHIESTO PER LE SPESE
    readonly totalRequestedAmount = computed(
        () => {
            const expenses = this.expensesValue();

            return expenses.reduce(
                (total: number, expense: Expense) =>
                    total + (expense.requestedAmount ?? 0),
                0
            );
        }

    );


    // COMPUTED PER OTTENERE L'IMPORTO MASSIMO CONSENTITO PER LE SPESE 
    // (SOMMA DEI MASSIMI PER CATEGORIA O TOTALE MASSIMO CONSENTITO)
    readonly totalAllowedAmount = computed(
        () => {
            const expenses = this.expensesValue();

            return expenses.reduce(
                (total: number, expense: Expense) => {
                    const category = this.expenseCategories()
                        .find(c => c.name === expense.category);

                    return total + (category?.maxAmount ?? 0);
                },
                0
            );
        }

    );


    // METODO PER VALIDARE IL FORM (CONTROLLA CHE TUTTI I CAMPI RICHIESTI SIANO COMPILATI E CHE CI SIA ALMENO UNA SPESA)
    validateForm(): string | null {

        if (this.requestForm.invalid) {
            this.requestForm.markAllAsTouched();
            return ('Please fill in all required fields')
        }


        if (this.expenses.length === 0) {
            return ('Please add at least one expense')
        };

        return null;
    }


    // METODO PER GESTIRE LA SELEZIONE DEI FILE ALLEGATI PER LE SPESE
    async onFilesSelected(
        event: Event,
        expendeIndex: number
    ): Promise<void> {

        const files = (event.target as HTMLInputElement).files;

        if (!files?.length) {
            return;
        }

        const expense = this.expenses.at(expendeIndex);

        const attachments = expense.get('attachments')?.value ?? [];

        for (const file of Array.from(files)) {
            attachments.push(
                await this.attachmentService
                    .fileToAttachment(file)
            );
        }

        expense.patchValue({
            attachments
        });
    }


    // METODO PER RIMUOVERE UN FILE ALLEGATO (PER OGNI SINGOLA SPESA)
    removeAttachment(
        expenseIndex: number,
        attachmentIndex: number
    ): void {
        const expense = this.expenses.at(expenseIndex);

        const attachments = [
            ...(expense.value.attachments ?? [])
        ];

        attachments.splice(
            attachmentIndex,
            1
        );

        expense.patchValue({
            attachments
        });
    }

}



// VS Code Counter: 147 code lines (18/11/2026)



