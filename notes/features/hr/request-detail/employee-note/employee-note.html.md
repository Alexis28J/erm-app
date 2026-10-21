# COMMENTI

```HTML
<!-- TEMPLATE ORIGINALE CHE ERA NEL COMPONENTE PADRE -->

<!-- AREA NOTE DIPENDENTE -->
    <mat-card>

        <mat-card-header>
            <mat-card-title>
                Employee Note
                <mat-icon>notes</mat-icon>
            </mat-card-title>
        </mat-card-header>

        <mat-card-content>
            <p>{{ request.noteEmployee || 'No Employee Note.' }}</p>
            <!-- Mostra le note del dipendente, se presenti. Oppure un messaggio che indica che non ci sono note. -->
        </mat-card-content>

    </mat-card>
```


```HTML
<!-- VERSIONE LEGGERMENTE MODIFICATA PER IL COMPONENTE FIGLIO (DUMB COMPONENT) -->
<mat-card>

    <mat-card-header>
        <mat-card-title>
            Employee Note
            <mat-icon>notes</mat-icon>
        </mat-card-title>
    </mat-card-header>


    <mat-card-content>
        <p>{{ note() || 'No Employee Note.' }}</p>
    </mat-card-content>

</mat-card>            
```