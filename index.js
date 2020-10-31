const net = require('net');

net
    .createServer()
    .on("connection", (req) => {
        req.on("data", async (data) => {
            console.log(data);
            console.log(data.toString());
        });
    })
    .on("error", (err) => {
        throw err;
    })
    .listen({
        port: 8080,
        host: "127.0.0.1",
    });
  