import { TypeInfo } from './type-info';

export interface SchedulerDetails {
  InStandbyMode: boolean;
  JobStoreClustered: boolean;
  JobStoreSupportsPersistence: boolean;
  JobStoreType: TypeInfo | null;
  NumberOfJobsExecuted: number;
  RunningSince: number | null;
  SchedulerInstanceId: string;
  SchedulerName: string;
  SchedulerRemote: boolean;
  SchedulerType: TypeInfo | null;
  Shutdown: boolean;
  Started: boolean;
  ThreadPoolSize: number;
  ThreadPoolType: TypeInfo | null;
  Version: string;
}
