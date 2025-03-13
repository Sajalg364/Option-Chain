import React, { useState, useEffect, useContext, createContext } from 'react';

// WebSocket context for real-time updates
const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    const socket = new WebSocket('ws://localhost:5000');
    socket.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };
    socket.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };
    socket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      setTimeout(connect, 1000); // Attempt to reconnect after 1 second
    };
    setWs(socket);
  };

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  const disconnect = () => {
    if (ws) {
      ws.close();
    }
  };

  return (
    <WebSocketContext.Provider value={{ data, connect, disconnect, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

const OptionChain = () => {
  const { data, connect, disconnect, isConnected } = useContext(WebSocketContext);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Option Chain</h1>
      <div className="mb-4">
        <span className="text-xl font-bold">Underlying Price: </span>
        <span className="text-xl">{data.underlyingPrice.toFixed(2)}</span>
      </div>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th colSpan="2" className="w-2/5 px-4 py-2">Call</th>
            <th rowSpan="1" className="w-1/5 px-4 py-2"></th>
            <th colSpan="2" className="w-2/5 px-4 py-2">Put</th>
          </tr>
          <tr>
            <th className="w-1/5 px-4 py-2">Change</th>
            <th className="w-1/5 px-4 py-2">Price</th>
            <th className="w-1/5 px-4 py-2">Strike Price</th>
            <th className="w-1/5 px-4 py-2">Price</th>
            <th className="w-1/5 px-4 py-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {data.strikes.map((strike, index) => {
            const callChange = (((strike.callCurrentPrice || strike.callPrice) - strike.callPrice) / strike.callPrice * 100).toFixed(2);
            const putChange = (((strike.putCurrentPrice || strike.putPrice) - strike.putPrice) / strike.putPrice * 100).toFixed(2);
            const isAtTheMoney = (strike.strike === Math.round(data.underlyingPrice / 100) * 100);
            const isInTheMoneyCall = (strike.strike < Math.round(data.underlyingPrice / 100) * 100);
            const isInTheMoneyPut = (strike.strike > Math.round(data.underlyingPrice / 100) * 100);

            return (
              <tr key={index} className="text-center">
                <td className={`border px-4 py-2 ${callChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>{callChange}%</td>
                <td className="border px-4 py-2">{(strike.callCurrentPrice || strike.callPrice).toFixed(2)}</td>
                <td className={`border px-4 py-2 ${isAtTheMoney ? 'bg-yellow-100' : isInTheMoneyCall ? 'bg-green-100' : 'bg-red-100'}`}>{strike.strike}</td>
                <td className="border px-4 py-2">{(strike.putCurrentPrice || strike.putPrice).toFixed(2)}</td>
                <td className={`border px-4 py-2 ${putChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>{putChange}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4">
        <button onClick={isConnected ? disconnect : connect} className={`px-4 py-2 rounded ${isConnected ? 'bg-red-500' : 'bg-green-500'} text-white`}>
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
        <span className="ml-4 text-lg">
          WebSocket Status: <span className={isConnected ? 'text-green-500' : 'text-red-500'}>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </span>
      </div>
    </div>
  );
}

export default function OptionChainWrapper() {
  return (
    <WebSocketProvider>
      <OptionChain />
    </WebSocketProvider>
  );
}