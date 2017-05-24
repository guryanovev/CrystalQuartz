import { AbstractCommand } from './abstract-command';
import { SchedulerData } from '../api';

/*
 * Trigger Commands
 */

export class PauseTriggerCommand extends AbstractCommand<SchedulerData> {
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

export class ResumeTriggerCommand extends AbstractCommand<SchedulerData> {
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

export class DeleteTriggerCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string, trigger: string) {
        super();

        this.code = 'delete_trigger';
        this.message = 'Deleting trigger';
        this.data = {
            group: group,
            trigger: trigger
        };
    }
}

interface IAddTrackerForm {
    name: string;
    job: string;
    group: string;
    triggerType: string;
    cronExpression?: string;
    repeatForever?: boolean;
    repeatCount?: number;
    repeatInterval?: number;
}

export class AddTriggerCommand extends AbstractCommand<any> {
    constructor(form: IAddTrackerForm) {
        super();

        this.code = 'add_trigger';
        this.message = 'Adding new trigger';
        this.data = form;
    }
}