import React, { useState, useEffect, useContext, createContext, useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import Breadcrumb from './common/breadCrumbs';

// WebSocket context for real-time updates
const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
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
      if (isConnected) {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      }
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

  return (
    <WebSocketContext.Provider value={{ data, connect, disconnect, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

const OptionChain = () => {
  const { data, connect, disconnect, isConnected } = useContext(WebSocketContext);

  const Row = useCallback(({ index, style }) => {
    const strike = data.strikes[index];
    const callChange = (((strike.callCurrentPrice || strike.callPrice) - strike.callPrice) / strike.callPrice * 100).toFixed(2);
    const putChange = (((strike.putCurrentPrice || strike.putPrice) - strike.putPrice) / strike.putPrice * 100).toFixed(2);
    const isAtTheMoney = (strike.strike === Math.round(data.underlyingPrice / 100) * 100);
    const isInTheMoneyCall = (strike.strike < Math.round(data.underlyingPrice / 100) * 100);
    const isInTheMoneyPut = (strike.strike > Math.round(data.underlyingPrice / 100) * 100);

    return (
      <div style={style} className="flex text-center">
        <div className={`border px-4 py-2 w-1/5 ${callChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>{callChange}%</div>
        <div className="border px-4 py-2 w-1/5">{(strike.callCurrentPrice || strike.callPrice).toFixed(2)}</div>
        <div className={`border px-4 py-2 w-1/5 ${isAtTheMoney ? 'bg-yellow-100' : isInTheMoneyCall ? 'bg-green-100' : 'bg-red-100'}`}>{strike.strike}</div>
        <div className="border px-4 py-2 w-1/5">{(strike.putCurrentPrice || strike.putPrice).toFixed(2)}</div>
        <div className={`border px-4 py-2 w-1/5 ${putChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>{putChange}%</div>
      </div>
    );
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-center bg-white">
        <div className="my-4 flex bg-white">
          <Breadcrumb />
        </div>
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 mt-10">Option Chain</h1>
        <div className="mb-4 flex flex-row items-center justify-between">
          <div className="">
            <span className="text-xl font-bold">Underlying Price: </span>
            <span className="text-xl">{data.underlyingPrice.toFixed(2)}</span>
          </div>
          <div className="flex flex-row items-center">
            <button onClick={isConnected ? disconnect : connect} className={`px-4 py-2 rounded ${isConnected ? 'bg-red-500' : 'bg-green-500'} text-white`}>
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
            <span className="ml-4 text-lg">
              WebSocket Status: <span className={isConnected ? 'text-green-500' : 'text-red-500'}>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </span>
          </div>
        </div>

        <div className="overflow-auto">
          <div className="min-w-full bg-white">
            <div className="bg-gray-800 text-white flex border-2 border-gray-500">
              <div className="w-2/5 px-4 py-2 flex justify-center">Call</div>
              <div className="w-1/5 px-4 py-2"></div>
              <div className="w-2/5 px-4 py-2 flex justify-center">Put</div>
            </div>
            <div className="bg-gray-800 text-white flex border-2 border-gray-500">
              <div className="w-1/5 px-4 py-2 flex justify-center">Change</div>
              <div className="w-1/5 px-4 py-2 flex justify-center">Price</div>
              <div className="w-1/5 px-4 py-2 flex justify-center">Strike Price</div>
              <div className="w-1/5 px-4 py-2 flex justify-center">Price</div>
              <div className="w-1/5 px-4 py-2 flex justify-center">Change</div>
            </div>
            <List
              height={750}
              itemCount={data.strikes.length}
              itemSize={35}
              width="100%"
            >
              {Row}
            </List>
          </div>
        </div>
      </div>
    </>
  );
};

export default function OptionChainWrapper() {
  return (
    <WebSocketProvider>
      <OptionChain />
    </WebSocketProvider>
  );
}