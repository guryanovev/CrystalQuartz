﻿import { AbstractCommand } from './abstract-command';
import { TriggerDetails, SchedulerData, TypeInfo} from '../api';
import {
    PARSE_OPTIONAL_INT,
    PROPERTY_VALUE_MAPPER,
    SCHEDULER_DATA_MAPPER,
    TRIGGER_MAPPER,
    TYPE_MAPPER
} from './common-mappers';

/*
 * Trigger Commands
 */

export class PauseTriggerCommand extends AbstractCommand<SchedulerData> {
    code = 'pause_trigger';
    message = 'Pausing trigger';

    constructor(group: string, trigger: string) {
        super();

        this.data = {
            group: group,
            trigger: trigger
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class ResumeTriggerCommand extends AbstractCommand<SchedulerData> {
    code = 'resume_trigger';
    message = 'Resuming trigger';

    constructor(group: string, trigger: string) {
        super();
        this.data = {
            group: group,
            trigger: trigger
        };
    }

    mapper = SCHEDULER_DATA_MAPPER;
}

export class DeleteTriggerCommand extends AbstractCommand<SchedulerData> {
    code = 'delete_trigger';
    message = 'Deleting trigger';

    constructor(group: string, trigger: string) {
        super();


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
    jobClass: string;
    group: string;
    triggerType: string;
    cronExpression?: string;
    repeatForever?: boolean;
    repeatCount?: number;
    repeatInterval?: number;
    jobDataMap: { key: string; value: string; inputTypeCode: string; }[];
}

export interface AddTriggerResult {
    validationErrors: { [key: string]: string };
}

export class AddTriggerCommand extends AbstractCommand<AddTriggerResult> {
    code = 'add_trigger';
    message = 'Adding new trigger';

    constructor(form: IAddTrackerForm) {
        super();

        this.data = {
            name: form.name,
            job: form.job,
            jobClass: form.jobClass,
            group: form.group,
            triggerType: form.triggerType,
            cronExpression: form.cronExpression,
            repeatForever: form.repeatForever,
            repeatCount: form.repeatCount,
            repeatInterval: form.repeatInterval
        };

        if (form.jobDataMap) {
            var index = 0;
            form.jobDataMap.forEach(x => {
                this.data['jobDataMap[' + index + '].Key'] = x.key;
                this.data['jobDataMap[' + index + '].Value'] = x.value;
                this.data['jobDataMap[' + index + '].InputTypeCode'] = x.inputTypeCode;

                index++;
            });
            
        }
    }

    mapper = (dto: any): AddTriggerResult => ({ validationErrors: dto['ve'] });
}

export class GetTriggerDetailsCommand extends AbstractCommand<TriggerDetails> {
    code = 'get_trigger_details';
    message = 'Loading trigger details';

    constructor(group: string, trigger: string) {
        super();

        this.data = {
            group: group,
            trigger: trigger
        };
    }

    mapper = mapJobDetailsData;
}

function mapJobDetailsData(data: any): TriggerDetails {
    return {
        jobDataMap: PROPERTY_VALUE_MAPPER(data.jdm),
        trigger: TRIGGER_MAPPER(data.t)!,
        secondaryData: data.ts ? {
            priority: parseInt(data.ts.p, 10),
            misfireInstruction: parseInt(data.ts.mfi),
            description: data.ts.d
        } : null
    };
}

export class GetJobTypesCommand extends AbstractCommand<TypeInfo[]> {
    code = 'get_job_types';
    message = 'Loading allowed job types';

    constructor() {
        super();
    }

    mapper = (dto: any): TypeInfo[] => dto.i.map(TYPE_MAPPER);
}
