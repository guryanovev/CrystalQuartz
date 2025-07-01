import { SchedulerData, SchedulerDetails } from '../api';
import { AbstractTypedCommand } from './abstract-command';
import { PARSE_OPTIONAL_INT, SCHEDULER_DATA_MAPPER, TYPE_MAPPER } from './common-mappers';
import { DtoBoolean } from './dto/dto-boolean';

export class StartSchedulerCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'start_scheduler';
  public message = 'Starting the scheduler';

  public constructor() {
    super({});
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class StopSchedulerCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'stop_scheduler';
  public message = 'Stopping the scheduler';

  public constructor() {
    super({});
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class GetSchedulerDetailsCommand extends AbstractTypedCommand<
  SchedulerDetails,
  Parameters<typeof mapSchedulerDetails>[0]
> {
  public code = 'get_scheduler_details';
  public message = 'Loading scheduler details';

  public constructor() {
    super({});
  }

  public typedMapper = mapSchedulerDetails;
}

function mapSchedulerDetails(data: {
  ism: DtoBoolean;
  jsc: DtoBoolean;
  jsp: DtoBoolean;
  jst: string;
  je: string;
  rs: string;
  siid: string;
  sn: string;
  isr: DtoBoolean;
  t: string;
  isd: DtoBoolean;
  ist: DtoBoolean;
  tps: string;
  tpt: string;
  v: string;
}): SchedulerDetails {
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

export class PauseSchedulerCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'pause_scheduler';
  public message = 'Pausing all jobs';

  public constructor() {
    super({});
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeSchedulerCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'resume_scheduler';
  public message = 'Resuming all jobs';

  public constructor() {
    super({});
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class StandbySchedulerCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'standby_scheduler';
  public message = 'Switching to standby mode';

  public constructor() {
    super({});
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}
