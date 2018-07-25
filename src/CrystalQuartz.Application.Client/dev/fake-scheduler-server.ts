import { FakeScheduler, Schedule, ScheduleTrigger } from "./fake-scheduler";
import { SchedulerStatus } from "../app/api";

import __map from 'lodash/map';

export interface IFakeSchedulerOptions {
    version: string;
    quartzVersion: string;
    dotNetVersion: string;
    timelineSpan: number;
    schedulerName: string;
    schedule: Schedule;
}

export class FakeSchedulerServer {
    private _scheduler: FakeScheduler;
    private _commandHandlers: { [command: string]: (args) => any };

    constructor(options: IFakeSchedulerOptions) {
        this._scheduler = new FakeScheduler(options.schedulerName, options.schedule);

        this._commandHandlers = {
            'get_env': () => ({
                _ok: 1,
                sv: options.version,
                qv: options.quartzVersion,
                dnv: options.dotNetVersion,
                ts: options.timelineSpan
            }),
            'get_data': (args) => {
                return this.mapCommonData(args);
            },
            'resume_trigger': (args) => {
                this._scheduler.resumeTrigger(args.trigger);
                return this.mapCommonData(args);
            },
            'pause_trigger': (args) => {
                this._scheduler.pauseTrigger(args.trigger);
                return this.mapCommonData(args);
            },
            'delete_trigger': (args) => {
                this._scheduler.deleteTrigger(args.trigger);
                return this.mapCommonData(args);
            },
            'pause_job': (args) => {
                this._scheduler.pauseJob(args.group, args.job);
                return this.mapCommonData(args);
            },
            'resume_job': (args) => {
                this._scheduler.resumeJob(args.group, args.job);
                return this.mapCommonData(args);
            },
            'delete_job': (args) => {
                this._scheduler.deleteJob(args.group, args.job);
                return this.mapCommonData(args);
            },
            'pause_group': (args) => {
                this._scheduler.pauseGroup(args.group);
                return this.mapCommonData(args);
            },
            'resume_group': (args) => {
                this._scheduler.resumeGroup(args.group);
                return this.mapCommonData(args);
            },
            'delete_group': (args) => {
                this._scheduler.deleteGroup(args.group);
                return this.mapCommonData(args);
            },
            'get_scheduler_details': (args) => ({
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
                v: 'In-Browser Emulation'
            }),
            'get_job_details': (args) => ({
                _ok: true,
                jd: {
                    ced: true,                        // ConcurrentExecutionDisallowed
                    ds: '',                           // Description
                    pjd: false,                       // PersistJobDataAfterExecution
                    d: false,                         // Durable
                    t: 'SampleJob|Sample|InBrowser',  // JobType
                    rr: false                         // RequestsRecovery
                },
                jdm: {} // todo: take actual from job
            }),
            'start_scheduler': (args) => {
                this._scheduler.start();
                return this.mapCommonData(args);
            },
            'pause_scheduler': (args) => {
                this._scheduler.pauseAll();
                return this.mapCommonData(args);
            },
            'resume_scheduler': (args) => {
                this._scheduler.resumeAll();
                return this.mapCommonData(args);
            },
            'standby_scheduler': (args) => {
                this._scheduler.standby();
                return this.mapCommonData(args);
            },
            'stop_scheduler': (args) => {
                this._scheduler.shutdown();
                return this.mapCommonData(args);
            },
            'add_trigger': (args) => {
                const triggerType = args.triggerType;

                if (triggerType !== 'Simple') {
                    return {
                        _err: 'Only "Simple" trigger type is supported by in-browser fake scheduler implementation'
                    };
                }

                const
                    job = args.job,
                    group = args.group,
                    name = args.name,
                    trigger: ScheduleTrigger = {
                        repeatCount: args.repeatForever ? null : args.repeatCount,
                        repeatInterval: args.repeatInterval
                    };

                this._scheduler.triggerJob(group, job, name, trigger);

                return this.mapCommonData(args);
            },
            'execute_job': (args) => {
                this._scheduler.executeNow(args.group, args.job);
                return this.mapCommonData(args);
            }
        };

        this._scheduler.init();
        this._scheduler.start();
    }

    handleRequest(data) {
        const handler = this._commandHandlers[data.command];

        if (handler) {
            return handler(data);
        }

        return { _err: 'Fake scheduler server does not support command ' + data.command };
    }

    private mapCommonData(args) {
        const
            scheduler = this._scheduler,
            data = scheduler.getData();

        return {
            _ok: 1,
            sim: scheduler.startedAt,
            rs: scheduler.startedAt,
            n: data.name,
            st: scheduler.status.code,
            je: scheduler.jobsExecuted,
            jt: data.jobsCount,
            ip: __map(scheduler.inProgress, ip => ip.fireInstanceId + '|' + ip.trigger.name),
            jg: __map(data.groups, g => ({
                n: g.name,
                s: g.getStatus().value,

                jb: __map(g.jobs, j => ({
                    n: j.name,
                    s: j.getStatus().value,
                    gn: g.name,
                    _: g.name + '_' + j.name,

                    tr: __map(j.triggers, t => ({
                        '_': t.name,
                        n: t.name,
                        s: t.getStatus().value,
                        sd: t.startDate,
                        ed: t.endDate,
                        nfd: t.nextFireDate,
                        pfd: t.previousFireDate,
                        tc: 'simple',
                        tb: (t.repeatCount === null ? '-1' : t.repeatCount.toString()) + '|' + t.repeatInterval + '|' + t.executedCount
                    }))
                }))
            })),
            ev: __map(
                scheduler.findEvents(+args.minEventId),
                ev => `${ev.id}|${ev.date}|${ev.eventType}|${ev.scope}|${ev.fireInstanceId}|${ev.itemKey}`)
        };
    }
}