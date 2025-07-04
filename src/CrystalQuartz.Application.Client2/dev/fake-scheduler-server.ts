﻿import { SchedulerStatus } from '../src/api';
import { FakeScheduler, JobGroup, Schedule, ScheduleTrigger, Trigger } from './fake-scheduler';

export interface IErrorEmulationOptions {
  probability: number;
  text?: string;
}

export interface IFakeSchedulerOptions {
  version: string;
  quartzVersion: string;
  dotNetVersion: string;
  timelineSpan: number;
  schedulerName: string;
  schedule: Schedule;
  errorEmulation?: Record<string, IErrorEmulationOptions>;
}

type CommandResponseValue = string | number | boolean | null | undefined;
type CommandHandlerResponse = {
  [k: string]:
    | CommandResponseValue
    | CommandResponseValue[]
    | CommandHandlerResponse
    | CommandHandlerResponse[];
};

export class FakeSchedulerServer {
  private readonly _scheduler: FakeScheduler;
  private readonly _commandHandlers: {
    [command: string]: (args: Record<string, string>) => CommandHandlerResponse;
  };
  private readonly _getError: (code: string) => { _err: string } | undefined;

  public constructor(options: IFakeSchedulerOptions) {
    this._scheduler = new FakeScheduler(options.schedulerName, options.schedule);

    this._getError = (code: string): { _err: string } | undefined => {
      if (options.errorEmulation === undefined) {
        return undefined;
      }

      const errorEmulationOptions = options.errorEmulation[code];
      if (errorEmulationOptions === undefined) {
        return undefined;
      }

      if (Math.random() * 100 < errorEmulationOptions.probability) {
        return {
          _err:
            errorEmulationOptions.text ??
            "This is an error emulation text. If it's unexpected, please check fake scheduler configuration",
        };
      }

      return undefined;
    };

    this._commandHandlers = {
      get_env: () => ({
        _ok: 1,
        sv: options.version,
        qv: options.quartzVersion,
        dnv: options.dotNetVersion,
        ts: options.timelineSpan,
      }),
      get_input_types: (_) => ({
        _ok: 1,
        i: [
          { _: 'string', l: 'string' },
          { _: 'int', l: 'int' },
          { _: 'long', l: 'long' },
          { _: 'float', l: 'float' },
          { _: 'double', l: 'double' },
          { _: 'boolean', l: 'boolean', v: 1 },
          { _: 'ErrorTest', l: 'Error test' },
        ],
      }),
      get_input_type_variants: (_) => ({
        _ok: 1,
        i: [
          { _: 'true', l: 'True' },
          { _: 'false', l: 'False' },
        ],
      }),
      get_job_types: (_) => ({
        _ok: 1,
        i: [
          'HelloJob|CrystalQuartz.Samples|CrystalQuartz',
          'CleanupJob|CrystalQuartz.Samples|CrystalQuartz',
          'GenerateReports|CrystalQuartz.Samples|CrystalQuartz',
        ],
      }),
      get_trigger_details: (args) => {
        const group = this._scheduler.findGroup(args.group);
        const trigger = group?.findTrigger(args.trigger);

        if (group === null || !trigger) {
          return { _err: 'Trigger not found' };
        }

        return {
          _ok: 1,
          jdm: {
            _: 'object',
            v: {
              Test1: { _: 'single', k: 1, v: 'String value' },
            },
          },
          t: this.mapTrigger(group, trigger),
        };
      },
      get_data: (args) => {
        return this.mapCommonData(args);
      },
      resume_trigger: (args) => {
        this._scheduler.resumeTrigger(args.trigger);
        return this.mapCommonData(args);
      },
      pause_trigger: (args) => {
        this._scheduler.pauseTrigger(args.trigger);
        return this.mapCommonData(args);
      },
      delete_trigger: (args) => {
        this._scheduler.deleteTrigger(args.trigger);
        return this.mapCommonData(args);
      },
      pause_job: (args) => {
        this._scheduler.pauseJob(args.group, args.job);
        return this.mapCommonData(args);
      },
      resume_job: (args) => {
        this._scheduler.resumeJob(args.group, args.job);
        return this.mapCommonData(args);
      },
      delete_job: (args) => {
        this._scheduler.deleteJob(args.group, args.job);
        return this.mapCommonData(args);
      },
      pause_group: (args) => {
        this._scheduler.pauseGroup(args.group);
        return this.mapCommonData(args);
      },
      resume_group: (args) => {
        this._scheduler.resumeGroup(args.group);
        return this.mapCommonData(args);
      },
      delete_group: (args) => {
        this._scheduler.deleteGroup(args.group);
        return this.mapCommonData(args);
      },
      get_scheduler_details: (_) => ({
        _ok: 1,
        ism: this._scheduler.status === SchedulerStatus.Ready,
        jsc: false,
        jsp: false,
        je: this._scheduler.jobsExecuted,
        rs: this._scheduler.startedAt,
        siid: 'IN_BROWSER',
        sn: this._scheduler.name,
        isr: false,
        t: null,
        isd: this._scheduler.status === SchedulerStatus.Shutdown,
        ist: this._scheduler.status === SchedulerStatus.Started,
        tps: 1,
        tpt: null,
        v: 'In-Browser Emulation',
      }),
      get_job_details: (_) => {
        return {
          _ok: true,
          jd: {
            ced: true, // ConcurrentExecutionDisallowed
            ds: '', // Description
            pjd: false, // PersistJobDataAfterExecution
            d: false, // Durable
            t: 'SampleJob|Sample|InBrowser', // JobType
            rr: false, // RequestsRecovery
          },
          jdm: {
            _: 'object',
            v: {
              Test1: { _: 'single', k: 1, v: 'String value' },
              Test2: {
                _: 'object',
                k: 1,
                v: {
                  FirstName: { _: 'single', v: 'John' },
                  LastName: { _: 'single', v: 'Smith' },
                  TestError: { _: 'error', _err: 'Exception text' },
                },
              },
              Test3: {
                _: 'enumerable',
                v: [
                  { _: 'single', v: 'Value 1' },
                  { _: 'single', v: 'Value 2' },
                  { _: 'single', v: 'Value 3' },
                ],
              },
            },
          }, // todo: take actual from job
        };
      },
      start_scheduler: (args) => {
        this._scheduler.start();
        return this.mapCommonData(args);
      },
      pause_scheduler: (args) => {
        this._scheduler.pauseAll();
        return this.mapCommonData(args);
      },
      resume_scheduler: (args) => {
        this._scheduler.resumeAll();
        return this.mapCommonData(args);
      },
      standby_scheduler: (args) => {
        this._scheduler.standby();
        return this.mapCommonData(args);
      },
      stop_scheduler: (args) => {
        this._scheduler.shutdown();
        return this.mapCommonData(args);
      },
      add_trigger: (args) => {
        const triggerType = args.triggerType;

        let i = 0;
        let errors: Record<string, string> | null = null;

        while (args['jobDataMap[' + i + '].Key']) {
          if (args['jobDataMap[' + i + '].InputTypeCode'] === 'ErrorTest') {
            errors = errors || {};
            errors[args['jobDataMap[' + i + '].Key']] = 'Testing error message';
          }

          i++;
        }

        if (errors) {
          return {
            ...this.mapCommonData(args),
            ve: errors,
          };
        }

        if (triggerType !== 'Simple') {
          return {
            _err: 'Only "Simple" trigger type is supported by in-browser fake scheduler implementation',
          };
        }

        const job = args.job ?? null;
        const group = args.group ?? null;
        const name = args.name ?? null;
        const trigger: ScheduleTrigger = {
          repeatCount: args.repeatForever ? undefined : +args.repeatCount,
          repeatInterval: +args.repeatInterval,
        };

        this._scheduler.triggerJob(group, job, name, trigger);

        return this.mapCommonData(args);
      },
      execute_job: (args) => {
        this._scheduler.executeNow(args.group, args.job);
        return this.mapCommonData(args);
      },
    };

    this._scheduler.init();
    this._scheduler.start();
  }

