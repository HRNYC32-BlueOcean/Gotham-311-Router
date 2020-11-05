const net = require('net');
const { on } = require('process');

net
    .createServer()
    .on("connection", (req) => {
        req.on("data", async (data) => {
            // Var that holds our subdomain
            let subdomain = null;
            // Tries to find the subdomain
            try {
                subdomain = data.toString()
                    .match(/host:.{0,}/gi)[0] // Match the first instance of 'Host:'
                    // Get what's between 'host: ' and '.gotham311.xyz' (returns null if nothing found)
                    .match(/(?<=host:[ ]{0,})([^ ][^.]{0,})(?=.gotham311.xyz)/gi);
                if (subdomain !== null) subdomain = subdomain[0]; // If we didn't get null we only want the first result
            } catch (err) {
                req.send('Error')
            }
            // Do different things based on what we got
            switch(subdomain) {
                case null:
                case 'www':
                    console.log('Hit main site')
                    // Create a new socket
                    let middleMan = new net.Socket();
                    // Connect to the main site
                    middleMan.connect('443', 'desolate-journey-88560.herokuapp.com', function () {
                        // Forward the request
                        middleMan.write(data);
                    });
                    // When we get data back...
                    middleMan.on("data", function (res) {
                        // Hand the response back to the requestee
                        req.write(res);
                    });
                    break;
                case 'api':
                    console.log('Hit api')
                    break;
                case 'employee':
                    console.log('Hit employee site')
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

const forwardRequest = function ({location, port, request, stream}) {
        let middleMan = new net.Socket();
        middleMan.connect(port, location, function () {
            middleMan.write(request);
        });
        middleMan.on("data", function (received_data) {
            stream.write(received_data);
        });
}