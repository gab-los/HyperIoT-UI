import { SelectableText } from './event-mail/selectableText';

/**
 * Placeholders replaced by the backend when an event action is executed
 */
export const EVENT_PLACEHOLDERS: SelectableText[] = [
  { placeholder: '${RULE_NAME}', description: $localize`:@@HYT_name_of_rule:The name of the rule` },
  { placeholder: '${RULE_DESCRIPTION}', description: $localize`:@@HYT_description_of_rule:The description of the rule` },
  { placeholder: '${RULE_RULEDEFINITION}', description: $localize`:@@HYT_definition_of_rule:The definition of the rule` },
  { placeholder: '${EVENT_TRIGGER_TIME}', description: $localize`:@@HYT_event_trigger_time:Event Trigger Time` },
  { placeholder: '${EVENT_VALUES}', description: $localize`:@@HYT_event_values:Event values` }
];
