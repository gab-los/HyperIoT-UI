import {FieldType, IRulePart, RuleOperator} from "./rule-part.interface";
import { HPacketField, RuleNode } from "core";
import { ValueRulePart } from "./value-rule-part";
import { SelectOption } from "../../hyt-select/hyt-select.component";
import { Validators } from "@angular/forms";
import { operationNameLabels } from "./operations.utils";

export class ConditionRulePart implements IRulePart {
  fieldType: FieldType = 'select';
  label = $localize`:@@HYT_condition_rule_part_label:Condition`;
  validators = [ Validators.required ];

  fieldConditionOptions: RuleOperator[] = [];
  hPacketFieldType: HPacketField.TypeEnum;

  constructor(
    operators: RuleOperator[],
    hPacketFieldType: HPacketField.TypeEnum,
  ) {
    this.hPacketFieldType = hPacketFieldType;
    this.fieldConditionOptions = operators
      .filter(o => o.appliance === RuleNode.ApplianceEnum.FIELD)
      .filter(o => o.supportedFieldTypes.includes(this.hPacketFieldType));
  }

  generateChildrenRuleParts(): Map<string, IRulePart> {
    const fieldPartsMap = new Map<string, IRulePart>();

    // add field conditions
    this.fieldConditionOptions.forEach(pc => {
      if (pc.operator !== 'isTrue' && pc.operator !== 'isFalse') {
        fieldPartsMap.set(pc.operator, new ValueRulePart(this.hPacketFieldType));
      }
    });

    return fieldPartsMap;
  }

  generateOptions(): SelectOption[] {
    return this.fieldConditionOptions.map(x => ({
      value: x.operator,
      label: operationNameLabels.find(y => y.name === x.name).label,
    }));
  }

  ruleify = (value: string): string => {
    return '" ' + value + ' ';
  }

  prettify = (value: string): string => {
    if (!value) {
      return '';
    }
    const operatorName = this.fieldConditionOptions.find(x => x.operator === value).name;
    return ' ' + operationNameLabels.find(x => x.name === operatorName).pretty + ' ';
  }
}
