import { JobDetails, JobProperties, SchedulerData } from '../api';
import { AbstractTypedCommand } from './abstract-command';
import {
  PROPERTY_VALUE_MAPPER,
  PropertyValueDto,
  REQUIRED_TYPE_MAPPER,
  SCHEDULER_DATA_MAPPER,
} from './common-mappers';
import { DtoBoolean } from './dto/dto-boolean';

/*
 * Job Commands
 */

export class PauseJobCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'pause_job';
  public message = 'Pausing job';

  public constructor(group: string, job: string) {
    super({
      group: group,
      job: job,
    });
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeJobCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'resume_job';
  public message = 'Resuming job';

  public constructor(group: string, job: string) {
    super({
      group: group,
      job: job,
    });
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class DeleteJobCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'delete_job';
  public message = 'Deleting job';

  public constructor(group: string, job: string) {
    super({
      group: group,
      job: job,
    });
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class ExecuteNowCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'execute_job';
  public message = 'Executing job';

  public constructor(group: string, job: string) {
    super({
      group: group,
      job: job,
    });
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class GetJobDetailsCommand extends AbstractTypedCommand<
  JobDetails,
  Parameters<typeof mapJobDetailsData>[0]
> {
  public code = 'get_job_details';
  public message = 'Loading job details';

  public constructor(group: string, job: string) {
    super({
      group: group,
      job: job,
    });
  }

  public typedMapper = mapJobDetailsData;
}

function mapJobDetailsData(data: {
  jd: JobDetailsDto | null | undefined;
  jdm: PropertyValueDto;
}): JobDetails {
  return {
    JobDetails: mapJobDetails(data.jd),
    JobDataMap: PROPERTY_VALUE_MAPPER(data.jdm),
  };
}

function mapJobDetails(data: JobDetailsDto | null | undefined): JobProperties | null {
  if (!data) {
    return null;
  }

  return mapRequiredJobDetails(data);
}

type JobDetailsDto = {
  ced: DtoBoolean;
  pjd: DtoBoolean;
  ds: string;
  d: DtoBoolean;
  t: string;
  rr: DtoBoolean;
};
function mapRequiredJobDetails(data: JobDetailsDto): JobProperties {
  return {
    ConcurrentExecutionDisallowed: !!data.ced,
    Description: data.ds,
    PersistJobDataAfterExecution: !!data.pjd,
    Durable: !!data.d,
    JobType: REQUIRED_TYPE_MAPPER(data.t),
    RequestsRecovery: !!data.rr,
  };
}
