const initialData = {
    strikes: Array.from({ length: 75 }, (_, i) => {
      const strikePrice = 20000 + i * 100;
      const isCallInTheMoney = strikePrice < 22000;
      const isPutInTheMoney = strikePrice > 22000;
  
      return {
        strike: strikePrice,
        token: `token${i}`,
        callPrice: isCallInTheMoney ? 150 + Math.random() * 50 : 50 + Math.random() * 50,
        putPrice: isPutInTheMoney ? 150 + Math.random() * 50 : 50 + Math.random() * 50,
      };
    }),
    underlyingPrice: 22000 + Math.random() * 1000
  };
  
  module.exports = {
    initialData
  };