import { FakeScheduler, Schedule, ScheduleTrigger } from "./fake-scheduler";

import __map from 'lodash/map';
import {SchedulerStatus} from "../app/api";

declare var CQ_VERSION: string;

const
    SECONDS = x => x * 1000,
    MINUTES = x => SECONDS(60 * x);

const
    options = {
        version: CQ_VERSION || '6-demo',
        quartzVersion: 'in-browser-emulation',
        dotNetVersion: 'none',
        timelineSpan: 3600 * 1000,
        schedulerName: 'DemoScheduler',
    },

    now = new Date().getTime(),

    schedule: Schedule = {
        'Maintenance': {
            'DB_Backup': {
                duration: SECONDS(20),
                triggers: {
                    'db_trigger_1': { repeatInterval: MINUTES(1), initialDelay: SECONDS(5) },
                    'db_trigger_2': { repeatInterval: MINUTES(1.5) },
                }
            },
            'Compress_Logs': {
                duration: MINUTES(1),
                triggers: {
                    'logs_trigger_1': { repeatInterval: MINUTES(3) },
                    'logs_trigger_2': { repeatInterval: MINUTES(4), pause: true }
                }
            }
        },
        'Domain': {
            'Email_Sender': {
                duration: SECONDS(10),
                triggers: {
                    'email_sender_trigger_1': {repeatInterval: MINUTES(2), repeatCount: 5 }
            }
            },
            'Remove_Inactive_Users': {
                duration: SECONDS(30),
                triggers: {
                    'remove_users_trigger_1': { repeatInterval: MINUTES(3), repeatCount: 5, persistAfterExecution: true }
                }
            }
        },
        'Reporting': {
            'Daily Sales': {
                duration: MINUTES(7),
                triggers: {
                    'ds_trigger': { repeatInterval: MINUTES(60),  }
                }
            },
            'Services Health': {
                duration: MINUTES(2),
                triggers: {
                    'hr_trigger': { repeatInterval: MINUTES(30), startDate: now + MINUTES(1) }
                }
            },
            'Resource Consumption': {
                duration: MINUTES(1),
                triggers: {
                    'rc_trigger': { repeatInterval: MINUTES(10), startDate: now + MINUTES(2), endDate: now + MINUTES(40), persistAfterExecution: true }
                }
            }
        }
    },

    scheduler = new FakeScheduler(options.schedulerName, schedule);

const
    commonDataMapper = (args) => {
        const data = scheduler.getData();

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
    },
    commandHandlers = {
    'get_env': () => ({
        _ok: 1,
        sv: options.version,
        qv: options.quartzVersion,
        dnv: options.dotNetVersion,
        ts: options.timelineSpan
    }),
    'get_data': (args) => {
        return commonDataMapper(args);
    },
    'resume_trigger': (args) => {
        scheduler.resumeTrigger(args.trigger);
        return commonDataMapper(args);
    },
    'pause_trigger': (args) => {
        scheduler.pauseTrigger(args.trigger);
        return commonDataMapper(args);
    },
    'delete_trigger': (args) => {
        scheduler.deleteTrigger(args.trigger);
        return commonDataMapper(args);
    },
    'pause_job': (args) => {
        scheduler.pauseJob(args.group, args.job);
        return commonDataMapper(args);
    },
    'resume_job': (args) => {
        scheduler.resumeJob(args.group, args.job);
        return commonDataMapper(args);
    },
    'delete_job': (args) => {
        scheduler.deleteJob(args.group, args.job);
        return commonDataMapper(args);
    },
    'pause_group': (args) => {
        scheduler.pauseGroup(args.group);
        return commonDataMapper(args);
    },
    'resume_group': (args) => {
        scheduler.resumeGroup(args.group);
        return commonDataMapper(args);
    },
    'delete_group': (args) => {
        scheduler.deleteGroup(args.group);
        return commonDataMapper(args);
    },
    'get_scheduler_details': (args) => ({
        _ok: 1,
        ism: scheduler.status === SchedulerStatus.Ready,
        jsc: false,
        jsp: false,
        je: scheduler.jobsExecuted,
        rs: scheduler.startedAt,
        siid: 'IN_BROWSER',
        sn: scheduler.name,
        isr: false,
        t: null,
        isd: scheduler.status === SchedulerStatus.Shutdown,
        ist: scheduler.status === SchedulerStatus.Started,
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
        scheduler.start();
        return commonDataMapper(args);
    },
    'pause_scheduler': (args) => {
        scheduler.pauseAll();
        return commonDataMapper(args);
    },
    'resume_scheduler': (args) => {
        scheduler.resumeAll();
        return commonDataMapper(args);
    },
    'standby_scheduler': (args) => {
        scheduler.standby();
        return commonDataMapper(args);
    },
    'stop_scheduler': (args) => {
        scheduler.shutdown();
        return commonDataMapper(args);
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

        scheduler.triggerJob(group, job, name, trigger);

        return commonDataMapper(args);
    },
    'execute_job': (args) => {
        scheduler.executeNow(args.group, args.job);
        return commonDataMapper(args);
    }
};

scheduler.init();
scheduler.start();

const
    $$:any = $,
    log = console.log || (() => {});

$$.ajax = function (response) {
    const data = response.data;

    log('ajax request', data);

    const deferred = $.Deferred();

    setTimeout(() => {
        const handler =     commandHandlers[data.command];

        if (!handler) {
            deferred.resolve({ _err: 'Fake scheduler server does not support command ' + data.command});
        } else {
            const result = commandHandlers[data.command](data);

            log('ajax response:', result);

            deferred.resolve(result);
        }

    }, 1000);

    return deferred.promise();
};