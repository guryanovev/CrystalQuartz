import { AbstractCommand } from './abstract-command';
import { SchedulerData, JobDetails, JobProperties } from '../api';
import { SCHEDULER_DATA_MAPPER, TYPE_MAPPER, PROPERTY_VALUE_MAPPER } from './common-mappers';

/*
 * Job Commands
 */

export class PauseJobCommand extends AbstractCommand<SchedulerData> {
    code = 'pause_job';
    message = 'Pausing job';

    constructor(group: string, job: string) {
        super();


        this.data = {
            group: group,
            job: job
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeJobCommand extends AbstractCommand<SchedulerData> {
    code = 'resume_job';
    message = 'Resuming job';

    constructor(group: string, job: string) {
        super();


        this.data = {
            group: group,
            job: job
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class DeleteJobCommand extends AbstractCommand<SchedulerData> {
    code = 'delete_job';
    message = 'Deleting job';

    constructor(group: string, job: string) {
        super();


        this.data = {
            group: group,
            job: job
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class ExecuteNowCommand extends AbstractCommand<SchedulerData> {
    code = 'execute_job';
    message = 'Executing job';

    constructor(group: string, job: string) {
        super();

        this.data = {
            group: group,
            job: job
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class GetJobDetailsCommand extends AbstractCommand<JobDetails> {
    code = 'get_job_details';
    message = 'Loading job details';

    constructor(group: string, job: string) {
        super();

        this.data = {
            group: group,
            job: job
        };
    }

    mapper = mapJobDetailsData;
}

function mapJobDetailsData(data: any): JobDetails {
    return {
        JobDetails: mapJobDetails(data.jd)!,
        JobDataMap: PROPERTY_VALUE_MAPPER(data.jdm)
    };
}

function mapJobDetails(data: any): JobProperties | null {
    if (!data) {
        return null;
    }

    return {
        ConcurrentExecutionDisallowed: !!data.ced,
        Description: data.ds,
        PersistJobDataAfterExecution: !!data.pjd,
        Durable: !!data.d,
        JobType: TYPE_MAPPER(data.t)!,
        RequestsRecovery: !!data.rr
    };
}
