import { JobGroup } from './job-group';
import { RunningJob } from './running-job';
import { SchedulerEvent } from './scheduler-event';

export interface SchedulerData {
  Name: string;
  Status: string;
  InstanceId: string;
  RunningSince: number | null;
  JobsTotal: number;
  JobsExecuted: number;
  ServerInstanceMarker: number;
  JobGroups: JobGroup[];
  InProgress: RunningJob[];
  Events: SchedulerEvent[];
}
