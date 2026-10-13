import { HPacket, HPacketField } from 'core';

/**
 * Utilities for the MQTT command message template.
 *
 * Every output packet field gets a template string. A template can contain:
 * - field value placeholders: shown to the user as ${VALUE_Device.Packet.field.path},
 *   sent to the backend as ${VALUE_deviceId/packetId/fieldId}
 * - generic placeholders (the same used by the mail action), e.g. ${EVENT_TRIGGER_TIME}
 * - literal text / numbers
 */

export const FIELD_VALUE_PLACEHOLDER = '${FIELD_VALUE}';

const PLACEHOLDER_REGEX = /\$\{([^}]*)\}/g;
const VALUE_PREFIX = 'VALUE_';
const BACKEND_ID_REGEX = /^(\d+)\/(\d+)\/(\d+)$/;

const NUMERIC_TYPES: HPacketField.TypeEnum[] = [
  HPacketField.TypeEnum.INTEGER,
  HPacketField.TypeEnum.LONG,
  HPacketField.TypeEnum.DOUBLE,
  HPacketField.TypeEnum.FLOAT,
  HPacketField.TypeEnum.BYTE,
];
const DATE_TYPES: HPacketField.TypeEnum[] = [
  HPacketField.TypeEnum.DATE,
  HPacketField.TypeEnum.TIMESTAMP,
];

export interface ProjectFieldRef {
  deviceId: number;
  packetId: number;
  fieldId: number;
  deviceName: string;
  packetName: string;
  /** dotted path of the field inside the packet (e.g. parent.child) */
  fieldPath: string;
  type: HPacketField.TypeEnum;
  /** ${VALUE_412/665/123} */
  backendPlaceholder: string;
  /** ${VALUE_Device.Packet.field} */
  displayPlaceholder: string;
}

export interface TemplateToken {
  kind: 'literal' | 'value' | 'generic';
  text: string;
  /** for 'value' tokens: the referenced field (undefined if not found) */
  field?: ProjectFieldRef;
}

export function isNumericType(type: HPacketField.TypeEnum): boolean {
  return NUMERIC_TYPES.includes(type);
}

export function isDateType(type: HPacketField.TypeEnum): boolean {
  return DATE_TYPES.includes(type);
}

/**
 * Fields that cannot be used as message fields nor as placeholder sources (for now)
 */
export function isSupportedField(field: HPacketField): boolean {
  return field.type !== HPacketField.TypeEnum.FILE &&
    (!field.multiplicity || field.multiplicity === HPacketField.MultiplicityEnum.SINGLE);
}

/**
 * Returns true if a field of type sourceType can be referenced in the template of a field of type targetType
 */
export function isCompatibleSource(sourceType: HPacketField.TypeEnum, targetType: HPacketField.TypeEnum): boolean {
  if (targetType === HPacketField.TypeEnum.TEXT) {
    return sourceType !== HPacketField.TypeEnum.OBJECT;
  }
  if (isNumericType(targetType)) {
    return isNumericType(sourceType);
  }
  if (isDateType(targetType)) {
    return isDateType(sourceType);
  }
  return sourceType === targetType;
}

/**
 * Packet fields may come as a flat list (inner fields included) or as a tree:
 * this returns only the root fields, so that the tree can be walked through innerFields
 */
export function getRootFields(fields: HPacketField[] = []): HPacketField[] {
  const innerIds = new Set<number>();
  fields.forEach(f => (f.innerFields || []).forEach(inner => innerIds.add(inner.id)));
  return fields.filter(f => !innerIds.has(f.id));
}

/**
 * Bidirectional map between backend placeholders (ids) and display placeholders (names)
 */
export class FieldPlaceholderRegistry {

  readonly fields: ProjectFieldRef[] = [];
  private byBackendKey = new Map<string, ProjectFieldRef>();
  private byDisplayKey = new Map<string, ProjectFieldRef>();

  constructor(packets: HPacket[] = []) {
    packets.forEach(packet => this.addFields(packet, getRootFields(packet.fields)));
    // names are not guaranteed to be unique: ambiguous fields are shown with their ids
    const displayKeyCount = new Map<string, number>();
    this.fields.forEach(f => displayKeyCount.set(f.displayPlaceholder, (displayKeyCount.get(f.displayPlaceholder) || 0) + 1));
    this.fields.forEach(f => {
      if (displayKeyCount.get(f.displayPlaceholder) > 1) {
        this.byDisplayKey.delete(f.displayPlaceholder.slice(2 + VALUE_PREFIX.length, -1));
        f.displayPlaceholder = f.backendPlaceholder;
      }
    });
  }

  findByBackendKey(key: string): ProjectFieldRef {
    return this.byBackendKey.get(key);
  }

  findByDisplayKey(key: string): ProjectFieldRef {
    return this.byDisplayKey.get(key);
  }

  /**
   * ${VALUE_412/665/123} -> ${VALUE_Device.Packet.field}. Unknown ids are left untouched.
   */
  toDisplay(template: string): string {
    return (template || '').replace(PLACEHOLDER_REGEX, (match, content: string) => {
      if (!content.startsWith(VALUE_PREFIX)) {
        return match;
      }
      const field = this.byBackendKey.get(content.substring(VALUE_PREFIX.length));
      return field ? field.displayPlaceholder : match;
    });
  }

