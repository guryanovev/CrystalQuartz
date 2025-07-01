import { SchedulerEventScope } from './scheduler-event-scope';
import { SchedulerEventType } from './scheduler-event-type';
import { ErrorMessage } from './error-message';

export class SchedulerEvent {
  public constructor(
    public readonly id: number,
    public readonly date: number,
    public readonly scope: SchedulerEventScope,
    public readonly eventType: SchedulerEventType,
    public readonly itemKey: string,
    public readonly fireInstanceId: string,
    public readonly faulted: boolean,
    public readonly errors: ErrorMessage[] | null
  ) {}
}
