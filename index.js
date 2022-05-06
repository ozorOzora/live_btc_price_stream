import WebSocket from "ws";

const logs = [];
let currentPrice = undefined;

const ws = new WebSocket("wss://ws.kraken.com");
ws.onopen = () => {

    ws.send(JSON.stringify({ "event": "ping", "reqid": 42 }));
    ws.send(JSON.stringify({ "event": "subscribe", "pair": ["BTC/USD"], "subscription": { "name": "spread" }}));
};
ws.onmessage = d => {

    const data = JSON.parse(d.data);
    if(!data[1]) return;
    if(!data[1][2]) return;
    const date = new Date(parseInt(data[1][2])*1000);
    if(isNaN(date)) return;

    const newPrice = parseInt(data[1][0]);
    if(newPrice == currentPrice) return;

    currentPrice = newPrice;
    logs.push(`${date.toLocaleTimeString()} > ${currentPrice} USD`);
    if(logs.length > 20)
        logs.shift();
};

export { logs };