import { AbstractCommand } from './abstract-command';
import { TriggerDetails, SchedulerData} from '../api';
import {
    PARSE_OPTIONAL_INT,
    PROPERTY_VALUE_MAPPER,
    SCHEDULER_DATA_MAPPER,
    TRIGGER_MAPPER
} from './common-mappers';

import __each from 'lodash/each';

/*
 * Trigger Commands
 */

export class PauseTriggerCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string, trigger: string) {
        super();

        this.code = 'pause_trigger';
        this.message = 'Pausing trigger';
        this.data = {
            group: group,
            trigger: trigger
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeTriggerCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string, trigger: string) {
        super();

        this.code = 'resume_trigger';
        this.message = 'Resuming trigger';
        this.data = {
            group: group,
            trigger: trigger
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class DeleteTriggerCommand extends AbstractCommand<SchedulerData> {
    constructor(group: string, trigger: string) {
        super();

        this.code = 'delete_trigger';
        this.message = 'Deleting trigger';
        this.data = {
            group: group,
            trigger: trigger
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export interface IAddTrackerForm {
    name: string;
    job: string;
    group: string;
    triggerType: string;
    cronExpression?: string;
    repeatForever?: boolean;
    repeatCount?: number;
    repeatInterval?: number;
    jobDataMap: { key: string; value: string; }[];
}

export class AddTriggerCommand extends AbstractCommand<any> {
    constructor(form: IAddTrackerForm) {
        super();

        this.code = 'add_trigger';
        this.message = 'Adding new trigger';
        this.data = {
            name: form.name,
            job: form.job,
            group: form.group,
            triggerType: form.triggerType,
            cronExpression: form.cronExpression,
            repeatForever: form.repeatForever,
            repeatCount: form.repeatCount,
            repeatInterval: form.repeatInterval
        };

        if (form.jobDataMap) {
            var index = 0;
            __each(form.jobDataMap, x => {
                this.data['jobDataMap[' + index + '].Key'] = x.key;
                this.data['jobDataMap[' + index + '].Value'] = x.value;

                index++;
            });

            
        }
    }
}

export class GetTriggerDetailsCommand extends AbstractCommand<TriggerDetails> {
    constructor(group: string, trigger: string) {
        super();

        this.code = 'get_trigger_details';
        this.message = 'Loading trigger details';
        this.data = {
            group: group,
            trigger: trigger
        };
    }

    mapper = mapJobDetailsData;
}

function mapJobDetailsData(data): TriggerDetails {
    return {
        jobDataMap: PROPERTY_VALUE_MAPPER(data.jdm),
        trigger: TRIGGER_MAPPER(data.t),
        secondaryData: data.ts ? {
            priority: parseInt(data.ts.p, 10),
            misfireInstruction: parseInt(data.ts.mfi),
            description: data.ts.d
        } : null
    };
}