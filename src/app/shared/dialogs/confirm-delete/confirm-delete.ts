import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  imports: [ MatDialogModule, MatButtonModule ],
  selector: 'app-confirm-delete',
  styleUrl: './confirm-delete.scss',
  templateUrl: './confirm-delete.html',
})
export class ConfirmDelete {

  readonly dialogRef = inject(MatDialogRef<ConfirmDelete>);

  readonly data = inject(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void{
    this.dialogRef.close(true);
  }


}
