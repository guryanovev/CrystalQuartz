import { Activity } from './activity';
import { TriggerType } from './trigger-type';

export interface Trigger extends Activity {
  GroupName: string;
  EndDate: number | null;
  NextFireDate: number | null;
  PreviousFireDate: number | null;
  StartDate: number;
  TriggerType: TriggerType;
  UniqueTriggerKey: string;
}
