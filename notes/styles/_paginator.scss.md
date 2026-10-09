```SCSS
// Non metto @use perché questo file contiene solo stili per il paginator.
// Se avessi bisogno di utilizzare variabili o mixin da altri file SCSS, dovrei usare @use per importarli.


// PAGINATOR 
.mat-mdc-paginator {
    background-color: #d0dffd00 !important;
    margin-top: 20px !important;
    font-size: 1rem !important;
}

.mat-mdc-paginator-container {
    display: flex !important;
    justify-content: space-between !important;

    .mat-mdc-paginator-range-label {
        font-size: 1.5rem !important;
        color: #005cbb !important;
    }
}
```