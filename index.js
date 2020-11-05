const net = require('net');

net
    .createServer()
    .on("connection", (req) => {
        req.on("data", async (data) => {
            let subdomain = null;
            try {
                subdomain = data.toString()
                    .match(/host:.{0,}/gi)[0]
                    .match(/(?<=host:[ ]{0,})([^ ][^.]{0,})(?=.gotham311.xyz)/gi);
                if (subdomain !== null) subdomain = subdomain[0];
            } catch (err) {
                req.send('Error')
            }
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
  