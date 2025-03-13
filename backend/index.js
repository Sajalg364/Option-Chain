const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

const initialData = {
  strikes: Array.from({ length: 75 }, (_, i) => ({
    strike: 20000 + i * 100,
    token: `token${i}`,
    callPrice: 100 + Math.random() * 100,
    putPrice: 100 + Math.random() * 100,
  })),
  underlyingPrice: 22000 + Math.random() * 1000
};

// Endpoint to get initial option chain data
app.get('/option-chain', (req, res) => {
  res.json(initialData);
});

const server = app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');

  const sendRandomData = () => {
    if (ws.readyState === ws.OPEN) {
      const updatedStrikes = initialData.strikes.map((strike) => ({
        ...strike,
        callCurrentPrice: strike.callPrice * (1 + (Math.random() - 0.5) * 0.1),
        putCurrentPrice: strike.putPrice * (1 + (Math.random() - 0.5) * 0.1)
      }));
      ws.send(JSON.stringify({ strikes: updatedStrikes, underlyingPrice: initialData.underlyingPrice * (1 + (Math.random() - 0.5) * 0.1) }));
    }
  };

  const interval = setInterval(sendRandomData, 200);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('WebSocket connection closed');
  });
});