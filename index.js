const net = require('net');

net
    .createServer()
    .on("connection", (req) => {
        req.on("data", async (data) => {
            let subdomain = null;
            try {
                subdomain = data.toString()
                    .match(/host:.{0,}/gi)[0]
                    .match(/(?<=host:[ ]{0,})([^ ][^.]{0,})(?=.gotham311.xyz)/gi)
            } catch (err) {
                req.send('Error')
            }
                // [0];
            console.log(data);
            console.log('Subdomain:', subdomain);
        });
    })
    .on("error", (err) => {
        throw err;
    })
    .listen({
        port: 8080,
        host: "127.0.0.1",
    });
  