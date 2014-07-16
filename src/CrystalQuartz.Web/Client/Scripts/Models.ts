/// <reference path="../Definitions/jquery.d.ts"/> 
/// <reference path="../Definitions/john-smith-latest.d.ts"/> 

class ApplicationModel {
    onDataChanged = new js.Event<SchedulerData>();

    setData(data: SchedulerData) {
        this.onDataChanged.trigger(data);
    }
}

class Status {
    constructor(public code: string, public name: string) {
    }

    static Active = new Status('active', 'Active');
    static Paused = new Status('paused', 'Paused');
    static Mixed = new Status('mixed', 'Mixed');

    private static _all = [Status.Active, Status.Paused, Status.Mixed];

    static byCode(code: string): Status {
        return _.find(Status._all, status => status.code === code);
    }
}

interface IGroupKey {
    group: string;
    status: Status;
}

interface IJobKey extends IGroupKey {
    job: string;
}

interface ITriggerKey extends IJobKey {
    trigger: string;
}

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

interface TriggerData {
    Trigger: Trigger;
}

interface Property {
    Name: string;
    TypeName: string;
    Value: string;
}

interface JobDetails {
    JobDataMap: Property[];
    JobProperties: Property[];
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

class PauseTriggerCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string, trigger: string) {
        super();

        this.code = 'pause_trigger';
        this.message = 'Pausing trigger';
        this.data = {
            group: group,
            trigger: trigger
        };
    }
}

class ResumeTriggerCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string, trigger: string) {
        super();

        this.code = 'resume_trigger';
        this.message = 'Resuming trigger';
        this.data = {
            group: group,
            trigger: trigger
        };
    }
}

class GetJobDetailsCommand extends AbstractCommand<JobDetails> {
    constructor(group: string, job: string) {
        super();

        this.code = 'get_job_details';
        this.message = 'Loading job details';
        this.data = {
            group: group,
            job: job
        };
    }
}

