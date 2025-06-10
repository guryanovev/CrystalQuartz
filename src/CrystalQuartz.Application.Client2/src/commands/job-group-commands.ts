import { SchedulerData } from '../api';
import { AbstractCommand } from './abstract-command';
import { SCHEDULER_DATA_MAPPER } from './common-mappers';

/*
 * Group Commands
 */

export class PauseGroupCommand extends AbstractCommand<SchedulerData> {
  public code = 'pause_group';
  public message = 'Pausing group';

  public constructor(group: string) {
    super();
    this.data = {
      group: group,
    };
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeGroupCommand extends AbstractCommand<SchedulerData> {
  public code = 'resume_group';
  public message = 'Resuming group';

  public constructor(group: string) {
    super();
    this.data = {
      group: group,
    };
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}

export class DeleteGroupCommand extends AbstractCommand<SchedulerData> {
  public code = 'delete_group';
  public message = 'Deleting group';

  public constructor(group: string) {
    super();
    this.data = {
      group: group,
    };
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}
