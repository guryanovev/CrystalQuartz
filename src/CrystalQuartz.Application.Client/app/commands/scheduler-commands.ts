import { AbstractCommand } from './abstract-command';
import { SchedulerData, SchedulerDetails } from '../api';

import {
    SCHEDULER_DATA_MAPPER,
    TYPE_MAPPER,
    PARSE_OPTIONAL_INT
} from './common-mappers';

export class StartSchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'start_scheduler';
        this.message = 'Starting the scheduler';
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class StopSchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'stop_scheduler';
        this.message = 'Stopping the scheduler';
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class GetSchedulerDetailsCommand extends  AbstractCommand<SchedulerDetails> {
    constructor() {
        super();

        this.code = 'get_scheduler_details';
        this.message = 'Loading scheduler details';
    }

    mapper = mapSchedulerDetails;
}

function mapSchedulerDetails(data): SchedulerDetails {
    return {
        InStandbyMode: !!data.ism,
        JobStoreClustered: !!data.jsc,
        JobStoreSupportsPersistence: !!data.jsp,
        JobStoreType: TYPE_MAPPER(data.jst),
        NumberOfJobsExecuted: parseInt(data.je, 10),
        RunningSince: PARSE_OPTIONAL_INT(data.rs),
        SchedulerInstanceId: data.siid,
        SchedulerName: data.sn,
        SchedulerRemote: !!data.isr,
        SchedulerType: TYPE_MAPPER(data.t),
        Shutdown: !!data.isd,
        Started: !!data.ist,
        ThreadPoolSize: parseInt(data.tps, 10),
        ThreadPoolType: TYPE_MAPPER(data.tpt),
        Version: data.v
    };
}

export class PauseSchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'pause_scheduler';
        this.message = 'Pausing all jobs';
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeSchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'resume_scheduler';
        this.message = 'Resuming all jobs';
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class StandbySchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'standby_scheduler';
        this.message = 'Switching to standby mode';
    }

    mapper = SCHEDULER_DATA_MAPPER;
}