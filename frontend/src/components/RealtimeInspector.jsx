import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import Breadcrumb from './common/breadCrumbs';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [subscribedTokens, setSubscribedTokens] = useState([]);
  const [tokenInput, setTokenInput] = useState('');

  const reconnectTimeout = useRef(null);

   useEffect(() => {
      setIsConnected(true);
    }, []);

  const connect = () => {
    const socket = new WebSocket('ws://localhost:5000');
    socket.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };
    socket.onmessage = (event) => {
      if (isConnected) {
        setData(JSON.parse(event.data));
      }
    };
    socket.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };
    setWs(socket);
    // Clear any existing timeout if manual connection happens
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
  };

  useEffect(() => {
    if (isConnected) {
      connect();
      return () => {
        if (ws) {
          ws.close();
          setIsConnected(false);
        }
      };
    }
  }, [isConnected]); 

  const disconnect = () => {
    if (ws) {
      ws.close();
      setIsConnected(false);
    }
    // Set a timeout to reconnect after 5 seconds
    if (!reconnectTimeout.current) {
      reconnectTimeout.current = setTimeout(() => {
        connect();
        setIsConnected(true);
      }, 5000); // Attempt to reconnect after 5 seconds
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

  return (
    <div className="container mx-auto p-4">
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-center">
        <div className="my-4 flex">
          <Breadcrumb />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4 mt-8">Realtime Data Inspector</h1>
      <div className="flex flex-row items-center justify-between">
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
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-2">Subscribed Tokens</h2>
        <ul>
          {subscribedTokens.map((token, index) => {
            let val1 = (data.strikes.find((strike) => strike.strike === parseInt(token)).callCurrentPrice || data.strikes.find((strike) => strike.strike === parseInt(token)).callPrice).toFixed(2);
            let val2 = ((data.strikes.find((strike) => strike.strike === parseInt(token)).callCurrentPrice || data.strikes.find((strike) => strike.strike === parseInt(token)).callPrice) - data.strikes.find((strike) => strike.strike === parseInt(token)).callPrice).toFixed(2);
            let val3 = (val2 / data.strikes.find((strike) => strike.strike === parseInt(token)).callPrice * 100).toFixed(2);
            return (
              <li key={index} className="mb-2 flex flex-row items-center">
                <div className="flex flex-row items-center w-1/4">
                  <span className="text-lg font-bold mr-2">{token}</span>
                  {data && data.strikes.find((strike) => strike.strike === parseInt(token)) && (
                    <>
                      <span className="mr-2">: {val1}</span>
                      <span className="mr-2">({val2 > 0 && "+"}{val2})</span>
                      <span className={`mr-2 ${val3 >= 0 ? 'text-green-500' : 'text-red-500'}`}> {val3}%</span>
                    </>
                  )}
                </div>
                <div>
                  <button onClick={() => unsubscribeToken(token)} className="px-2 py-1 bg-red-500 text-white rounded">Unsubscribe</button>
                </div>
              </li>
            )
          })}

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