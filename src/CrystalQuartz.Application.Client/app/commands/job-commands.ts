import { AbstractCommand } from './abstract-command';
import { SchedulerData, JobDetails } from '../api';

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
}