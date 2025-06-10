import { SchedulerData, SchedulerDetails } from '../api';
import { AbstractCommand } from './abstract-command';
import { PARSE_OPTIONAL_INT, SCHEDULER_DATA_MAPPER, TYPE_MAPPER } from './common-mappers';

export class StartSchedulerCommand extends AbstractCommand<SchedulerData> {
  public code = 'start_scheduler';
  public message = 'Starting the scheduler';

  public constructor() {
    super();
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}

export class StopSchedulerCommand extends AbstractCommand<SchedulerData> {
  public code = 'stop_scheduler';
  public message = 'Stopping the scheduler';

  public constructor() {
    super();
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}

export class GetSchedulerDetailsCommand extends AbstractCommand<SchedulerDetails> {
  public code = 'get_scheduler_details';
  public message = 'Loading scheduler details';

  public constructor() {
    super();
  }

  public mapper = mapSchedulerDetails;
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
  public code = 'pause_scheduler';
  public message = 'Pausing all jobs';

  public constructor() {
    super();
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeSchedulerCommand extends AbstractCommand<SchedulerData> {
  public code = 'resume_scheduler';
  public message = 'Resuming all jobs';

  public constructor() {
    super();
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}

export class StandbySchedulerCommand extends AbstractCommand<SchedulerData> {
  public code = 'standby_scheduler';
  public message = 'Switching to standby mode';

  public constructor() {
    super();
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}
