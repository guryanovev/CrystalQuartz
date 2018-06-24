import {FakeScheduler, Schedule} from "./fake-scheduler";

import __map from 'lodash/map';
import {SchedulerStatus} from "../app/api";

const
    options = {
        version: '6-demo',
        quartzVersion: 'in-browser-emulation',
        dotNetVersion: 'none',
        timelineSpan: 3600 * 1000,
        schedulerName: 'DemoScheduler'
    },

    schedule: Schedule = {
        'Maintenance': {
            'DB_Backup': {
                'db_trigger_1': { repeatInterval: 30000, duration: 20000, initialDelay: 5000 },
                'db_trigger_2': { repeatInterval: 60000, duration: 20000 },
            },
            'Compress_Logs': {
                'logs_trigger_1': { repeatInterval: 150000, duration: 60000 },
                'logs_trigger_2': { repeatInterval: 200000, duration: 60000, pause: true }
            }
        },
        'Domain': {
            'Email_Sender': {},
            'Remove_Inactive_Users': {}
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
            ip: __map(scheduler.inProgress, ip => ip.fireInstanceId + '|' + ip.trigger.name),
            jg: __map(data.groups, g => ({
                n: g.name,
                s: g.getStatus().value,

                jb: __map(g.jobs, j => ({
                    n: j.name,
                    s: j.getStatus().value,

                    tr: __map(j.triggers, t => ({
                        '_': t.name,
                        n: t.name,
                        s: t.getStatus().value,
                        sd: scheduler.startedAt,
                        nfd: t.nextFireDate,
                        pfd: t.previousFireDate
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
    })
};

scheduler.init();
scheduler.start();

const $$:any = $;

$$.ajax = function (response) {
    const data = response.data;

    console.log('ajax', arguments);

    const deferred = $.Deferred();

    setTimeout(() => {
        const handler =     commandHandlers[data.command];

        if (!handler) {
            deferred.resolve({ _err: 'Fake scheduler server does not support command ' + data.command});
        } else {
            const result = commandHandlers[data.command](data);

            console.log('response:', result);

            deferred.resolve(result);
        }

    }, 1000);

    return deferred.promise();
};