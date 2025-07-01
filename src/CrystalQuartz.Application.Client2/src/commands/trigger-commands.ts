import { SchedulerData, TriggerDetails, TypeInfo } from '../api';
import { AbstractTypedCommand } from './abstract-command';
import {
  PROPERTY_VALUE_MAPPER,
  PropertyValueDto,
  REQUIRED_TYPE_MAPPER,
  SCHEDULER_DATA_MAPPER,
  TRIGGER_MAPPER,
  TriggerDto,
} from './common-mappers';
import { CommandData } from './contracts';

/*
 * Trigger Commands
 */

export class PauseTriggerCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'pause_trigger';
  public message = 'Pausing trigger';

  public constructor(group: string, trigger: string) {
    super({
      group: group,
      trigger: trigger,
    });
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeTriggerCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'resume_trigger';
  public message = 'Resuming trigger';

  public constructor(group: string, trigger: string) {
    super({
      group: group,
      trigger: trigger,
    });
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export class DeleteTriggerCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'delete_trigger';
  public message = 'Deleting trigger';

  public constructor(group: string, trigger: string) {
    super({
      group: group,
      trigger: trigger,
    });
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}

export interface IAddTriggerForm {
  name: string | null;
  job: string | null;
  jobClass: string;
  group: string | null;
  triggerType: string;
  cronExpression?: string;
  repeatForever?: boolean;
  repeatCount?: number;
  repeatInterval?: number;
  jobDataMap: { key: string; value: string; inputTypeCode: string }[];
}

export interface AddTriggerResult {
  validationErrors: { [key: string]: string };
}

export type AddTriggerDto = { ve: Record<string, string> };
export class AddTriggerCommand extends AbstractTypedCommand<AddTriggerResult, AddTriggerDto> {
  public code = 'add_trigger';
  public message = 'Adding new trigger';

  public constructor(form: IAddTriggerForm) {
    const data: CommandData = {
      name: form.name,
      job: form.job,
      jobClass: form.jobClass,
      group: form.group,
      triggerType: form.triggerType,
      cronExpression: form.cronExpression,
      repeatForever: form.repeatForever,
      repeatCount: form.repeatCount,
      repeatInterval: form.repeatInterval,
    };

    if (form.jobDataMap) {
      let index = 0;
      form.jobDataMap.forEach((x) => {
        data['jobDataMap[' + index + '].Key'] = x.key;
        data['jobDataMap[' + index + '].Value'] = x.value;
        data['jobDataMap[' + index + '].InputTypeCode'] = x.inputTypeCode;

        index++;
      });
    }

    super(data);
  }

  public typedMapper = (dto: AddTriggerDto): AddTriggerResult => ({ validationErrors: dto['ve'] });
}

export class GetTriggerDetailsCommand extends AbstractTypedCommand<
  TriggerDetails,
  Parameters<typeof mapTriggerDetailsData>[0]
> {
  public code = 'get_trigger_details';
  public message = 'Loading trigger details';

  public constructor(group: string, trigger: string) {
    super({
      group: group,
      trigger: trigger,
    });
  }

  public typedMapper = mapTriggerDetailsData;
}

function mapTriggerDetailsData(data: {
  jdm: PropertyValueDto;
  t: TriggerDto;
  ts: undefined | { p: string; mfi: string; d: string };
}): TriggerDetails {
  return {
    jobDataMap: PROPERTY_VALUE_MAPPER(data.jdm),
    trigger: TRIGGER_MAPPER(data.t)!,
    secondaryData: data.ts
      ? {
          priority: parseInt(data.ts.p, 10),
          misfireInstruction: parseInt(data.ts.mfi),
          description: data.ts.d,
        }
      : null,
  };
}

export class GetJobTypesCommand extends AbstractTypedCommand<TypeInfo[], { i: string[] }> {
  public code = 'get_job_types';
  public message = 'Loading allowed job types';

  public constructor() {
    super({});
  }

  public typedMapper = (dto: { i: string[] }): TypeInfo[] => dto.i.map(REQUIRED_TYPE_MAPPER);
}
