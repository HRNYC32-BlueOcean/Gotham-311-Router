const net = require('net');
const { on } = require('process');

net
    .createServer(function (data) {
        data.setEncoding('utf8');
    })
    .on("connection", (req) => {
        req.on("data", async (data) => {
            // Var that holds our subdomain
            let hostLine = null;
            let subdomain = null;
            let reqPath = null;
            // Tries to find the subdomain
            try {
                hostLine = data
                    .match(/host:.{0,}/gi)[0] // Match the first instance of 'Host:'
                
                subdomain = hostLine// Get what's between 'host: ' and '.gotham311.xyz' (returns null if nothing found)
                    .match(/(?<=host:[ ]{0,})([^ ][^.]{0,})(?=.gotham311.xyz)/gi);
                    if (subdomain !== null) subdomain = subdomain[0]; // If we didn't get null we only want the first result

                reqPath = hostLine
                    .match(/(?<=host:[^/]{0,})\/.{0,}/gi);
                    if (reqPath !== null) reqPath = reqPath[0]; // If we didn't get null we only want the first result
                
                console.log(subdomain, reqPath)
                console.log(data)
            } catch (err) {
                req.send('Error')
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
        host: "127.0.0.1",
    });

const forwardRequest = function ({port, location, data, req, path}) {
    // Create a new socket
    let middleMan = new net.Socket();
    // Split the request up and inject the 'original' url (...@#%$ heroku :/)
    let refittedData = data.split('\n');
    refittedData[1] = `Host: ${location}${path !== null ? path : ''}\r`;
    refittedData = refittedData.join('\n');
    console.log([refittedData]);
    refittedData = Buffer.from(refittedData, 'utf8');
    // Connect to the main site
    middleMan.connect(port, location, function () {
        // Forward the request
        middleMan.write(refittedData);
    });
    // When we get data back...
    middleMan.on("data", function (res) {
        // Hand the response back to the requestee
        req.write(res);
    });
}