import { EnvironmentData, SchedulerData } from '../api';
import { AbstractCommand } from './abstract-command';
import { SCHEDULER_DATA_MAPPER } from './common-mappers';

export class GetEnvironmentDataCommand extends AbstractCommand<EnvironmentData> {
  public code = 'get_env';
  public message = 'Loading environment data';

  public constructor() {
    super();
  }

  public mapper = (data: any) => ({
    SelfVersion: data.sv,
    QuartzVersion: data.qv,
    DotNetVersion: data.dnv,
    CustomCssUrl: data.ccss,
    TimelineSpan: parseInt(data.ts, 10),
  });
}

export class GetDataCommand extends AbstractCommand<SchedulerData> {
  public code = 'get_data';
  public message = 'Loading scheduler data';

  public constructor() {
    super();
  }

  public mapper = SCHEDULER_DATA_MAPPER;
}
