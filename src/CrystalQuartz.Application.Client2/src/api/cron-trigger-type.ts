import { TriggerType } from './trigger-type';

export interface CronTriggerType extends TriggerType {
  CronExpression: string;
}
