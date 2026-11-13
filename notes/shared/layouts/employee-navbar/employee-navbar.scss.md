# COMMENTI

```SCSS
.spacer {
  flex: 1 1 auto; // Permette allo spacer di crescere e ridursi automaticamente
  // Il primo 1 indica la capacità di crescere
  // Il secondo 1 indica la capacità di ridursi
  // auto indica la dimensione base flessibile
}


.app-logo {
  height: 120px;
  margin-right: 10px;
}


.flag-btn {
  // position: relative;
  right: 20px; // Non ha bisogno della proprietà position relativa perché il pulsante è già posizionato correttamente nel layout

  &:hover,
  &:focus {
    background-color: rgb(191, 210, 252);
  }
}


.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  mat-card-title,
  mat-card-subtitle {
    font-family: "Zen Dots", sans-serif;
    padding: 0;
  }
}


.arrow-btn,
.mat-mdc-icon-button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

}

.arrow-btn,
.mat-mdc-icon-button,
.exit-btn,
.app-logo {

  &:hover,
  &:focus {
    color: #005cbb !important;
    transform: scale(1.1) !important;
    transition: transform 0.3s ease-in-out !important;
  }
}


.arrow-btn,
.mat-mdc-icon-button,
.mat-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 24px !important;
  margin-left: 6px !important;
}


.mat-menu-item,
.mat-mdc-menu-item {
  margin-right: 1rem !important;
}
```