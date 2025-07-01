import { Activity } from './activity';
import { Trigger } from './trigger';

export interface Job extends Activity {
  GroupName: string;
  UniqueName: string;
  Triggers: Trigger[];
}
