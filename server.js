//serve bad apple .txt
const WebSocket = require('ws');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 8080 });
const frames = fs.readFileSync('Bad-Apple.txt', 'utf8').split("\n");

wss.on('connection', function connection(ws) {
    console.log('client connected');
    ws.on('message', (data) => {
        const frame = parseInt(data);
        ws.send(frames[frame]);
    });
});