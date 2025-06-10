import { JobDetails, JobProperties, SchedulerData } from '../api';
import { AbstractCommand } from './abstract-command';
import { PROPERTY_VALUE_MAPPER, SCHEDULER_DATA_MAPPER, TYPE_MAPPER } from './common-mappers';

/*
 * Job Commands
 */

export class PauseJobCommand extends AbstractCommand<SchedulerData> {
  public code = 'pause_job';
  public message = 'Pausing job';

  public constructor(group: string, job: string) {
    super();

    this.data = {
      group: group,
      job: job,
    };
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeJobCommand extends AbstractCommand<SchedulerData> {
  public code = 'resume_job';
  public message = 'Resuming job';

  public constructor(group: string, job: string) {
    super();

    this.data = {
      group: group,
      job: job,
    };
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}

export class DeleteJobCommand extends AbstractCommand<SchedulerData> {
  public code = 'delete_job';
  public message = 'Deleting job';

  public constructor(group: string, job: string) {
    super();

    this.data = {
      group: group,
      job: job,
    };
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}

export class ExecuteNowCommand extends AbstractCommand<SchedulerData> {
  public code = 'execute_job';
  public message = 'Executing job';

  public constructor(group: string, job: string) {
    super();

    this.data = {
      group: group,
      job: job,
    };
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}

export class GetJobDetailsCommand extends AbstractCommand<JobDetails> {
  public code = 'get_job_details';
  public message = 'Loading job details';

  public constructor(group: string, job: string) {
    super();

    this.data = {
      group: group,
      job: job,
    };
  }

  public mapper = mapJobDetailsData;
}

function mapJobDetailsData(data: any): JobDetails {
  return {
    JobDetails: mapJobDetails(data.jd)!,
    JobDataMap: PROPERTY_VALUE_MAPPER(data.jdm),
  };
}

function mapJobDetails(data: any): JobProperties | null {
  if (!data) {
    return null;
  }

  return {
    ConcurrentExecutionDisallowed: !!data.ced,
    Description: data.ds,
    PersistJobDataAfterExecution: !!data.pjd,
    Durable: !!data.d,
    JobType: TYPE_MAPPER(data.t)!,
    RequestsRecovery: !!data.rr,
  };
}
