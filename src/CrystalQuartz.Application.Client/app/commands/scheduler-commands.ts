import { AbstractCommand } from './abstract-command';
import { SchedulerData, SchedulerDetails } from '../api';

export class StartSchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'start_scheduler';
        this.message = 'Starting the scheduler';
    }
}

export class StopSchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'stop_scheduler';
        this.message = 'Stopping the scheduler';
    }
}

export class GetSchedulerDetailsCommand extends  AbstractCommand<SchedulerDetails> {
    constructor() {
        super();

        this.code = 'get_scheduler_details';
        this.message = 'Loading scheduler details';
    }
}

export class PauseSchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'pause_scheduler';
        this.message = 'Pausing all jobs';
    }
}

export class ResumeSchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'resume_scheduler';
        this.message = 'Resuming all jobs';
    }
}

export class StandbySchedulerCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'standby_scheduler';
        this.message = 'Switching to standby mode';
    }
}