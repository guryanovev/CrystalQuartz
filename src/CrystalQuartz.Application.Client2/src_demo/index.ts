import { Schedule } from '../dev/fake-scheduler';
import { FakeSchedulerServer } from '../dev/fake-scheduler-server';

declare let CQ_VERSION: string | undefined;

const SECONDS = (x: number) => x * 1000;
const MINUTES = (x: number) => SECONDS(60 * x);

const options = {
  version: CQ_VERSION ?? 'browser-demo',
  quartzVersion: 'in-browser-emulation',
  dotNetVersion: 'none',
  timelineSpan: 3600 * 1000,
  schedulerName: 'DemoScheduler',
};
const now = new Date().getTime();
const schedule: Schedule = {
  Maintenance: {
    DB_Backup: {
      duration: SECONDS(20),
      triggers: {
        db_trigger_1: { repeatInterval: MINUTES(1), initialDelay: SECONDS(5) },
        db_trigger_2: { repeatInterval: MINUTES(1.5) },
      },
    },
    Compress_Logs: {
      duration: MINUTES(1),
      triggers: {
        logs_trigger_1: { repeatInterval: MINUTES(3) },
        logs_trigger_2: { repeatInterval: MINUTES(4), pause: true },
      },
    },
  },
  Domain: {
    Email_Sender: {
      duration: SECONDS(10),
      triggers: {
        email_sender_trigger_1: { repeatInterval: MINUTES(2), repeatCount: 5 },
      },
    },
    Remove_Inactive_Users: {
      duration: SECONDS(30),
      triggers: {
        remove_users_trigger_1: {
          repeatInterval: MINUTES(3),
          repeatCount: 5,
          persistAfterExecution: true,
        },
      },
    },
  },
  Reporting: {
    'Daily Sales': {
      duration: MINUTES(7),
      triggers: {
        ds_trigger: { repeatInterval: MINUTES(60) },
      },
    },
    'Services Health': {
      duration: MINUTES(2),
      triggers: {
        hr_trigger: { repeatInterval: MINUTES(30), startDate: now + MINUTES(1) },
      },
    },
    'Resource Consumption': {
      duration: MINUTES(1),
      triggers: {
        rc_trigger: {
          repeatInterval: MINUTES(10),
          startDate: now + MINUTES(2),
          endDate: now + MINUTES(40),
          persistAfterExecution: true,
        },
      },
    },
  },
};
const schedulerServer = new FakeSchedulerServer({
  dotNetVersion: options.dotNetVersion,
  quartzVersion: options.quartzVersion,
  schedule: schedule,
  schedulerName: options.schedulerName,
  timelineSpan: options.timelineSpan,
  version: options.version,
});

const log = console.log || (() => {}); // eslint-disable-line no-console -- useful for debugging demo client requests

const parseBody = (body: BodyInit | null | undefined) => {
  if (body === null || body === undefined) {
    return {};
  }

  if (body instanceof URLSearchParams) {
    return Object.fromEntries(body.entries());
  }

  return JSON.parse(body as string);
};

window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const data = parseBody(init?.body);

  log('fetch request intercepted:', data); // eslint-disable-line no-console -- useful for debugging demo client requests

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const result = schedulerServer.handleRequest(data);

  log('fetch response:', result); // eslint-disable-line no-console -- useful for debugging demo client requests

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
