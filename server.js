const http = require("http");
const fs = require("fs");
const myserver = http.createServer((req, res) => {
    // console.log(" New Request received");
    // console.log(req.headers);
    // console.log(req);
    const now = new Date();
    const log = `${now.toISOString()} ${req.method} ${req.url}\n`;
    console.log(log.trim());
    fs.appendFile('logs.txt', log, (err) => {
        if (err) console.error('Failed to write log:', err);
    });
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("Response from server");
});

const PORT = process.env.PORT || 8000;
myserver.listen(PORT, () => console.log(`Server started on port ${PORT}`));

myserver.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Kill the process using that port or set a different PORT.`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});






