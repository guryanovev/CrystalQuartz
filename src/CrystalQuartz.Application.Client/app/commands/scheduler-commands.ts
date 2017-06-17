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