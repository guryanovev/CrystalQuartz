import { JobGroup } from './api';

/**
 * Provides access to basic scheduler data: groups, jobs, triggers.
 */
export interface SchedulerExplorer {
  listGroups(): JobGroup[];
}
