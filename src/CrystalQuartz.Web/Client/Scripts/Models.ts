interface Activity {
    Name: string;
    Status: string;
}

interface ManagableActivity extends Activity {
    CanStart: boolean;
    CanPause: boolean;
}

interface SchedulerData extends Activity {
    InstanceId: string;
    RunningSince: DateData;
    JobsTotal: number;
    JobsExecuted: number;
    CanStart: boolean;
    CanShutdown: boolean;
    IsRemote: boolean;
    SchedulerTypeName: string;
    JobGroups: JobGroup[];
}

interface JobGroup extends ManagableActivity {
    Jobs: Job[];
}

interface Job extends ManagableActivity {
    GroupName: string;
    HasTriggers: boolean;
    UniqueName: string;
    Triggers: Trigger[];
}

interface Trigger extends ManagableActivity {
    EndDate: DateData;
    NextFireDate: DateData;
    PreviousFireDate: DateData;
    StartDate: DateData;
}

class DateData {
    Ticks: number;
    UtcDateStr: string;
    ServerDateStr: string;
}

class NullableDate {
    private _isEmpty: boolean;
    
    constructor(private date: DateData) {
        this._isEmpty = date == null;
    }

    isEmpty() {
        return this._isEmpty;
    }

    getDateString() {
        return this.date.ServerDateStr;
    }
}

class ApplicationModel {

} 