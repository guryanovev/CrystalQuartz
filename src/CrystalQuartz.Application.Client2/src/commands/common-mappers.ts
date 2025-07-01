import {
  ActivityStatus,
  CronTriggerType,
  ErrorMessage,
  Job,
  JobGroup,
  Property,
  PropertyValue,
  RunningJob,
  SchedulerData,
  SchedulerEvent,
  SimpleTriggerType,
  Trigger,
  TriggerType,
  TypeInfo,
} from '../api';

export const SCHEDULER_DATA_MAPPER = mapSchedulerData;
export const TYPE_MAPPER = mapTypeInfo;
export const REQUIRED_TYPE_MAPPER = mapRequiredTypeInfo;
export const PARSE_OPTIONAL_INT = parseOptionalInt;
export const PROPERTY_VALUE_MAPPER = mapPropertyValue;
export const TRIGGER_MAPPER = mapSingleTrigger;

function mapSchedulerData(data: {
  n: string;
  sim: number;
  st: string;
  _: string;
  rs: string | undefined;
  jt: string | undefined;
  je: string | undefined;
  jg: JobGroupDto[] | null | undefined;
  ip: string[] | null | undefined;
  ev: EventDto[] | null | undefined;
}): SchedulerData {
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
    Events: mapEvents(data.ev),
  };
}

type EventDto = {
  _: string;
  _err: undefined | 1 | { l?: number; _: string }[];
  k: string;
  fid: string;
};
function mapEvents(events: EventDto[] | null | undefined): SchedulerEvent[] {
  if (!events) {
    return [];
  }

  return events.map((dto: EventDto) => {
    const primary = dto['_'];
    const parts = parseJoined(primary, 4);
    const errors = dto['_err'];

    return new SchedulerEvent(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10),
      parseInt(parts[3], 10),
      parseInt(parts[2], 10),
      dto['k'],
      dto['fid'],
      !!errors,
      errors && errors !== 1 ? errors.map((err) => new ErrorMessage(err['l'] || 0, err['_'])) : null
    );
  });
}

type JobGroupDto = {
  n: string;
  s: string;
  jb: JobDto[] | null | undefined;
};
function mapJobGroups(groups: JobGroupDto[] | null | undefined): JobGroup[] {
  if (!groups) {
    return [];
  }

  return groups.map((dto: JobGroupDto) => ({
    Name: dto.n,
    Status: ActivityStatus.findBy(parseInt(dto.s, 10)),
    Jobs: mapJobs(dto.jb),
  }));
}

type JobDto = {
  n: string;
  s: string;
  gn: string;
  _: string;
  tr: TriggerDto[] | null | undefined;
};
function mapJobs(jobs: JobDto[] | null | undefined): Job[] {
  if (!jobs) {
    return [];
  }

  return jobs.map((dto: JobDto) => ({
    Name: dto.n,
    Status: ActivityStatus.findBy(parseInt(dto.s, 10)),
    GroupName: dto.gn,
    UniqueName: dto['_'],
    Triggers: mapTriggers(dto.tr),
  }));
}

export type TriggerDto = {
  n: string;
  s: string;
  gn: string;
  ed: null | undefined | string;
  nfd: null | undefined | string;
  pfd: null | undefined | string;
  sd: string;
  _: string;
  tc: string;
  tb: string;
};
function mapTriggers(triggers: TriggerDto[] | null | undefined): Trigger[] {
  if (!triggers) {
    return [];
  }

  return triggers.map((x) => mapSingleTrigger(x)!);
}

function mapSingleTrigger(dto: TriggerDto): Trigger | null {
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
    UniqueTriggerKey: dto['_'],
  };
}

