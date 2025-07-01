import { EnvironmentData, SchedulerData } from '../api';
import { AbstractTypedCommand } from './abstract-command';
import { SCHEDULER_DATA_MAPPER } from './common-mappers';

type EnvironmentDataDto = { sv: string; qv: string; dnv: string; ts: string; ccss: string };

export class GetEnvironmentDataCommand extends AbstractTypedCommand<
  EnvironmentData,
  EnvironmentDataDto
> {
  public code = 'get_env';
  public message = 'Loading environment data';

  public constructor() {
    super({});
  }

  public typedMapper(data: EnvironmentDataDto) {
    return {
      SelfVersion: data.sv,
      QuartzVersion: data.qv,
      DotNetVersion: data.dnv,
      CustomCssUrl: data.ccss,
      TimelineSpan: parseInt(data.ts, 10),
    };
  }
}

export class GetDataCommand extends AbstractTypedCommand<
  SchedulerData,
  Parameters<typeof SCHEDULER_DATA_MAPPER>[0]
> {
  public code = 'get_data';
  public message = 'Loading scheduler data';

  public constructor() {
    super({});
  }

  public typedMapper = SCHEDULER_DATA_MAPPER;
}
