const net = require('net');

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
            console.log(subdomain)
        });
    })
    .on("error", (err) => {
        throw err;
    })
    .listen({
        port: 8080,
        host: "127.0.0.1",
    });
  