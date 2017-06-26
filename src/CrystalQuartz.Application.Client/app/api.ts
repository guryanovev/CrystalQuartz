export interface ActivityStatus {
    Name: string;
    Code: string;
    Value: number;
}

export interface Activity {
    Name: string;
    Status: ActivityStatus;
}

export interface ManagableActivity extends Activity {
    CanStart: boolean;
    CanPause: boolean;
    CanDelete: boolean;
}

export interface SchedulerData {
    Name: string;
    Status: string;
    InstanceId: string;
    RunningSince: number;
    JobsTotal: number;
    JobsExecuted: number;
    CanStart: boolean;
    CanShutdown: boolean;
    IsRemote: boolean;
    SchedulerTypeName: string;
    JobGroups: JobGroup[];
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
    JobStoreType: TypeInfo;
    NumberOfJobsExecuted: number;
    RunningSince: number|null;
    SchedulerInstanceId: string;
    SchedulerName: string;
    SchedulerRemote: boolean;
    SchedulerType: TypeInfo;
    Shutdown: boolean;
    Started: boolean;
    ThreadPoolSize: number;
    ThreadPoolType: number;
    Version: string;
}

export interface EnvironmentData {
    SelfVersion: string;
    QuartzVersion: string;
    DotNetVersion: string;
    CustomCssUrl: string;
}

export interface JobGroup extends ManagableActivity {
    Jobs: Job[];
}

export interface Job extends ManagableActivity {
    GroupName: string;
    HasTriggers: boolean;
    UniqueName: string;
    Triggers: Trigger[];
}

export interface TriggerType {
    Code: string;
}

export interface SimpleTriggerType extends TriggerType {
    RepeatCount: number;
    RepeatInterval: number;
    TimesTriggered: number;
}

export interface CronTriggerType extends TriggerType {
    CronExpression: string;
}

export interface Trigger extends ManagableActivity {
    GroupName: string;
    EndDate: number; /* todo */
    NextFireDate: number; /* todo */
    PreviousFireDate: number; /* todo */
    StartDate: number; /* todo */
    TriggerType: TriggerType;
    UniqueTriggerKey: string;
}

export interface TriggerData {
    Trigger: Trigger;
}

/**
 todo
 */
export interface Property {
    Name: string;
    TypeName: string;
    Value: string;
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
    JobDataMap: Property[];
    JobDetails: JobProperties;
}

export class DateData {
    Ticks: number;
    UtcDateStr: string;
    ServerDateStr: string;
}

export class NullableDate {
    private _isEmpty: boolean;

    constructor(private date: number) {
        this._isEmpty = date == null;
    }

    isEmpty() {
        return this._isEmpty;
    }

    getDate(): number {
        return this.date;
    }
}