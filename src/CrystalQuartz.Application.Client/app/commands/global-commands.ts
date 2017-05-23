import { AbstractCommand } from './abstract-command';
import { EnvironmentData, SchedulerData } from '../api';

export class GetEnvironmentDataCommand extends AbstractCommand<EnvironmentData> {
    constructor() {
        super();

        this.code = 'get_env';
        this.message = 'Loading environment data';
    }
}

export class GetDataCommand extends AbstractCommand<SchedulerData> {
    constructor() {
        super();

        this.code = 'get_data';
        this.message = 'Loading scheduler data';
    }
}