import { Activity } from './activity';
import { Job } from './job';

export interface JobGroup extends Activity {
  Jobs: Job[];
}
