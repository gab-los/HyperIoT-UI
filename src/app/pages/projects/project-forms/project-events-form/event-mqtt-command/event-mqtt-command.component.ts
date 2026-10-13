import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { DialogService, Option, SelectOption } from 'components';
import { HPacket, HPacketField, HPacketService } from 'core';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SelectableText } from '../event-mail/selectableText';
import { EventComponent } from '../event-component';
import { EventComponentType } from '../event-component-type.enum';
import { EVENT_PLACEHOLDERS } from '../event-placeholders';
import {
  FieldValuePickerDialogComponent,
  FieldValuePickerDialogData,
} from './field-value-picker-dialog/field-value-picker-dialog.component';
import {
  FIELD_VALUE_PLACEHOLDER,
  FieldPlaceholderRegistry,
  getRootFields,
  isSupportedField,
  ProjectFieldRef,
  validateTemplate,
} from './mqtt-message-template';

/**
 * A field of the output packet: leaves have a template control, OBJECT fields have children
 */
interface MessageFieldNode {
  field: HPacketField;
  path: string;
  control?: UntypedFormControl;
  children?: MessageFieldNode[];
}

@Component({
  selector: 'hyt-event-mqtt-command',
  templateUrl: './event-mqtt-command.component.html',
  styleUrls: ['./event-mqtt-command.component.scss']
})
export class EventMqttCommandComponent implements OnInit, EventComponent {

  @Input()
  currentProjectId;

  mqttFieldsFormGroup: UntypedFormGroup = new UntypedFormGroup({});

  // template of each output packet field, keyed by field id
  templatesFormGroup: UntypedFormGroup = new UntypedFormGroup({});

  private originalFormsValues = '';

  currentOutputPacket: HPacket;

  outputPackets: HPacket[];
  packetOptions: SelectOption[] = [];
  messageFields: MessageFieldNode[] = [];

  // input/IO packets fields of the project, usable as placeholders
  registry = new FieldPlaceholderRegistry();
  private dataLoaded: Promise<void>;

  focusedNode: MessageFieldNode;
  private focusedInput: HTMLInputElement;

  placeholders: SelectableText[] = [];

  private readonly genericPlaceholders = EVENT_PLACEHOLDERS.map(p => p.placeholder);

  mqttUrl: string = environment.mqttUrl;
  mqttTopic: string;

  activeOptions: Option[] = [
    { value: "true", label: $localize`:@@HYT_send_mqtt_command_active:ACTIVE`, checked: true },
    { value: "false", label: $localize`:@@HYT_send_mqtt_command_disabled:DISABLED`}
    // { value: '', label: $localize`:@@HYT_start_statistic:START STATISTIC` }
  ];

  constructor(
    private hPacketsService: HPacketService,
    private dialogService: DialogService,
    private cd: ChangeDetectorRef,
  ) {
    this.originalFormsValues = this.getJsonForms();
  }

  ngOnInit(): void {
    this.updatePlaceholders();
    this.loadData();
  }

  getId(): string {
    return EventComponentType.SEND_MQTT_COMMAND_ACTION;
  }

  reset(): void {
    this.mqttFieldsFormGroup.reset();
    this.clearMessageFields();
  }

  setData(dataArr): void {
    const data = JSON.parse(dataArr[0]);
    if (data && data.packetId) {
      this.loadData().then(() => this.packetChanged(data.packetId, data));
    }
  }

  buildJsonAction(): any {
    const action = {
      actionName: EventComponentType.SEND_MQTT_COMMAND_ACTION,
      packetId: this.mqttFieldsFormGroup.get('packet').value,
      packetFormat: this.currentOutputPacket?.format,
      active: this.mqttFieldsFormGroup.get('active').value,
      topic: this.mqttTopic,
      message: JSON.stringify(this.buildMessage(this.messageFields))
    };
    return JSON.stringify([JSON.stringify(action)]);
  }

  isInvalid(): boolean {
    return !this.currentOutputPacket || this.templatesFormGroup.invalid;
  }

  isDirty(): boolean {
    return this.getJsonForms() !== this.originalFormsValues;
  }

  packetChanged(packetId, data?) {
    const packet = this.outputPackets?.find(p => p.id === packetId);
    if (!packet) {
      return;
    }
    this.currentOutputPacket = packet;
    this.mqttTopic = '/' + packet.device.id + '/receive';
    this.clearMessageFields();
    const message = data?.message ? JSON.parse(data.message) : {};
    this.messageFields = this.buildMessageFields(getRootFields(packet.fields), message);
    if (data) {
      this.mqttFieldsFormGroup.get('active').setValue(data.active);
      this.templatesFormGroup.markAllAsTouched();
    }
    this.mqttFieldsFormGroup.get('packet').setValue(packet.id);
    this.cd.detectChanges();
    if (data) {
      this.originalValueUpdate();
    }
  }

