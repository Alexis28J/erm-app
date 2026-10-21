# COMMENTI

```SCSS
///////////////////////////////////////////////////////////////////////////////////

// RIGA DI DATI DELLA SINGOLA SPESA
.expense-row {
  // Ogni riga di dati della spesa
  display: grid;
  grid-template-columns:
    120px // Category
    2fr // Description  // 2fr significa che questa colonna occuperà due frazioni dello spazio disponibile rispetto alle altre colonne.
    120px // Requested Amount
    180px; // Approved Amount (input "Amount")
  gap: 16px;

  align-items: center;

  mat-form-field {
    position: relative;  // La posizione relativa e top servono per poter spostare l'input verso il basso rispetto alla sua posizione normale.
    top: 8px;
  }

}
//////////////////////////////////////////////////////////////////////////////////////
```