  public handleRequest(data: Record<string, string>) {
    const handler = this._commandHandlers[data.command];

    if (handler) {
      return this._getError(data.command) ?? handler(data);
    }

    return { _err: 'Fake scheduler server does not support command ' + data.command };
  }

  private mapTrigger(group: JobGroup, trigger: Trigger) {
    return {
      _: trigger.name,
      gn: group.name,
      n: trigger.name,
      s: trigger.getStatus().value,
      sd: trigger.startDate,
      ed: trigger.endDate,
      nfd: trigger.nextFireDate,
      pfd: trigger.previousFireDate,
      tc: 'simple',
      tb:
        (trigger.repeatCount === null ? '-1' : trigger.repeatCount.toString()) +
        '|' +
        trigger.repeatInterval +
        '|' +
        trigger.executedCount,
    };
  }

  private mapCommonData(args: Record<string, string>) {
    const scheduler = this._scheduler;
    const data = scheduler.getData();

    return {
      _ok: 1,
      sim: scheduler.startedAt,
      rs: scheduler.startedAt,
      n: data.name,
      st: scheduler.status.code,
      je: scheduler.jobsExecuted,
      jt: data.jobsCount,
      ip: scheduler.inProgress.map((ip) => ip.fireInstanceId + '|' + ip.trigger.name),
      jg: data.groups.map((g) => ({
        n: g.name,
        s: g.getStatus().value,

        jb: g.jobs.map((j) => ({
          n: j.name,
          s: j.getStatus().value,
          gn: g.name,
          _: g.name + '_' + j.name,
          tr: j.triggers.map((t) => this.mapTrigger(g, t)),
        })),
      })),
      ev: scheduler.findEvents(+args.minEventId).map((ev) => {
        const result: CommandHandlerResponse = {
          _: `${ev.id}|${ev.date}|${ev.eventType}|${ev.scope}`,
          k: ev.itemKey,
          fid: ev.fireInstanceId,
        };

        if (ev.faulted) {
          result['_err'] = ev.errors ? ev.errors.map((er) => ({ _: er.text, l: er.level })) : 1;
        }

        return result;
      }),
    };
  }
}