  changeEventActive(event) {
    this.mqttFieldsFormGroup.get('active').setValue(event);
  }

  onFieldFocus(node: MessageFieldNode, input: HTMLInputElement) {
    this.focusedNode = node;
    this.focusedInput = input;
    this.updatePlaceholders();
  }

  addPlaceholder(placeholder: string) {
    if (!this.focusedNode) {
      return;
    }
    if (placeholder !== FIELD_VALUE_PLACEHOLDER) {
      this.insertAtCursor(placeholder);
      return;
    }
    const node = this.focusedNode;
    const input = this.focusedInput;
    const { dialogRef } = this.dialogService.open<FieldValuePickerDialogComponent, FieldValuePickerDialogData, ProjectFieldRef>(
      FieldValuePickerDialogComponent,
      {
        data: { registry: this.registry, targetFieldName: node.path, targetType: node.field.type },
        backgroundClosable: true,
      }
    );
    dialogRef.afterClosed().subscribe(field => {
      if (field) {
        this.focusedNode = node;
        this.focusedInput = input;
        this.insertAtCursor(field.displayPlaceholder);
      }
    });
  }

  // the field value placeholder needs a focused field, generic placeholders are allowed only in TEXT fields
  private updatePlaceholders() {
    const textField = this.focusedNode?.field.type === HPacketField.TypeEnum.TEXT;
    this.placeholders = [
      {
        placeholder: FIELD_VALUE_PLACEHOLDER,
        description: $localize`:@@HYT_mqtt_field_value_placeholder:Last value of a project field`,
        disabled: !this.focusedNode,
      },
      ...EVENT_PLACEHOLDERS.map(p => ({ ...p, disabled: !textField })),
    ];
  }

  private insertAtCursor(text: string) {
    const control = this.focusedNode.control;
    const input = this.focusedInput;
    const value: string = control.value || '';
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;
    control.setValue(value.substring(0, start) + text + value.substring(end));
    control.markAsTouched();
    input.focus();
    const caret = start + text.length;
    input.setSelectionRange(caret, caret);
  }

  private loadData(): Promise<void> {
    if (!this.dataLoaded) {
      this.dataLoaded = new Promise(resolve => {
        forkJoin([
          this.hPacketsService.findAllHPacketByProjectIdAndType(this.currentProjectId, 'OUTPUT,IO'),
          this.hPacketsService.findAllHPacketByProjectIdAndType(this.currentProjectId, 'INPUT,IO'),
        ]).subscribe(([outputPackets, inputPackets]: [HPacket[], HPacket[]]) => {
          this.outputPackets = outputPackets;
          this.packetOptions = outputPackets.length === 0 ?
            [{ label: 'No output packets defined', value: '-1' }] :
            outputPackets.map(p => ({ label: p.name, value: p.id }));
          this.registry = new FieldPlaceholderRegistry(inputPackets);
          resolve();
        });
      });
    }
    return this.dataLoaded;
  }

  private buildMessageFields(fields: HPacketField[], message: any, parentPath?: string): MessageFieldNode[] {
    return fields
      .filter(field => isSupportedField(field))
      .map(field => {
        const path = parentPath ? `${parentPath}.${field.name}` : field.name;
        const savedValue = message ? message[field.name] : undefined;
        if (field.type === HPacketField.TypeEnum.OBJECT) {
          return { field, path, children: this.buildMessageFields(field.innerFields || [], savedValue, path) };
        }
        const value = savedValue === undefined || savedValue === null ? '' : this.registry.toDisplay(String(savedValue));
        const control = new UntypedFormControl(value, (c: AbstractControl) => this.validateFieldTemplate(c, field));
        this.templatesFormGroup.addControl(String(field.id), control);
        return { field, path, control };
      });
  }

  private validateFieldTemplate(control: AbstractControl, field: HPacketField): ValidationErrors | null {
    const error = validateTemplate(control.value, field.type, this.registry, this.genericPlaceholders);
    return error ? { template: error } : null;
  }

  private buildMessage(nodes: MessageFieldNode[]): any {
    const message = {};
    nodes.forEach(node => {
      message[node.field.name] = node.children ?
        this.buildMessage(node.children) :
        this.registry.toBackend(node.control.value || '');
    });
    return message;
  }

  private clearMessageFields() {
    Object.keys(this.templatesFormGroup.controls).forEach(key => this.templatesFormGroup.removeControl(key));
    this.messageFields = [];
    this.focusedNode = undefined;
    this.focusedInput = undefined;
    this.updatePlaceholders();
  }

  private originalValueUpdate() {
    this.originalFormsValues = this.getJsonForms();
  }

  private getJsonForms(): string {
    return JSON.stringify([this.mqttFieldsFormGroup.value, this.templatesFormGroup.value]);
  }
}
