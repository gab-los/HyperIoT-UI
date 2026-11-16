import { Component, Inject, ChangeDetectionStrategy } from "@angular/core";
import { DIALOG_DATA, DialogRef } from "components";

@Component({
  selector: "hyt-save-changes-dialog",
  templateUrl: "./save-changes-dialog.component.html",
  styleUrls: ["./save-changes-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SaveChangesDialogComponent {
  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: any
  ) {}

  close(result) {
    this.dialogRef.close(result);
  }
}
