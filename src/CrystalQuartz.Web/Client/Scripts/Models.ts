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
    RunningSince: number;
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
    EndDate: number;
    NextFireDate: number;
    PreviousFireDate: number;
    StartDate: number;
}

class NullableDate {
    private _isEmpty: boolean;
    private _date: Date;

    constructor(ticks: number) {
        if (ticks) {
            this._date = new Date(ticks);
            this._isEmpty = false;
        } else {
            this._isEmpty = true;
        }
    }

    isEmpty() {
        return this._isEmpty;
    }

    getDate() {
        return this._date;
    }
}

class ApplicationModel {

} 