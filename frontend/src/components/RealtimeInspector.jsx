import React, { useState, useEffect, useContext, createContext } from 'react';

const WebSocketContext = createContext();

const WebSocketProvider=({ children })=> {
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
    };
    setWs(socket);
  };

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

const RealtimeInspector =()=> {
  const { data, connect, disconnect, isConnected } = useContext(WebSocketContext);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Realtime Data Inspector</h1>
      <button onClick={isConnected ? disconnect : connect} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>
      <div>WebSocket Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {data && (
        <table className="min-w-full bg-white mt-4">
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
                <td className="border px-4 py-2">{strike.currentPrice.toFixed(2)}</td>
                <td className="border px-4 py-2">{(((strike.currentPrice || strike.price) - strike.price) / strike.price * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function RealtimeInspectorWrapper () {
  return (
    <WebSocketProvider>
      <RealtimeInspector />
    </WebSocketProvider>
  );
}