import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  imports: [ MatDialogModule, MatButtonModule ],
  selector: 'app-confirm-action',
  styleUrls: ['./confirm-action.scss'],
  templateUrl: './confirm-action.html',
})
export class ConfirmAction {

  readonly dialogRef = inject(MatDialogRef<ConfirmAction>);
  readonly data = inject(MAT_DIALOG_DATA);

  // METODO PER CHIUDERE IL DIALOGO SENZA CONFERMA (CANCELLAZIONE)
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // METODO PER CHIUDERE IL DIALOGO CON CONFERMA
  onConfirm(): void{
    this.dialogRef.close(true);
  }


}
