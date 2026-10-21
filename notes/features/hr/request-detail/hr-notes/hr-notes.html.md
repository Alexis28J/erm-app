# COMMENTI

```HTML
<!-- TEMPLATE ORIGINALE CHE ERA NEL COMPONENTE PADRE -->
    <!-- AREA DELLE NOTE DI HR -->
    <mat-card>

        <mat-card-header>
            <mat-card-title>
                HR Note
                <mat-icon>edit</mat-icon>
            </mat-card-title>
        </mat-card-header>

        @if (reviewMode()) {
            
        <mat-card-content>

            <form [formGroup]="form">
                <mat-form-field appearance="outline" class="full-width">

                    <mat-label>
                        HR Notes
                    </mat-label>

                    <textarea matInput rows="5" formControlName="noteHr">
                    </textarea>

                </mat-form-field>
            </form>

        </mat-card-content>

        } @else if (request.noteHr) {

        <mat-card-content>
            {{request.noteHr}}
        </mat-card-content>

        } @else if (request.status !== 'PENDING' && request.noteHr === '') {

        <mat-card-content>
            No HR Notes
        </mat-card-content>

        } @else {

        <mat-card-content>
            <div class="review-banner">
                <span>
                    Click on "Verify Request" to add HR Notes
                </span>
            </div>
        </mat-card-content>

        }

    </mat-card>
```


```HTML
<!-- VERSIONE LEGGERMENTE MODIFICATA PER IL COMPONENTE FIGLIO (DUMB COMPONENT) -->

<mat-card>

    <mat-card-header>
        <mat-card-title>
            HR Note
            <mat-icon>edit</mat-icon>
        </mat-card-title>
    </mat-card-header>


    @if (reviewMode()) {

    <mat-card-content>

        <form [formGroup]="form()">
            <mat-form-field appearance="outline" class="full-width">

                <mat-label>
                    HR Notes
                </mat-label>

                <textarea matInput rows="5" formControlName="noteHr" aria-label="Write your HR notes">
                    </textarea>

            </mat-form-field>
        </form>

    </mat-card-content>

    } @else if (request().noteHr) {

    <mat-card-content>
        {{request().noteHr}}
    </mat-card-content>

    } @else if (request().status !== 'PENDING' && request().noteHr === '') {

    <mat-card-content>
        No HR Notes
    </mat-card-content>

    } @else {

    <mat-card-content>
        <div class="review-banner">
            <span>
                Click on "Verify Request" to add HR Notes
            </span>
        </div>
    </mat-card-content>

    }

</mat-card>
```