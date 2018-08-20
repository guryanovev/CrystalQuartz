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
    TypeInfo, ErrorMessage
} from '../api';

import __map from 'lodash/map';

export var SCHEDULER_DATA_MAPPER = mapSchedulerData;
export var TYPE_MAPPER = mapTypeInfo;

export var PARSE_OPTIONAL_INT = parseOptionalInt;

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
            errors ? __map(errors, err => new ErrorMessage(err['l'], err['_'])): null
        );

        // return {
        //     Id: parseInt(parts[0], 10),
        //     Date: parseInt(parts[1], 10),
        //     Data: {
        //         Scope: parseInt(parts[3], 10),
        //         EventType: parseInt(parts[2], 10),
        //         ItemKey: parts[4],
        //         FireInstanceId: dto['fid']
        //     }
        // };
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

    return __map(triggers, (dto: any) => ({
        Name: dto.n,
        Status: ActivityStatus.findBy(parseInt(dto.s, 10)),
        GroupName: dto.gn,
        EndDate: parseOptionalInt(dto.ed),
        NextFireDate: parseOptionalInt(dto.nfd),
        PreviousFireDate: parseOptionalInt(dto.pfd),
        StartDate: parseInt(dto.sd),
        TriggerType: mapTriggerType(dto),
        UniqueTriggerKey: dto['_']
    }));
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
                Code: triggerTypeCode
            };
    }
}

function parseSimpleTriggerType(code: string, data: string): SimpleTriggerType {
    const parts = parseJoined(data, 3);

    return {
        Code: code,
        RepeatCount: parseInt(parts[0], 10),
        RepeatInterval: parseInt(parts[1], 10),
        TimesTriggered: parseInt(parts[2], 10)
    };
}

function parseCronTriggerType(code: string, data: string): CronTriggerType {
    return {
        Code: code,
        CronExpression: data
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