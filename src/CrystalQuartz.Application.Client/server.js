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

const requestHandler = (request, response) => {
    const requestUrl = url.parse(request.url, true);

    if (request.method === 'GET') {
        const filePath = request.url === '/' ? 'index.html' : __dirname + request.url;

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
        response.writeHead(200, { "Content-Type": 'application/json' });
        response.write(JSON.stringify({
            Name: 'DefaultScheduler',
            Success: true,
            RunningSince: startupDate,
            JobGroups: [
                {
                    Name: 'Group1',
                    Status: { Code: 'Active'},
                    Jobs: [
                        {
                            Name: 'Job1',
                            Status: { Code: 'Active' },
                            Triggers: [
                                {
                                    Name: 'Trigger 1',
                                    Status: { Code: 'Active' },        
                                    TriggerType: { Code: 'Cron' }
                                }
                            ]
                        }
                    ]
                }
            ]
        }));
        response.end();
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