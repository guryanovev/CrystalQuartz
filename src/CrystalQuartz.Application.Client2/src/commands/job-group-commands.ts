import { AbstractCommand } from './abstract-command';
import { SchedulerData } from '../api';
import { SCHEDULER_DATA_MAPPER } from './common-mappers';

/*
 * Group Commands
 */

export class PauseGroupCommand extends AbstractCommand<SchedulerData> {
    code = 'pause_group';
    message = 'Pausing group';

    constructor(group: string) {
        super();
        this.data = {
            group: group
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeGroupCommand extends AbstractCommand<SchedulerData> {
    code = 'resume_group';
    message = 'Resuming group';

    constructor(group: string) {
        super();
        this.data = {
            group: group
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class DeleteGroupCommand extends AbstractCommand<SchedulerData> {
    code = 'delete_group';
    message = 'Deleting group';

    constructor(group: string) {
        super();
        this.data = {
            group: group
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}
