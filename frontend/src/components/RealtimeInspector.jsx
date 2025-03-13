import React, { useState, useEffect, useContext, createContext } from 'react';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [subscribedTokens, setSubscribedTokens] = useState([]);
  const [tokenInput, setTokenInput] = useState('');

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

  const subscribeToken = () => {
    if (tokenInput && !subscribedTokens.includes(tokenInput)) {
      setSubscribedTokens([...subscribedTokens, tokenInput]);
    }
  };

  const unsubscribeToken = (token) => {
    setSubscribedTokens(subscribedTokens.filter(t => t !== token));
  };

  return (
    <WebSocketContext.Provider value={{ data, connect, disconnect, isConnected, subscribedTokens, subscribeToken, unsubscribeToken, tokenInput, setTokenInput }}>
      {children}
    </WebSocketContext.Provider>
  );
}

const RealtimeInspector = () => {
  const { data, connect, disconnect, isConnected, subscribedTokens, subscribeToken, unsubscribeToken, tokenInput, setTokenInput } = useContext(WebSocketContext);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Realtime Data Inspector</h1>
      <div className="mb-4">
        <input
          type="text"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Enter token (strike price)"
          className="px-4 py-2 border rounded mr-2"
        />
        <button onClick={subscribeToken} className="px-4 py-2 bg-green-500 text-white rounded mr-2">Subscribe</button>
        <button onClick={() => unsubscribeToken(tokenInput)} className="px-4 py-2 bg-red-500 text-white rounded">Unsubscribe</button>
      </div>
      <div className="mb-4">
        <button onClick={isConnected ? disconnect : connect} className={`px-4 py-2 rounded ${isConnected ? 'bg-red-500' : 'bg-green-500'} text-white`}>
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
        <span className="ml-4 text-lg">
          WebSocket Status: <span className={isConnected ? 'text-green-500' : 'text-red-500'}>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </span>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-2">Subscribed Tokens</h2>
        <ul>
          {subscribedTokens.map((token, index) => {
            let val1 = (data.strikes.find((strike) => strike.strike === parseInt(token)).callCurrentPrice || data.strikes.find((strike) => strike.strike === parseInt(token)).callPrice).toFixed(2);
            let val2 = (((data.strikes.find((strike) => strike.strike === parseInt(token)).callCurrentPrice || data.strikes.find((strike) => strike.strike === parseInt(token)).callPrice) - data.strikes.find((strike) => strike.strike === parseInt(token)).callPrice) / data.strikes.find((strike) => strike.strike === parseInt(token)).callPrice * 100).toFixed(2);
            return (
            <li key={index} className="mb-2">
              <span className="text-lg font-bold mr-2">{token}</span>
              {data && data.strikes.find((strike) => strike.strike === parseInt(token)) && (
                <>
                  <span className="mr-2">Value: {val1}</span>
                  <span className={`mr-2 ${val2 >= 0 ? 'text-green-500' : 'text-red-500'}`}>Change: {val2}%</span>
                </>
              )}
              <button onClick={() => unsubscribeToken(token)} className="px-2 py-1 bg-red-500 text-white rounded">Unsubscribe</button>
            </li>
          )})}
    
        </ul>
      </div>
    </div>
  );
}

export default function RealtimeInspectorWrapper() {
  return (
    <WebSocketProvider>
      <RealtimeInspector />
    </WebSocketProvider>
  );
}