import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef, SelectOptionGroup } from 'components';
import { HPacketField } from 'core';
import { FieldPlaceholderRegistry, isCompatibleSource, ProjectFieldRef } from '../mqtt-message-template';

export interface FieldValuePickerDialogData {
  registry: FieldPlaceholderRegistry;
  /** name and type of the output field the placeholder will be inserted into */
  targetFieldName: string;
  targetType: HPacketField.TypeEnum;
}

@Component({
  selector: 'hyt-field-value-picker-dialog',
  templateUrl: './field-value-picker-dialog.component.html',
  styleUrls: ['./field-value-picker-dialog.component.scss']
})
export class FieldValuePickerDialogComponent {

  packetGroups: SelectOptionGroup[] = [];
  packetFields: ProjectFieldRef[] = [];
  selectedField: ProjectFieldRef;

  constructor(
    private dialogRef: DialogRef<ProjectFieldRef>,
    @Inject(DIALOG_DATA) public data: FieldValuePickerDialogData,
  ) {
    this.packetGroups = this.buildPacketGroups();
  }

  isCompatible(field: ProjectFieldRef): boolean {
    return isCompatibleSource(field.type, this.data.targetType);
  }

  packetChanged(packetId: number) {
    this.selectedField = undefined;
    this.packetFields = this.data.registry.fields
      .filter(f => f.packetId === packetId)
      .sort((a, b) => a.fieldPath.localeCompare(b.fieldPath));
  }

  selectField(field: ProjectFieldRef) {
    if (this.isCompatible(field)) {
      this.selectedField = field;
    }
  }

  confirm() {
    this.dialogRef.close(this.selectedField);
  }

  close() {
    this.dialogRef.close();
  }

  private buildPacketGroups(): SelectOptionGroup[] {
    const groups = new Map<number, SelectOptionGroup>();
    const addedPackets = new Set<number>();
    this.data.registry.fields.forEach(f => {
      if (!groups.has(f.deviceId)) {
        groups.set(f.deviceId, { name: f.deviceName, options: [] });
      }
      if (!addedPackets.has(f.packetId)) {
        addedPackets.add(f.packetId);
        groups.get(f.deviceId).options.push({ value: f.packetId, label: f.packetName, disabled: true });
      }
      if (this.isCompatible(f)) {
        groups.get(f.deviceId).options.find(o => o.value === f.packetId).disabled = false;
      }
    });
    return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

}
