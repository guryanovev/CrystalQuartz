import { PropertyValue } from './property-value';
import { Trigger } from './trigger';

export interface TriggerDetails {
  trigger: Trigger;
  jobDataMap: PropertyValue | null;
  secondaryData: {
    priority: number;
    misfireInstruction: number;
    description: string;
  } | null;
}
