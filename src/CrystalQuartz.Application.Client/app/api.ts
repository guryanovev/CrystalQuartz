import __reduce from 'lodash/reduce';

type ApplicationStatusByCode = {[key: string]:SchedulerStatus};

export class SchedulerStatus {
    static Offline = new SchedulerStatus(-1, 'Offline');
    static Empty = new SchedulerStatus(0, 'empty');
    static Ready = new SchedulerStatus(1, 'ready');
    static Started = new SchedulerStatus(2, 'started');
    static Shutdown = new SchedulerStatus(3, 'shutdown');

    private static _all = [
        SchedulerStatus.Offline,
        SchedulerStatus.Empty,
        SchedulerStatus.Ready,
        SchedulerStatus.Started,
        SchedulerStatus.Shutdown];

    private static _dictionaryByCode: ApplicationStatusByCode = __reduce<SchedulerStatus, ApplicationStatusByCode>(
        SchedulerStatus._all,
        (result:ApplicationStatusByCode, item:SchedulerStatus) => {
            result[item.code] = item;
            return result;
        },
        {});

    constructor(
        public value: number,
        public code: string) {
    }

    static findByCode(code: string): SchedulerStatus {
        return this._dictionaryByCode[code];
    }
}

export class ActivityStatus {
    static Active = new ActivityStatus(0, 'Active', 'active');
    static Paused = new ActivityStatus(1, 'Paused', 'paused');
    static Mixed = new ActivityStatus(2, 'Mixed', 'mixed');
    static Complete = new ActivityStatus(3, 'Complete', 'complete');

    private static _dictionary = {
        0: ActivityStatus.Active,
        1: ActivityStatus.Paused,
        2: ActivityStatus.Mixed,
        3: ActivityStatus.Complete
    };

    constructor(
        public value: number,
        public title: string,
        public code: string) {
    }

    static findBy(value: number) {
        return ActivityStatus._dictionary[value];
    }
}

export interface Activity {
    Name: string;
    Status: ActivityStatus;
}

export interface ManagableActivity extends Activity {
}

export interface RunningJob {
    FireInstanceId: string;
    UniqueTriggerKey: string;
}

export interface SchedulerData {
    Name: string;
    Status: string;
    InstanceId: string;
    RunningSince: number;
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

export interface SchedulerDetails { //1
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
    ThreadPoolType: TypeInfo;
    Version: string;
    IsReadOnly: boolean
}

export interface EnvironmentData {
    SelfVersion: string;
    QuartzVersion: string;
    DotNetVersion: string;
    CustomCssUrl: string;
    TimelineSpan: number;
    IsReadOnly: boolean;
}

export interface JobGroup extends ManagableActivity {
    Jobs: Job[];
}

export interface Job extends ManagableActivity {
    GroupName: string;
    UniqueName: string;
    Triggers: Trigger[];
}

export interface TriggerType {
    Code: string;
    supportedMisfireInstructions: { [index:number]:string };
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

// todo: remove
export interface IGenericObject {
    Title: string;
    TypeCode: string;
    Value: any;
    Level?: number;
}

export class PropertyValue {
    constructor(
        public typeCode: string,
        public rawValue: string,
        public errorMessage: string,
        public nestedProperties: Property[],
        public isOverflow: boolean,
        public kind: number) { }

    isSingle() {
        return this.typeCode === 'single' || this.typeCode === 'error' || this.typeCode === '...';
    }
}

export class Property {
    constructor(
        public title: string,
        public value: PropertyValue) { }
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
    JobDataMap: PropertyValue;
    JobDetails: JobProperties;
}

export interface TriggerDetails {
    trigger: Trigger;
    jobDataMap: PropertyValue;
    secondaryData: {
        priority: number;
        misfireInstruction: number;
        description: string;
    }
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

export class ErrorMessage {
    constructor(
        public level: number,
        public text: string){}
}

export class SchedulerEvent {
    constructor(
        public id: number,
        public date: number,
        public scope: SchedulerEventScope,
        public eventType: SchedulerEventType,
        public itemKey: string,
        public fireInstanceId: string,
        public faulted: boolean,
        public errors: ErrorMessage[]
    ){}
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
    Trigger = 3
}

export enum SchedulerEventType {
    Fired = 0,
    Complete = 1,
    Paused = 2,
    Resumed = 3,
    Standby = 4,
    Shutdown = 5
}