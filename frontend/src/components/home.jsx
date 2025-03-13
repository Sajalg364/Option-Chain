import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Realtime Option Chain</h1>
      <ul>
        <li><Link to="/option-chain" className="text-blue-500">Option Chain</Link></li>
        <li><Link to="/realtime" className="text-blue-500">Realtime Data Inspector</Link></li>
      </ul>
    </div>
  );
}

export default Home;