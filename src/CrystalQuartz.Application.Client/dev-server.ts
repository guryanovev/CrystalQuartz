import { Schedule } from "./dev/fake-scheduler";
import { FakeSchedulerServer } from "./dev/fake-scheduler-server";

import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';
import * as path from 'path';

const port = 3000;

const mimeTypeResolver = (fileName) => {
    const extension = path.extname(fileName).toUpperCase();

    switch (extension) {
        case '.HTML': return 'text/html';
        case '.CSS': return 'text/css';
        case '.js': return 'application/javascript';
        default: return null;
    }
};

const
    SECONDS = x => x * 1000,
    MINUTES = x => SECONDS(60 * x);

const
    options = {
        version: 'dev',
        quartzVersion: 'nodejs-emulation',
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
                    'email_sender_trigger_1': { repeatInterval: MINUTES(2), repeatCount: 5 }
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
                    'ds_trigger': { repeatInterval: MINUTES(60), }
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
        version: options.version
    });

const requestHandler = (request, response) => {
    const requestUrl = url.parse(request.url, true);

    if (request.method === 'GET') {
        const filePath = request.url === '/' ? 'dist/index.html' : 'dist/' + requestUrl.query.path;

        if (fs.existsSync(filePath)) {
            response.writeHead(200, { "Content-Type": mimeTypeResolver(filePath) });
            response.write(fs.readFileSync(filePath));
            response.end();
            return;
        }

        response.writeHead(404, { "Content-Type": 'text/plain' });
        response.write('Not found');
        response.end();
    } else {
        var POST = {};
        request.on(
            'data',
            data => {
                data = data.toString();
                data = data.split('&');
                for (var i = 0; i < data.length; i++) {
                    var _data = data[i].replace(/\+/g, ' ').split("=");
                    POST[_data[0]] = _data[1];
                }
                console.log(POST);

                const result = schedulerServer.handleRequest(POST);
                response.writeHead(200, { "Content-Type": 'application/json' });
                response.write(JSON.stringify(result));
                response.end();
            });
    }
};

const server = http.createServer(requestHandler);

server.listen(
    port,
    (err) => {
        if (err) {
            return console.log('something bad happened', err);
        }

        console.log(`server is listening on ${port}`);
    });