import { SchedulerData } from '../api';
import { AbstractTypedCommand } from './abstract-command';
import { SCHEDULER_DATA_MAPPER } from './common-mappers';

/*
 * Group Commands
 */

export class PauseGroupCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'pause_group';
  public message = 'Pausing group';

  public constructor(group: string) {
    super({
      group: group,
    });
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeGroupCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'resume_group';
  public message = 'Resuming group';

  public constructor(group: string) {
    super({
      group: group,
    });
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class DeleteGroupCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'delete_group';
  public message = 'Deleting group';

  public constructor(group: string) {
    super({
      group: group,
    });
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}
