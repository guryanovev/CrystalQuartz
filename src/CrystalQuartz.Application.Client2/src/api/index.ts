type ApplicationStatusByCode = { [key: string]: SchedulerStatus };

export class SchedulerStatus {
  public static readonly Offline = new SchedulerStatus(-1, 'Offline');
  public static readonly Empty = new SchedulerStatus(0, 'empty');
  public static readonly Ready = new SchedulerStatus(1, 'ready');
  public static readonly Started = new SchedulerStatus(2, 'started');
  public static readonly Shutdown = new SchedulerStatus(3, 'shutdown');

  private static readonly _all = [
    SchedulerStatus.Offline,
    SchedulerStatus.Empty,
    SchedulerStatus.Ready,
    SchedulerStatus.Started,
    SchedulerStatus.Shutdown,
  ];

  private static readonly _dictionaryByCode: ApplicationStatusByCode = SchedulerStatus._all.reduce(
    (result: ApplicationStatusByCode, item: SchedulerStatus) => {
      result[item.code] = item;
      return result;
    },
    {}
  );

  public constructor(
    public readonly value: number,
    public readonly code: string
  ) {}

  public static findByCode(code: string): SchedulerStatus | undefined {
    return this._dictionaryByCode[code];
  }
}

export enum ActivityStatusCode {
  Active = 0,
  Paused = 1,
  Mixed = 2,
  Complete = 3,
}

export class ActivityStatus {
  public static readonly Active = new ActivityStatus(ActivityStatusCode.Active, 'Active', 'active');
  public static readonly Paused = new ActivityStatus(ActivityStatusCode.Paused, 'Paused', 'paused');
  public static readonly Mixed = new ActivityStatus(ActivityStatusCode.Mixed, 'Mixed', 'mixed');
  public static readonly Complete = new ActivityStatus(
    ActivityStatusCode.Complete,
    'Complete',
    'complete'
  );

  private static readonly _dictionary: Record<ActivityStatusCode, ActivityStatus> = {
    0: ActivityStatus.Active,
    1: ActivityStatus.Paused,
    2: ActivityStatus.Mixed,
    3: ActivityStatus.Complete,
  };

  public constructor(
    public readonly value: number,
    public readonly title: string,
    public readonly code: string
  ) {}

  public static findBy(value: ActivityStatusCode): ActivityStatus {
    return ActivityStatus._dictionary[value];
  }
}

export interface Activity {
  Name: string;
  Status: ActivityStatus;
}

export interface RunningJob {
  FireInstanceId: string;
  UniqueTriggerKey: string;
}

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

export interface TypeInfo {
  Namespace: string;
  Name: string;
  Assembly: string;
}

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

export interface EnvironmentData {
  SelfVersion: string;
  QuartzVersion: string;
  DotNetVersion: string;
  CustomCssUrl: string;
  TimelineSpan: number;
}

export interface JobGroup extends Activity {
  Jobs: Job[];
}

export interface Job extends Activity {
  GroupName: string;
  UniqueName: string;
  Triggers: Trigger[];
}

export interface TriggerType {
  Code: string;
  supportedMisfireInstructions: { [index: number]: string };
}

export interface SimpleTriggerType extends TriggerType {
  RepeatCount: number;
  RepeatInterval: number;
  TimesTriggered: number;
}

export interface CronTriggerType extends TriggerType {
  CronExpression: string;
}

export interface Trigger extends Activity {
  GroupName: string;
  EndDate: number | null;
  NextFireDate: number | null;
  PreviousFireDate: number | null;
  StartDate: number;
  TriggerType: TriggerType;
  UniqueTriggerKey: string;
}

export interface TriggerData {
  Trigger: Trigger;
}

export type ObjectPropertyValue = {
  typeCode: 'object';
  nestedProperties: Property[];
  overflowed?: true;
};
export type EnumerablePropertyValue = {
  typeCode: 'enumerable';
  nestedValues: (PropertyValue | null)[];
  overflowed?: true;
};
export type SinglePropertyValue = { typeCode: 'single'; kind: number; rawValue: string };
export type ErrorPropertyValue = { typeCode: 'error'; errorMessage: string };
export type EllipsisPropertyValue = { typeCode: '...' };
export type PropertyValue =
  | SinglePropertyValue
  | ErrorPropertyValue
  | EllipsisPropertyValue
  | ObjectPropertyValue
  | EnumerablePropertyValue;

// export class PropertyValue {
//   public constructor(
//     public readonly typeCode: string,
//     public readonly rawValue: string | null,
//     public readonly errorMessage: string,
//     public readonly nestedProperties: Property[] | null,
//     public readonly isOverflow: boolean,
//     public readonly kind: number
//   ) {}
//
//   public isSingle(): boolean {
//     return this.typeCode === 'single' || this.typeCode === 'error' || this.typeCode === '...';
//   }
// }

export class Property {
  public constructor(
    public readonly title: string,
    public readonly value: PropertyValue
  ) {}
}

export interface JobProperties {
  Description: string;
  ConcurrentExecutionDisallowed: boolean;
  PersistJobDataAfterExecution: boolean;
  RequestsRecovery: boolean;
  Durable: boolean;
  JobType: TypeInfo;
}

export interface JobDetails {
  JobDataMap: PropertyValue | null;
  JobDetails: JobProperties;
}

export interface TriggerDetails {
  trigger: Trigger;
  jobDataMap: PropertyValue | null;
  secondaryData: {
    priority: number;
    misfireInstruction: number;
    description: string;
  } | null;
}

export class NullableDate {
  public readonly isEmpty = this.date == null;

  public constructor(public readonly date: number | null) {}
}

export class ErrorMessage {
  public constructor(
    public readonly level: number,
    public readonly text: string
  ) {}
}

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

export interface InputType {
  code: string;
  label: string;
  hasVariants: boolean;
}

export interface InputTypeVariant {
  value: string;
  label: string;
}

export enum SchedulerEventScope {
  Scheduler = 0,
  Group = 1,
  Job = 2,
  Trigger = 3,
}

export enum SchedulerEventType {
  Fired = 0,
  Complete = 1,
  Paused = 2,
  Resumed = 3,
  Standby = 4,
  Shutdown = 5,
}
