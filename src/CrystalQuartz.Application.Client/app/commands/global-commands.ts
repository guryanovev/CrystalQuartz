import { AbstractCommand } from './abstract-command';
import { EnvironmentData, SchedulerData } from '../api';

import { SCHEDULER_DATA_MAPPER } from './common-mappers';

export class GetEnvironmentDataCommand extends AbstractCommand<EnvironmentData> {
    constructor() {
        super();

        this.code = 'get_env';
        this.message = 'Loading environment data';
    }

    mapper = (data: any) => ({
        SelfVersion: data.sv,
        QuartzVersion: data.qv,
        DotNetVersion: data.dnv,
        CustomCssUrl: data.ccss,
        TimelineSpan: parseInt(data.ts, 10),
        IsReadOnly: data.iro
    });
}

export class GetDataCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'get_data';
        this.message = 'Loading scheduler data';
    }

    mapper = SCHEDULER_DATA_MAPPER;
}
