const http = require('http'),
      url = require('url'),
      fs = require('fs'),
      path = require('path');

const port = 3000;

const startupDate = new Date().getTime();

const mimeTypeResolver = (fileName) => {
    const extension = path.extname(fileName).toUpperCase();

    switch (extension) {
        case '.HTML': return 'text/html';
        case '.CSS': return 'text/css';
        case '.js': return 'application/javascript';
        default: return null;
    }
};

const scheduler = new FakeScheduler('DefaultScheduler');

const requestHandler = (request, response) => {
    const requestUrl = url.parse(request.url, true);

    if (request.method === 'GET') {
        const filePath = request.url === '/' ? 'dist/index.html' : __dirname + '/dist/' + requestUrl.query.path;

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
        request.on('data',
            function(data) {
                data = data.toString();
                data = data.split('&');
                for (var i = 0; i < data.length; i++) {
                    var _data = data[i].split("=");
                    POST[_data[0]] = _data[1];
                }
                console.log(POST);

                const command = POST['command'];

                response.writeHead(200, { "Content-Type": 'application/json' });
                if (command === 'get_env') {
                    response.write(JSON.stringify({
                        SelfVersion: '5.0-dev',
                        QuartzVersion: '3.2.0',
                        DotNetVersion: '4.5.2',
                        Success: true
                    }));
                } else {

                    if (command === 'start_scheduler') {
                        scheduler.start();
                    } else if (command === 'stop_scheduler') {
                        scheduler.stop();
                    }

                    const minEventId = parseInt(POST['minEventId']);
                    response.write(JSON.stringify(scheduler.getData(minEventId)));    
                }
                
                response.end();
            });

        
    }
};

const server = http.createServer(requestHandler);

server.listen(port,
    (err) => {
        if (err) {
            return console.log('something bad happened', err);
        }

        console.log(`server is listening on ${port}`);
    });

function FakeScheduler(name) {
    var that = this;

    var allStatuses = [
        'empty',
        'ready',
        'started',
        'shutdown'
    ];
    var currentStatus = 0;

    this._name = name;
    this._startedAt = null;
    this._jobGroups = [];
    this._triggers = [];
    this._events = [];
    this._jobsExecuted = 0;
    this._status = 'ready';

    this.start = function() {
        this._startedAt = new Date().getTime();    
    };

    this.stop = function() {
        this._startedAt = null;
    };

    setInterval(
        function() {
            currentStatus++;
            if (currentStatus >= allStatuses.length) {
                currentStatus = 0;
            }

            that._status = allStatuses[currentStatus];
            console.log('status is', that._status);
        }, 20 * 1000);

    this.getData = function (minEventId) {
        console.log(minEventId);

        return {
            Name: this._name,
            Success: true,
            RunningSince: this._startedAt,                  /* todo */
            JobGroups: this._jobGroups,
            Status: this._status,
            JobsTotal: this._jobGroups
                .map(function (group) { return group.Jobs.length })
                .reduce(function (prev, actual) { return prev + actual }, 0),
            JobsExecuted: this._jobsExecuted,
            Events: this._events.filter(function(item) {
                return item.Id > minEventId;
            })
        };
    };

    this.createStatus = function(code) {
        return {
            Code: code.toLowerCase(),
            Title: code
        };
    };

    for (var i = 0; i <= 5; i++) {
        const jobGroup = {
            Name: 'Job Group ' + (i + 1),
            Status: this.createStatus('mixed'),
            Jobs: []
        };

        for (var j = 0; j < 3; j++) {
            const job = {
                Name: 'Job ' + (i + 1) + ' ' + (j + 1),
                Status: this.createStatus('active'),
                Triggers: []
            };

            for (var z = 0; z <= 2; z++) {
                const trigger = {
                    Name: 'Trigger ' + (i + 1) + ' ' + (j + 1) + ' ' + (z + 1),
                    Status: this.createStatus('active'),
                    TriggerType: { Code: 'Cron' },
                    UniqueTriggerKey: 'Trigger_' + (i + 1) + '_' + (j + 1) + '_' + (z + 1),
                    StartDate: this._startedAt,
                    PreviousFireDate: null,
                    CanPause: true,
                    CanStart: true,
                    CanDelete: true
                };

                this._triggers.push(trigger);
                job.Triggers.push(trigger);
            }

            jobGroup.Jobs.push(job);
        }

        this._jobGroups.push(jobGroup);
    }

    this._maxEventId = 0;

    this.pushEvent = function(event) {
        that._events.push({
            Id: that._maxEventId++,
            Event: event,
            Date: new Date().getTime()
        });
    };

    this.pickRanfomOf = function(list) {
        return list[Math.floor(Math.random() * list.length)];
    };

    setInterval(function() {
        if (Math.random() > 0.5) {
            console.log('random action');

            const jobGroup = that.pickRanfomOf(that._jobGroups),
                  job = that.pickRanfomOf(jobGroup.Jobs),
                  trigger = that.pickRanfomOf(job.Triggers),
                  fireInstanceId = trigger.fireInstanceId;

            if (fireInstanceId) {
                that.pushEvent({
                    TypeCode: 'TRIGGER_COMPLETE',
                    Group: jobGroup.Name,
                    Trigger: trigger.Name,
                    Job: job.Name,
                    FireInstanceId: fireInstanceId,
                    UniqueTriggerKey: trigger.UniqueTriggerKey
                });
                trigger.fireInstanceId = null;

                that._jobsExecuted += 1000;
                //that._jobsExecuted++;
            } else {
                const now = new Date().getTime();

                trigger.fireInstanceId = Math.floor(Math.random() * 1000);
                trigger.PreviousFireDate = new Date().getTime();
                trigger.NextFireDate = now + 2 * 60 * 60 * 1000;

                that.pushEvent({
                    TypeCode: 'TRIGGER_FIRED',
                    Group: jobGroup.Name,
                    Trigger: trigger.Name,
                    Job: job.Name,
                    FireInstanceId: trigger.fireInstanceId,
                    UniqueTriggerKey: trigger.UniqueTriggerKey
                });
            }
        }
    }, 5 * 1000);
};