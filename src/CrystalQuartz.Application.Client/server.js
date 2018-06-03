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
            function (data) {
                data = data.toString();
                data = data.split('&');
                for (var i = 0; i < data.length; i++) {
                    var _data = data[i].replace(/\+/g, ' ').split("=");
                    POST[_data[0]] = _data[1];
                }
                console.log(POST);

                const command = POST['command'];

                response.writeHead(200, { "Content-Type": 'application/json' });
                if (command === 'get_env') {
                    response.write(JSON.stringify({
                        sv: '5.0-dev',
                        qv: '3.2.0',
                        dnv: '4.5.2',
                        ts: 3600000,
                        _ok: 1//,
                        //ErrorMessage: 'An error occurred while initialization of scheduler services Could not load file or assembly \'Quartz, Version=2.6.1.0, Culture=neutral, PublicKeyToken=f6b8c98a402cc8a4\' or one of its dependencies.The located assembly\'s manifest definition does not match the assembly reference. (Exception from HRESULT: 0x80131040)'
                    }));
                } else if (command === 'get_scheduler_details') {
                    response.write(JSON.stringify({
                        SchedulerDetails: {
                            InStandbyMode: false,
                            JobStoreClustered: false,
                            JobStoreSupportsPersistence: false,
                            JobStoreType: {},
                            NumberOfJobsExecuted: 42,
                            RunningSince: new Date().getTime(),
                            SchedulerInstanceId: 'NodeDevScheduler',
                            SchedulerName: 'Johnny',
                            SchedulerRemote: true,
                            SchedulerType: {},
                            Shutdown: false,
                            Started: true,
                            ThreadPoolSize: 10,
                            ThreadPoolType: {},
                            Version: '1.0.0-dev'    
                        },
                        
                        Success: true
                    }));
                } else if (command === 'get_job_details') {
                    response.write(JSON.stringify({
                        
                        JobDetails: 
                        {
                            Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',    
                            ConcurrentExecutionDisallowed: true,
                            PersistJobDataAfterExecution: true,
                            RequestsRecovery: true,
                            Durable: false,
                            JobType: { Namespace: 'System', Name: 'String', Assembly: 'mscorlib' }
                        },
                        
                        JobDataMap: [
                            { Title: 'Property1', TypeCode: 'Numeric', Value: 12 },
                            { Title: 'Property2', TypeCode: 'String', Value: 'Foo' },
                            {
                                Title: 'Property3', TypeCode: 'Array', Value: [
                                    { TypeCode: 'Numeric', Value: 12 },
                                    { TypeCode: 'Numeric', Value: 13 }
                                ]
                            },
                            {
                                Title: 'Property4', TypeCode: 'Object', Value: [
                                    { Title: 'Property1_1', TypeCode: 'Numeric', Value: 12 },
                                    { Title: 'Property1_2', TypeCode: 'String', Value: 'Foo' }
                                ]
                            }
                        ],

                        Success: true
                    }));
                } else {

                    if (command === 'start_scheduler') {
                        scheduler.start();
                    } else if (command === 'stop_scheduler') {
                        scheduler.stop();
                    } else if (command === 'pause_job') {
                        scheduler.pushEvent({
                            EventType: 2,
                            Scope: 2,
                            ItemKey: POST['group'] + '.' + POST['job']
                        });
                    } else if (command === 'resume_job') {
                        scheduler.pushEvent({
                            EventType: 3,
                            Scope: 2,
                            ItemKey: POST['group'] + '.' + POST['job']
                        });
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
    this._inProgress = [];

    this.start = function () {
        this._startedAt = new Date().getTime();
    };

    this.stop = function () {
        this._startedAt = null;
    };

    setInterval(
        function () {
            currentStatus++;
            if (currentStatus >= allStatuses.length) {
                currentStatus = 0;
            }

            that._status = allStatuses[currentStatus];
            console.log('status is', that._status);
        }, 20 * 1000);

    this.getData = function (minEventId) {
        console.log(minEventId);

        var jobsTotal = this._jobGroups
            .map(function(group) { return group.Jobs.length })
            .reduce(function (prev, actual) { return prev + actual }, 0);
        /*
        var inProgressCount = Math.random() * jobsTotal;

        var inProgress = [];

        for (var i = 0; i < inProgressCount; i++) {
            inProgress.push({
                FireInstanceId: 'fake' + i,
                UniqueTriggerKey: 'fake' + i
            });
        }*/

        return {
            _ok: 1,
            n: this._name,
            rs: this._startedAt,
            jg: this._jobGroups.map(x => ({
                s: x.Status.Value,
                n: x.Name,
                jb: x.Jobs.map(job => ({
                    s: job.Status.Value,
                    n: job.Name,
                    gn: x.Name,
                    tr: job.Triggers.map(trigger => ({
                        "_": trigger.UniqueTriggerKey,
                        s: trigger.Status.Value,
                        n: trigger.Name,
                        tc: 'cron',
                        tb: 'no expression',
                        sd: trigger.StartDate,
                        nfd: trigger.NextFireDate,
                        pfd: trigger.PreviousFireDate
                    }))
                }))
            })),
            st: this._status,
            jt: jobsTotal,
            je: this._jobsExecuted,
            ev: this._events
                .filter(function (item) {
                    return item.Id > minEventId;
                })
                .map(x => x.Id + '|' + x.Date + '|' + x.Data.EventType + '|' + x.Data.Scope + '|' + x.Data.FireInstanceId + '|' + x.Data.ItemKey),
            ip: this._inProgress
                .map(x => x.FireInstanceId + '|' + x.UniqueTriggerKey)
        };
    };

    this.statusCodes = {
        'active': 0,
        'paused': 1,
        'mixed': 2,
        'complete': 3
    };

    this.createStatus = function (code) {
        const normalizedCode = code.toLowerCase();

        return {
            Code: normalizedCode,
            Title: code,
            Value: this.statusCodes[normalizedCode]
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
                Triggers: [],
                CanPause: true,
                CanStart: true,
                CanDelete: true
            };

            for (var z = 0; z <= 2; z++) {
                const trigger = {
                    Name: 'Trigger ' + (i + 1) + ' ' + (j + 1) + ' ' + (z + 1),
                    Status: this.createStatus('Active'),
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

    this.pushEvent = function (event) {
        that._events.push({
            Id: that._maxEventId++,
            Data: event,
            Date: new Date().getTime()
        });
    };

    this.pickRanfomOf = function (list) {
        return list[Math.floor(Math.random() * list.length)];
    };

    setInterval(function () {
        if (Math.random() > 0.5) {
            console.log('random action');

            const jobGroup = that.pickRanfomOf(that._jobGroups),
                job = that.pickRanfomOf(jobGroup.Jobs),
                trigger = that.pickRanfomOf(job.Triggers),
                fireInstanceId = trigger.fireInstanceId;

            if (fireInstanceId) {
                that.pushEvent({
                    Scope: 3,
                    EventType: 1,
                    FireInstanceId: fireInstanceId,
                    ItemKey: trigger.UniqueTriggerKey
                });
                trigger.fireInstanceId = null;

                that._jobsExecuted += 100000;

                var inProgressItemToRemoveIndex = null;
                for (var k = 0; k < that._inProgress.length; k++) {
                    if (that._inProgress[k].FireInstanceId === fireInstanceId) {
                        inProgressItemToRemoveIndex = k;
                    }
                }

                if (inProgressItemToRemoveIndex !== null) {
                    that._inProgress = that._inProgress.splice(inProgressItemToRemoveIndex, 1);
                }

                //that._jobsExecuted++;
            } else {
                const now = new Date().getTime();

                trigger.fireInstanceId = Math.floor(Math.random() * 1000);
                trigger.PreviousFireDate = new Date().getTime();
                trigger.NextFireDate = now + 2 * 60 * 60 * 1000;

                that.pushEvent({
                    Scope: 3,
                    EventType: 0,
                    FireInstanceId: trigger.fireInstanceId,
                    ItemKey: trigger.UniqueTriggerKey
                });

                that._inProgress.push({
                    FireInstanceId: trigger.fireInstanceId,
                    UniqueTriggerKey: trigger.UniqueTriggerKey
                });
            }
        }
    }, 5 * 1000);
};