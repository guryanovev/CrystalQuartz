import { SchedulerData, SchedulerDetails } from '../api';
import { AbstractCommand } from './abstract-command';
import { PARSE_OPTIONAL_INT, SCHEDULER_DATA_MAPPER, TYPE_MAPPER } from './common-mappers';

export class StartSchedulerCommand extends AbstractCommand<SchedulerData> {
  code = 'start_scheduler';
  message = 'Starting the scheduler';

  constructor() {
    super();
  }

  mapper = SCHEDULER_DATA_MAPPER;
}

export class StopSchedulerCommand extends AbstractCommand<SchedulerData> {
  code = 'stop_scheduler';
  message = 'Stopping the scheduler';

  constructor() {
    super();
  }

  mapper = SCHEDULER_DATA_MAPPER;
}

export class GetSchedulerDetailsCommand extends AbstractCommand<SchedulerDetails> {
  code = 'get_scheduler_details';
  message = 'Loading scheduler details';

  constructor() {
    super();
  }

  mapper = mapSchedulerDetails;
}

function mapSchedulerDetails(data: any): SchedulerDetails {
  return {
    InStandbyMode: !!data.ism,
    JobStoreClustered: !!data.jsc,
    JobStoreSupportsPersistence: !!data.jsp,
    JobStoreType: TYPE_MAPPER(data.jst),
    NumberOfJobsExecuted: parseInt(data.je, 10),
    RunningSince: PARSE_OPTIONAL_INT(data.rs),
    SchedulerInstanceId: data.siid,
    SchedulerName: data.sn,
    SchedulerRemote: !!data.isr,
    SchedulerType: TYPE_MAPPER(data.t),
    Shutdown: !!data.isd,
    Started: !!data.ist,
    ThreadPoolSize: parseInt(data.tps, 10),
    ThreadPoolType: TYPE_MAPPER(data.tpt),
    Version: data.v,
  };
}

export class PauseSchedulerCommand extends AbstractCommand<SchedulerData> {
  code = 'pause_scheduler';
  message = 'Pausing all jobs';

  constructor() {
    super();
  }

  mapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeSchedulerCommand extends AbstractCommand<SchedulerData> {
  code = 'resume_scheduler';
  message = 'Resuming all jobs';

  constructor() {
    super();
  }

  mapper = SCHEDULER_DATA_MAPPER;
}

export class StandbySchedulerCommand extends AbstractCommand<SchedulerData> {
  code = 'standby_scheduler';
  message = 'Switching to standby mode';

  constructor() {
    super();
  }

  mapper = SCHEDULER_DATA_MAPPER;
}
