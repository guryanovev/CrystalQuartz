import {
    SchedulerData,
    JobGroup,
    Job,
    Trigger,
    ActivityStatus,
    RunningJob,
    SchedulerEvent,
    TriggerType,
    SimpleTriggerType,
    CronTriggerType,
    TypeInfo, ErrorMessage, PropertyValue, Property
} from '../api';

import __map from 'lodash/map';
import __keys from "lodash/keys";

export var SCHEDULER_DATA_MAPPER = mapSchedulerData;
export var TYPE_MAPPER = mapTypeInfo;
export var PARSE_OPTIONAL_INT = parseOptionalInt;
export var PROPERTY_VALUE_MAPPER = mapPropertyValue;
export var TRIGGER_MAPPER = mapSingleTrigger;

function mapSchedulerData(data): SchedulerData {
    return {
        Name: data.n,
        ServerInstanceMarker: data.sim,
        Status: data.st,
        InstanceId: data['_'],
        RunningSince: data.rs ? parseInt(data.rs, 10) : null,
        JobsTotal: data.jt ? parseInt(data.jt, 10) : 0,
        JobsExecuted: data.je ? parseInt(data.je, 10) : 0,
        JobGroups: mapJobGroups(data.jg),
        InProgress: mapInProgress(data.ip),
        Events: mapEvents(data.ev)
    };
}

function mapEvents(events): SchedulerEvent[] {
    if (!events) {
        return [];
    }

    return __map(events, (dto: string) => {
        const
            primary = dto['_'],
            parts = parseJoined(primary, 4),
            errors = dto['_err'];

        return new SchedulerEvent(
            parseInt(parts[0], 10),
            parseInt(parts[1], 10),
            parseInt(parts[3], 10),
            parseInt(parts[2], 10),
            dto['k'],
            dto['fid'],
            !!errors,
            (errors && errors !== 1) ? __map(errors, err => new ErrorMessage(err['l'] || 0, err['_'])) : null);
    });
}

function mapJobGroups(groups): JobGroup[] {
    if (!groups) {
        return [];
    }

    return __map(groups, (dto: any) => ({
        Name: dto.n,
        Status: ActivityStatus.findBy(parseInt(dto.s, 10)),
        Jobs: mapJobs(dto.jb)
    }));
}

function mapJobs(jobs): Job[] {
    if (!jobs) {
        return [];
    }

    return __map(jobs, (dto: any) => ({
        Name: dto.n,
        Status: ActivityStatus.findBy(parseInt(dto.s, 10)),
        GroupName: dto.gn,
        UniqueName: dto['_'],
        Triggers: mapTriggers(dto.tr)
    }));
}

function mapTriggers(triggers): Trigger[] {
    if (!triggers) {
        return [];
    }

    return __map(triggers, mapSingleTrigger);
}

function mapSingleTrigger(dto: any): Trigger {
    if (!dto) {
        return null;
    }

    return {
        Name: dto.n,
        Status: ActivityStatus.findBy(parseInt(dto.s, 10)),
        GroupName: dto.gn,
        EndDate: parseOptionalInt(dto.ed),
        NextFireDate: parseOptionalInt(dto.nfd),
        PreviousFireDate: parseOptionalInt(dto.pfd),
        StartDate: parseInt(dto.sd),
        TriggerType: mapTriggerType(dto),
        UniqueTriggerKey: dto['_']
    };
}

function mapTriggerType(dto): TriggerType {
    const triggerTypeCode = dto.tc,
        triggerData: string = dto.tb;

    switch (triggerTypeCode) {
        case 'simple':
            return parseSimpleTriggerType(triggerTypeCode, triggerData);
        case 'cron':
            return parseCronTriggerType(triggerTypeCode, triggerData);
        default:
            return {
                Code: triggerTypeCode,
                supportedMisfireInstructions: {}
            };
    }
}

function parseSimpleTriggerType(code: string, data: string): SimpleTriggerType {
    const parts = parseJoined(data, 3);

    return {
        Code: code,
        RepeatCount: parseInt(parts[0], 10),
        RepeatInterval: parseInt(parts[1], 10),
        TimesTriggered: parseInt(parts[2], 10),
        supportedMisfireInstructions: {
            1: 'Fire Now',
            2: 'Reschedule Now With Existing RepeatCount',
            3: 'Reschedule Now With RemainingRepeatCount',
            4: 'Reschedule Next With Remaining Count',
            5: 'Reschedule Next With Existing Count'
        }
    };
}

function parseCronTriggerType(code: string, data: string): CronTriggerType {
    return {
        Code: code,
        CronExpression: data,
        supportedMisfireInstructions: {
            1: 'Fire Once Now',
            2: 'Do Nothing'
        }
    };
}

function mapInProgress(inProgress): RunningJob[] {
    if (!inProgress) {
        return [];
    }

    return __map(inProgress, (dto: any) => {
        const parts = parseJoined(dto, 2);

        return {
            FireInstanceId: parts[0],
            UniqueTriggerKey: parts[1]
        };
    });
}

function mapTypeInfo(data: string): TypeInfo {
    if (!data) {
        return null;
    }

    const parts = parseJoined(data, 3);

    return {
        Assembly: parts[0],
        Namespace: parts[1],
        Name: parts[2]
    };
}

function parseOptionalInt(dto) {
    if (dto === null || dto === undefined) {
        return null;
    }

    return parseInt(dto, 10);
}

function parseJoined(dto: string, expectedCount: number): string[] {
    const parts = dto.split('|');

    if (parts.length === expectedCount) {
        return parts;
    }

    if (parts.length < expectedCount) {
        throw new Error('Unexpected joinde string: ' +
            dto +
            '. Expected ' +
            expectedCount +
            ' parts but got ' +
            parts.length);
    }

    const result = [];
    const tail = [];

    for (var i = 0; i < parts.length; i++) {
        if (i < expectedCount - 1) {
            result.push(parts[i]);
        } else {
            tail.push(parts[i]);
        }
    }

    result.push(tail.join('|'));

    return result;
}

function mapPropertyValue(data: any): PropertyValue {
    if (!data) {
        return null;
    }

    const
        typeCode = data["_"],
        isSingle = typeCode === 'single';

    return new PropertyValue(
        data["_"],
        isSingle ? data["v"] : null,
        data["_err"],
        isSingle ? null : mapProperties(typeCode, data['v']),
        isSingle ? false : !!data['...'],
        data["k"]);
}

function mapProperties(typeCode: string, data: any): Property[] {
    if (!data) {
        return null;
    }

    if (typeCode === 'enumerable') {
        return __map(data, (item, index) => new Property('[' + index + ']', mapPropertyValue(item)));
    } else if (typeCode === "object") {
        return __map(
            __keys(data),
            key => new Property(key, mapPropertyValue(data[key])));
    } else {
        throw new Error('Unknown type code ' + typeCode);
    }
}