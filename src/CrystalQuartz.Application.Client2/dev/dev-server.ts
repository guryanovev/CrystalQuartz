import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as querystring from 'querystring';
import * as url from 'url';
import { Schedule } from './fake-scheduler';
import { FakeSchedulerServer } from './fake-scheduler-server';

const port = 3000;

const mimeTypeResolver = (fileName: string) => {
  const extension = path.extname(fileName).toUpperCase();

  switch (extension) {
    case '.HTML':
      return 'text/html';
    case '.CSS':
      return 'text/css';
    case '.js':
      return 'application/javascript';
    default:
      return 'application/unknown';
  }
};

const SECONDS = (x: number) => x * 1000;
const MINUTES = (x: number) => SECONDS(60 * x);

const options = {
  version: 'dev',
  quartzVersion: 'nodejs-emulation',
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
  errorEmulation: {
    get_data: { probability: 1 },
  },
});

const server = http.createServer();

server.on('request', (request, response) => {
  const requestUrl = url.parse(request.url ?? '', true);

  if (request.method === 'GET') {
    // eslint-disable-next-line no-console -- useful for debugging dev server requests
    console.log('GET', request.url);

    const filePath = requestUrl.query.path ? 'dist/' + requestUrl.query.path : 'dist/index.html';

    if (fs.existsSync(filePath)) {
      response.writeHead(200, { 'Content-Type': mimeTypeResolver(filePath) });
      response.write(fs.readFileSync(filePath));
      response.end();
      return;
    }

    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('Not found');
    response.end();
  } else {
    request.on('data', (data) => {
      data = data.toString();
      const POST = querystring.parse(data);

      // eslint-disable-next-line no-console -- useful for debugging dev server requests
      console.log('POST', POST);

      const result = schedulerServer.handleRequest(POST);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(result));
      response.end();
    });
  }
});

server.listen(port);
