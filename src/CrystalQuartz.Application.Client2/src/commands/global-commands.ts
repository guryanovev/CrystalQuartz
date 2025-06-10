import { EnvironmentData, SchedulerData } from '../api';
import { AbstractCommand } from './abstract-command';
import { SCHEDULER_DATA_MAPPER } from './common-mappers';

export class GetEnvironmentDataCommand extends AbstractCommand<EnvironmentData> {
  code = 'get_env';
  message = 'Loading environment data';

  constructor() {
    super();
  }

  mapper = (data: any) => ({
    SelfVersion: data.sv,
    QuartzVersion: data.qv,
    DotNetVersion: data.dnv,
    CustomCssUrl: data.ccss,
    TimelineSpan: parseInt(data.ts, 10),
  });
}

export class GetDataCommand extends AbstractCommand<SchedulerData> {
  code = 'get_data';
  message = 'Loading scheduler data';

  constructor() {
    super();
  }

  mapper = SCHEDULER_DATA_MAPPER;
}
