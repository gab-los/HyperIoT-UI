import { HPacket, HPacketField } from 'core';
import { FieldPlaceholderRegistry, getRootFields, validateTemplate } from './mqtt-message-template';

describe('mqtt-message-template', () => {

  const generic = ['${EVENT_TRIGGER_TIME}', '${RULE_NAME}'];

  const field = (id: number, name: string, type: HPacketField.TypeEnum, innerFields: HPacketField[] = []): HPacketField =>
    ({ id, name, type, innerFields, multiplicity: 'SINGLE', entityVersion: 1 });

  const nested = field(130, 'child', 'FLOAT');
  const packets: HPacket[] = [{
    id: 665,
    name: 'Env',
    entityVersion: 1,
    device: { id: 412, deviceName: 'Sensor', entityVersion: 1 } as any,
    fields: [
      field(123, 'temperature', 'DOUBLE'),
      field(124, 'label', 'TEXT'),
      field(125, 'on', 'BOOLEAN'),
      field(126, 'ts', 'TIMESTAMP'),
      field(127, 'parent', 'OBJECT', [nested]),
      nested, // flat list: inner fields are returned also at root level
      { ...field(128, 'samples', 'FLOAT'), multiplicity: 'ARRAY' },
    ],
  } as HPacket];

  const registry = new FieldPlaceholderRegistry(packets);

  it('should keep only root fields', () => {
    expect(getRootFields(packets[0].fields).map(f => f.id)).toEqual([123, 124, 125, 126, 127, 128]);
  });

  it('should register leaf fields with nested paths and skip unsupported ones', () => {
    expect(registry.fields.map(f => f.displayPlaceholder)).toEqual([
      '${VALUE_Sensor.Env.temperature}',
      '${VALUE_Sensor.Env.label}',
      '${VALUE_Sensor.Env.on}',
      '${VALUE_Sensor.Env.ts}',
      '${VALUE_Sensor.Env.parent.child}',
    ]);
  });

  it('should convert between backend and display placeholders', () => {
    const backend = '${VALUE_412/665/123} gradi at ${EVENT_TRIGGER_TIME} ${VALUE_412/665/130}';
    const display = '${VALUE_Sensor.Env.temperature} gradi at ${EVENT_TRIGGER_TIME} ${VALUE_Sensor.Env.parent.child}';
    expect(registry.toDisplay(backend)).toBe(display);
    expect(registry.toBackend(display)).toBe(backend);
  });

  it('should leave unknown placeholders untouched', () => {
    expect(registry.toDisplay('${VALUE_1/2/3}')).toBe('${VALUE_1/2/3}');
    expect(registry.toBackend('${VALUE_Foo.Bar.baz}')).toBe('${VALUE_Foo.Bar.baz}');
  });

  it('should show ambiguous names with ids', () => {
    const duplicated = new FieldPlaceholderRegistry([packets[0], { ...packets[0], id: 666 }]);
    expect(duplicated.toDisplay('${VALUE_412/665/123}')).toBe('${VALUE_412/665/123}');
    expect(duplicated.toBackend('${VALUE_412/666/123}')).toBe('${VALUE_412/666/123}');
  });

  describe('validateTemplate', () => {
    const validate = (template: string, type: HPacketField.TypeEnum) => validateTemplate(template, type, registry, generic);

    it('should accept empty values', () => {
      expect(validate('', 'FLOAT')).toBeNull();
      expect(validate('  ', 'BOOLEAN')).toBeNull();
    });

    it('should accept anything known in TEXT fields', () => {
      expect(validate('${VALUE_Sensor.Env.temperature} gradi', 'TEXT')).toBeNull();
      expect(validate('${RULE_NAME}: ${VALUE_Sensor.Env.on} at ${EVENT_TRIGGER_TIME}', 'TEXT')).toBeNull();
    });

    it('should reject unknown placeholders', () => {
      expect(validate('${VALUE_Sensor.Env.missing}', 'TEXT')).not.toBeNull();
      expect(validate('${FOO}', 'TEXT')).not.toBeNull();
    });

    it('should accept a number or a single numeric placeholder in numeric fields', () => {
      expect(validate('${VALUE_Sensor.Env.temperature}', 'FLOAT')).toBeNull();
      expect(validate(' ${VALUE_Sensor.Env.parent.child} ', 'INTEGER')).toBeNull();
      expect(validate('42', 'LONG')).toBeNull();
      expect(validate('-3.5', 'DOUBLE')).toBeNull();
    });

    it('should reject invalid numeric values', () => {
      expect(validate('${VALUE_Sensor.Env.temperature} gradi', 'FLOAT')).not.toBeNull();
      expect(validate('${VALUE_Sensor.Env.label}', 'FLOAT')).not.toBeNull();
      expect(validate('${EVENT_TRIGGER_TIME}', 'FLOAT')).not.toBeNull();
      expect(validate('${VALUE_Sensor.Env.temperature} * 2', 'FLOAT')).not.toBeNull();
      expect(validate('1 + 2', 'FLOAT')).not.toBeNull();
      expect(validate('${VALUE_Sensor.Env.temperature}${VALUE_Sensor.Env.temperature}', 'FLOAT')).not.toBeNull();
    });

    it('should accept only literals or a single placeholder in BOOLEAN fields', () => {
      expect(validate('true', 'BOOLEAN')).toBeNull();
      expect(validate(' ${VALUE_Sensor.Env.on} ', 'BOOLEAN')).toBeNull();
      expect(validate('yes', 'BOOLEAN')).not.toBeNull();
      expect(validate('${VALUE_Sensor.Env.temperature}', 'BOOLEAN')).not.toBeNull();
      expect(validate('${VALUE_Sensor.Env.on}${VALUE_Sensor.Env.on}', 'BOOLEAN')).not.toBeNull();
    });

    it('should validate DATE and TIMESTAMP fields', () => {
      expect(validate('${VALUE_Sensor.Env.ts}', 'DATE')).toBeNull();
      expect(validate('1700000000000', 'TIMESTAMP')).toBeNull();
      expect(validate('2026-10-12', 'DATE')).toBeNull();
      expect(validate('tomorrow', 'TIMESTAMP')).not.toBeNull();
      expect(validate('${VALUE_Sensor.Env.temperature}', 'DATE')).not.toBeNull();
    });
  });
});
