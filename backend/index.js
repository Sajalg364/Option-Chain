const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const optionChainRoutes = require('./routes/optionChainRoutes');
const webSocketService = require('./services/webSocketService');

const app = express();
const port = 5000;

app.use(cors());
app.use(optionChainRoutes);

const server = app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');

  const interval = setInterval(() => webSocketService.sendRandomData(ws), 200);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('WebSocket connection closed');
  });
});



















// const express = require('express');
// const WebSocket = require('ws');
// const cors = require('cors');

// const app = express();
// const port = 5000;

// app.use(cors());

// const initialData = {
//   strikes: Array.from({ length: 75 }, (_, i) => {
//     const strikePrice = 20000 + i * 100;
//     const isCallInTheMoney = strikePrice < 22000;
//     const isPutInTheMoney = strikePrice > 22000;

//     return {
//       strike: strikePrice,
//       token: `token${i}`,
//       callPrice: isCallInTheMoney ? 150 + Math.random() * 50 : 50 + Math.random() * 50,
//       putPrice: isPutInTheMoney ? 150 + Math.random() * 50 : 50 + Math.random() * 50,
//     };
//   }),
//   underlyingPrice: 22000 + Math.random() * 1000
// };

// // Endpoint to get initial option chain data
// app.get('/option-chain', (req, res) => {
//   res.json(initialData);
// });

// const server = app.listen(port, () => {
//   console.log(`Backend server running at http://localhost:${port}`);
// });

// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//   console.log('WebSocket connection established');

//   const sendRandomData = () => {
//     if (ws.readyState === ws.OPEN) {
//       const updatedStrikes = initialData.strikes.map((strike) => {
//         const callPriceChange = (Math.random() - 0.5) * 0.1;
//         const putPriceChange = (Math.random() - 0.5) * 0.1;

//         return {
//           ...strike,
//           callCurrentPrice: strike.callPrice * (1 + callPriceChange),
//           putCurrentPrice: strike.putPrice * (1 + putPriceChange)
//         };
//       });

//       ws.send(JSON.stringify({ strikes: updatedStrikes, underlyingPrice: initialData.underlyingPrice * (1 + (Math.random() - 0.5) * 0.1) }));
//     }
//   };

//   const interval = setInterval(sendRandomData, 500);

//   ws.on('close', () => {
//     clearInterval(interval);
//     console.log('WebSocket connection closed');
//   });
// });