/// <reference path="../Definitions/jquery.d.ts"/> 

interface ActivityStatus {
    Name: string;
    Code: string;
    Value: number;
}

interface Activity {
    Name: string;
    Status: ActivityStatus;
}

interface ManagableActivity extends Activity {
    CanStart: boolean;
    CanPause: boolean;
}

interface SchedulerData {
    Name: string;
    Status: string;
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

interface ICommand<TOutput> {
    code: string;
    data: any;
    message: string;
}

class AbstractCommand<T> implements ICommand<T> {
    code: string;
    data: any;
    message: string;

    constructor() {
        this.data = {};
    }
}

class GetDataCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'get_data';
        this.message = 'Loading scheduler data';
    }
}

class StartSchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'start_scheduler';
        this.message = 'Starting the scheduler';
    }
}

class StopSchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'stop_scheduler';
        this.message = 'Stopping the scheduler';
    }
}

