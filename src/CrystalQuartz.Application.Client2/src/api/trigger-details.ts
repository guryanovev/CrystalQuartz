import { Trigger } from './trigger';
import { PropertyValue } from './property-value';

export interface TriggerDetails {
  trigger: Trigger;
  jobDataMap: PropertyValue | null;
  secondaryData: {
    priority: number;
    misfireInstruction: number;
    description: string;
  } | null;
}
