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

export interface Property {
    Name: string;
    TypeName: string;
    Value: string;
}

export interface JobDetails {
    JobDataMap: Property[];
    JobProperties: Property[];
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