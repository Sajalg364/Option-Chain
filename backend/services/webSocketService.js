const OptionChainModel = require('../models/optionChainModel');

const sendRandomData = (ws) => {
  if (ws.readyState === ws.OPEN) {
    const updatedStrikes = OptionChainModel.initialData.strikes.map((strike) => {
      const callPriceChange = (Math.random() - 0.5) * 0.1;
      const putPriceChange = (Math.random() - 0.5) * 0.1;

      return {
        ...strike,
        callCurrentPrice: strike.callPrice * (1 + callPriceChange),
        putCurrentPrice: strike.putPrice * (1 + putPriceChange)
      };
    });

    ws.send(JSON.stringify({ strikes: updatedStrikes, underlyingPrice: OptionChainModel.initialData.underlyingPrice * (1 + (Math.random() - 0.5) * 0.1) }));
  }
};

module.exports = {
  sendRandomData
};