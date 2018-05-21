import { AbstractCommand } from './abstract-command';
import { SchedulerData } from '../api';
import { SCHEDULER_DATA_MAPPER } from './common-mappers';

/*
 * Group Commands
 */

export class PauseGroupCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string) {
        super();

        this.code = 'pause_group';
        this.message = 'Pausing group';
        this.data = {
            group: group
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeGroupCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string) {
        super();

        this.code = 'resume_group';
        this.message = 'Resuming group';
        this.data = {
            group: group
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class DeleteGroupCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string) {
        super();

        this.code = 'delete_group';
        this.message = 'Deleting group';
        this.data = {
            group: group
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}