import React, { useState, useEffect } from 'react';

const OptionChain =()=> {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/option-chain')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Option Chain</h1>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/3 px-4 py-2">Strike</th>
            <th className="w-1/3 px-4 py-2">Current Price</th>
            <th className="w-1/3 px-4 py-2">Percent Change</th>
          </tr>
        </thead>
        <tbody>
          {data.strikes.map((strike, index) => (
            <tr key={index} className="text-center">
              <td className="border px-4 py-2">{strike.strike}</td>
              <td className="border px-4 py-2">{strike.price.toFixed(2)}</td>
              <td className="border px-4 py-2">{(((strike.currentPrice || strike.price) - strike.price) / strike.price * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OptionChain;