  /**
   * ${VALUE_Device.Packet.field} -> ${VALUE_412/665/123}. Unknown names are left untouched
   * (templates are validated before saving, so this should not happen).
   */
  toBackend(template: string): string {
    return (template || '').replace(PLACEHOLDER_REGEX, (match, content: string) => {
      if (!content.startsWith(VALUE_PREFIX)) {
        return match;
      }
      const field = this.byDisplayKey.get(content.substring(VALUE_PREFIX.length));
      return field ? field.backendPlaceholder : match;
    });
  }

  tokenize(template: string): TemplateToken[] {
    const tokens: TemplateToken[] = [];
    let lastIndex = 0;
    (template || '').replace(PLACEHOLDER_REGEX, (match, content: string, offset: number) => {
      if (offset > lastIndex) {
        tokens.push({ kind: 'literal', text: template.substring(lastIndex, offset) });
      }
      if (content.startsWith(VALUE_PREFIX)) {
        const key = content.substring(VALUE_PREFIX.length);
        tokens.push({
          kind: 'value',
          text: match,
          field: this.byDisplayKey.get(key) || this.byBackendKey.get(key),
        });
      } else {
        tokens.push({ kind: 'generic', text: match });
      }
      lastIndex = offset + match.length;
      return match;
    });
    if (lastIndex < (template || '').length) {
      tokens.push({ kind: 'literal', text: template.substring(lastIndex) });
    }
    return tokens;
  }

  private addFields(packet: HPacket, fields: HPacketField[], parentPath?: string) {
    fields.forEach(field => {
      const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
      if (field.innerFields && field.innerFields.length) {
        this.addFields(packet, field.innerFields, fieldPath);
        return;
      }
      if (field.type === HPacketField.TypeEnum.OBJECT || !isSupportedField(field)) {
        return;
      }
      const backendKey = `${packet.device.id}/${packet.id}/${field.id}`;
      const displayKey = `${packet.device.deviceName}.${packet.name}.${fieldPath}`;
      const ref: ProjectFieldRef = {
        deviceId: packet.device.id,
        packetId: packet.id,
        fieldId: field.id,
        deviceName: packet.device.deviceName,
        packetName: packet.name,
        fieldPath,
        type: field.type,
        backendPlaceholder: '${' + VALUE_PREFIX + backendKey + '}',
        displayPlaceholder: '${' + VALUE_PREFIX + displayKey + '}',
      };
      this.fields.push(ref);
      this.byBackendKey.set(backendKey, ref);
      this.byDisplayKey.set(displayKey, ref);
    });
  }
}

/**
 * Validates a (display) template against the type of the output field.
 * Returns an error message or null if the template is valid.
 * An empty template is valid (it is sent as an empty string).
 */
export function validateTemplate(
  template: string,
  targetType: HPacketField.TypeEnum,
  registry: FieldPlaceholderRegistry,
  genericPlaceholders: string[],
): string | null {
  if (!template || template.trim() === '') {
    return null;
  }
  const tokens = registry.tokenize(template);

  for (const token of tokens) {
    if (token.kind === 'value') {
      if (!token.field) {
        return $localize`:@@HYT_mqtt_template_unknown_field:Unknown field ${token.text}:PLACEHOLDER:`;
      }
      if (!isCompatibleSource(token.field.type, targetType)) {
        return $localize`:@@HYT_mqtt_template_incompatible_field:Field ${token.field.fieldPath}:FIELD: of type ${token.field.type}:SOURCE_TYPE: cannot be used in a ${targetType}:TARGET_TYPE: field`;
      }
    } else if (token.kind === 'generic') {
      if (!genericPlaceholders.includes(token.text)) {
        return $localize`:@@HYT_mqtt_template_unknown_placeholder:Unknown placeholder ${token.text}:PLACEHOLDER:`;
      }
      if (targetType !== HPacketField.TypeEnum.TEXT) {
        return $localize`:@@HYT_mqtt_template_generic_only_text:Placeholder ${token.text}:PLACEHOLDER: can be used only in TEXT fields`;
      }
    }
  }

  if (targetType === HPacketField.TypeEnum.TEXT) {
    return null;
  }

  const meaningful = tokens.filter(t => !(t.kind === 'literal' && t.text.trim() === ''));
  const singlePlaceholder = meaningful.length === 1 && meaningful[0].kind === 'value';
  const literal = meaningful.every(t => t.kind === 'literal') ? template.trim() : null;

  if (isNumericType(targetType)) {
    return singlePlaceholder || /^-?(\d+(\.\d+)?|\.\d+)$/.test(literal || '') ? null :
      $localize`:@@HYT_mqtt_template_invalid_number:Insert a number or a single numeric field`;
  }

  if (targetType === HPacketField.TypeEnum.BOOLEAN) {
    return singlePlaceholder || literal === 'true' || literal === 'false' ? null :
      $localize`:@@HYT_mqtt_template_invalid_boolean:Insert true, false or a single BOOLEAN field`;
  }
  if (targetType === HPacketField.TypeEnum.TIMESTAMP) {
    return singlePlaceholder || /^\d+$/.test(literal || '') ? null :
      $localize`:@@HYT_mqtt_template_invalid_timestamp:Insert a timestamp in milliseconds or a single DATE/TIMESTAMP field`;
  }
  if (targetType === HPacketField.TypeEnum.DATE) {
    return singlePlaceholder || (literal !== null && !isNaN(Date.parse(literal))) ? null :
      $localize`:@@HYT_mqtt_template_invalid_date:Insert a valid date or a single DATE/TIMESTAMP field`;
  }
  return null;
}
