import { TypeInfo } from './type-info';

export interface JobProperties {
  Description: string;
  ConcurrentExecutionDisallowed: boolean;
  PersistJobDataAfterExecution: boolean;
  RequestsRecovery: boolean;
  Durable: boolean;
  JobType: TypeInfo;
}
