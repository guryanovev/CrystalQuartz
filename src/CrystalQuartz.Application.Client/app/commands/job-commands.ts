import { AbstractCommand } from './abstract-command';
import { SchedulerData, JobDetails, JobProperties, IGenericObject } from '../api';
import { SCHEDULER_DATA_MAPPER, TYPE_MAPPER } from './common-mappers';

import __map from 'lodash/map';

/*
 * Job Commands
 */

export class PauseJobCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string, job: string) {
        super();

        this.code = 'pause_job';
        this.message = 'Pausing job';
        this.data = {
            group: group,
            job: job
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeJobCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string, job: string) {
        super();

        this.code = 'resume_job';
        this.message = 'Resuming job';
        this.data = {
            group: group,
            job: job
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class DeleteJobCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string, job: string) {
        super();

        this.code = 'delete_job';
        this.message = 'Deleting job';
        this.data = {
            group: group,
            job: job
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class ExecuteNowCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string, job: string) {
        super();

        this.code = 'execute_job';
        this.message = 'Executing job';
        this.data = {
            group: group,
            job: job
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class GetJobDetailsCommand extends AbstractCommand<JobDetails> {
    constructor(group: string, job: string) {
        super();

        this.code = 'get_job_details';
        this.message = 'Loading job details';
        this.data = {
            group: group,
            job: job
        };
    }

    mapper = mapJobDetailsData;
}

function mapJobDetailsData(data): JobDetails {
    return {
        JobDetails: mapJobDetails(data.jd),
        JobDataMap: data.jdm ? __map(data.jdm, mapProperty) : []
    };
}

function mapJobDetails(data): JobProperties {
    if (!data) {
        return null;
    }

    return {
        ConcurrentExecutionDisallowed: !!data.ced,
        Description: data.ds,
        PersistJobDataAfterExecution: !!data.pjd,
        Durable: !!data.d,
        JobType: TYPE_MAPPER(data.t),
        RequestsRecovery: !!data.rr
    };
}

function mapProperty(data): IGenericObject {
    if (!data) {
        return null;
    }

    return {
        Title: data.t,
        TypeCode: data.tc,
        Value: mapPropertyValue(data.tc, data.val)
    };
}

function mapPropertyValue(typeCode: string, data:any): any {
    if (data === null || data === undefined) {
        return null;
    }

    if (typeCode === 'Array' || typeCode === 'Object') {
        return __map(data, mapProperty);
    }

    return data;
}