import { Schedule } from "../dev/fake-scheduler";
import { FakeSchedulerServer } from "../dev/fake-scheduler-server";

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
        isReadOnly: true
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

    schedulerServer = new FakeSchedulerServer({
        dotNetVersion: options.dotNetVersion,
        quartzVersion: options.quartzVersion,
        schedule: schedule,
        schedulerName: options.schedulerName,
        timelineSpan: options.timelineSpan,
        version: options.version,
        isReadOnly: options.isReadOnly
    });

const
    $$:any = $,
    log = console.log || (() => {});

$$.ajax = function (response) {
    const data = response.data;

    log('ajax request', data);

    const deferred = $.Deferred();

    setTimeout(() => {
        const result = schedulerServer.handleRequest(data);

        log('ajax response:', result);

        deferred.resolve(result);
    }, 1000);

    return deferred.promise();
};