function mapTriggerType(dto: { tc: string; tb: string }): TriggerType {
  const triggerTypeCode = dto.tc;
  const triggerData: string = dto.tb;

  switch (triggerTypeCode) {
    case 'simple':
      return parseSimpleTriggerType(triggerTypeCode, triggerData);
    case 'cron':
      return parseCronTriggerType(triggerTypeCode, triggerData);
    default:
      return {
        Code: triggerTypeCode,
        supportedMisfireInstructions: {},
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
      5: 'Reschedule Next With Existing Count',
    },
  };
}

function parseCronTriggerType(code: string, data: string): CronTriggerType {
  return {
    Code: code,
    CronExpression: data,
    supportedMisfireInstructions: {
      1: 'Fire Once Now',
      2: 'Do Nothing',
    },
  };
}

function mapInProgress(inProgress: string[] | null | undefined): RunningJob[] {
  if (!inProgress) {
    return [];
  }

  return inProgress.map((dto: string) => {
    const parts = parseJoined(dto, 2);

    return {
      FireInstanceId: parts[0],
      UniqueTriggerKey: parts[1],
    };
  });
}

function mapTypeInfo(data: string | null | undefined): TypeInfo | null {
  if (!data) {
    return null;
  }

  return mapRequiredTypeInfo(data);
}

function mapRequiredTypeInfo(data: string): TypeInfo {
  const parts = parseJoined(data, 3);

  return {
    Assembly: parts[0],
    Namespace: parts[1],
    Name: parts[2],
  };
}

function parseOptionalInt(dto: null | undefined | string) {
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
    throw new Error(
      'Unexpected joined string: ' +
        dto +
        '. Expected ' +
        expectedCount +
        ' parts but got ' +
        parts.length
    );
  }

  const result = [];
  const tail = [];

  for (let i = 0; i < parts.length; i++) {
    if (i < expectedCount - 1) {
      result.push(parts[i]);
    } else {
      tail.push(parts[i]);
    }
  }

  result.push(tail.join('|'));

  return result;
}

export type PropertyValueDto =
  | null
  | undefined
  | { _: 'single'; v: string; k: number }
  | { _: 'error'; _err: string }
  | { _: '...' }
  | { _: 'object'; v: Record<string, PropertyValueDto>; '...'?: boolean }
  | { _: 'enumerable'; v: PropertyValueDto[]; '...'?: boolean };

function mapPropertyValue(data: PropertyValueDto): PropertyValue | null {
  if (!data) {
    return null;
  }

  const typeCode = data['_'];

  if (typeCode === '...') {
    return { typeCode };
  }

  if (typeCode === 'single') {
    return { typeCode: typeCode, rawValue: data['v'], kind: data.k };
  }

  if (typeCode === 'error') {
    return { typeCode: typeCode, errorMessage: data['_err'] };
  }

  if (typeCode === 'object') {
    return {
      typeCode: typeCode,
      nestedProperties: mapObjectProperties(data.v),
      overflowed: data['...'] ? true : undefined,
    };
  }

  if (typeCode === 'enumerable') {
    return {
      typeCode: typeCode,
      nestedValues: mapEnumerableValues(data.v),
      overflowed: data['...'] ? true : undefined,
    };
  }

  throw new Error('Unexpected property type ' + typeCode);

  // const isSingle = typeCode === 'single';
  //
  // return new PropertyValue(
  //   data['_'],
  //   isSingle ? data['v'] : null,
  //   data['_err'],
  //   isSingle ? null : mapProperties(typeCode, data['v']),
  //   isSingle ? false : !!data['...'],
  //   data['k']
  // );
}

function mapObjectProperties(
  data: Record<string, PropertyValueDto> | null | undefined
): Property[] {
  if (!data) {
    return [];
  }

  return Object.keys(data).map((key) => new Property(key, mapPropertyValue(data[key])!));
}

function mapEnumerableValues(
  data: PropertyValueDto[] | null | undefined
): (PropertyValue | null)[] {
  if (!data) {
    return [];
  }

  return data.map((item: PropertyValueDto) => mapPropertyValue(item));
}
