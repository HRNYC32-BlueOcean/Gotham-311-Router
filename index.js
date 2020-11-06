const net = require('net');
console.log('File read')
net
    .createServer(function (data) {
        console.log('Server Created')
        data.setEncoding('utf8');
    })
    .on("connection", (req) => {
        req.on("data", (data) => {
            // Var that holds our subdomain
            let hostLine = null;
            let subdomain = null;
            let reqPath = null;
            // Tries to find the subdomain
            try {
                hostLine = data
                    .match(/host:.{0,}/gi) // Match the first instance of 'Host:'
                
                if (hostLine === null || (typeof hostLine === 'array' && hostLine.length < 1)) throw new Error ('No Hostname! Rejecting request.');
                hostLine = hostLine[0];

                subdomain = hostLine// Get what's between 'host: ' and '.gotham311.xyz' (returns null if nothing found)
                    .match(/(?<=host:[ ]{0,})([^ ][^.]{0,})(?=.gotham311.xyz)/gi);
                    if (subdomain !== null) subdomain = subdomain[0]; // If we didn't get null we only want the first result

                reqPath = hostLine
                    .match(/(?<=host:[^/]{0,})\/.{0,}/gi);
                    if (reqPath !== null) reqPath = reqPath[0]; // If we didn't get null we only want the first result
                
                console.log(subdomain, reqPath)
            } catch (err) {
                console.log(err);
                req.write('Error')
            }
            // Do different things based on what we got
            switch(subdomain) {
                case null:
                case 'www':
                    forwardRequest({
                        port: 80,
                        location: 'desolate-journey-88560.herokuapp.com',
                        data,
                        req,
                        path: reqPath
                    });
                    break;
                case 'api':
                    forwardRequest({
                        port: 80,
                        location: 'nameless-mountain-18450.herokuapp.com',
                        data,
                        req,
                        path: reqPath
                    });
                    break;
                case 'employee':
                    forwardRequest({
                        port: 80,
                        location: 'dry-temple-86477.herokuapp.com',
                        data,
                        req,
                        path: reqPath
                    }); 
                    break;  
                default:
                    console.log('404')
            }
        });
    })
    .on("error", (err) => {
        throw err;
    })
    .on('end', () => {
        // Do stuff
    })
    .on('timeout', () => {
        // Do stuff
    })
    .listen({
        port: 8080,
        host: "0.0.0.0",
        readableAll: true,
        writableAll: true,
    });

const forwardRequest = function ({port, location, data, req, path}) {
    // Create a new socket
    let middleMan = new net.Socket();
    // Split the request up and inject the 'original' url (...@#%$ heroku :/)
    let refittedData = data.split('\n');
    let hostLocation = 0;
    for (let line of refittedData) {
        if (line.includes('Host:')) {
            break;
        }
        hostLocation += 1;
    }
    refittedData[hostLocation] = `Host: ${location}${path !== null ? path : ''}\r`;
    refittedData = refittedData.join('\n');
    refittedData = Buffer.from(refittedData, 'utf8');
    // Connect to the main site
    middleMan.connect(port, location, function () {
        // Forward the request
        middleMan.write(refittedData);
    });
    // Set up keepAlive to avoid errors with sockets closing early:
    req.setKeepAlive(true, 5000);
    // Set up handling to make sure we can deal with a closed socket:
    let didEnd = false;
    req.on('end' , () => didEnd = true);
    req.on('timeout', () => didEnd = true);
    req.on('close' , () => didEnd = true);
    // When we get data back...
    middleMan.on("data", function (res) {
        // Hand the response back to the requestee
        if (didEnd === false) {
            req.write(res);
        } else {
            req.close();
        }
    });
}