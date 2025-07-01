import { TriggerType } from './trigger-type';

export interface SimpleTriggerType extends TriggerType {
  RepeatCount: number;
  RepeatInterval: number;
  TimesTriggered: number;
}
