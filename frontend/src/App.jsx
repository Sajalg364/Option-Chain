import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OptionChain from './components/OptionChain';
import RealtimeInspectorWrapper from './components/RealtimeInspector';
import Home from './components/home';

const App =()=> {
  return (
    <div className="container mx-auto p-4">
      <Router>
        <Routes>
          <Route path="/" element={<OptionChain />} />
          <Route path="/option-chain" element={<OptionChain />} />
          <Route path="/realtime" element={<RealtimeInspectorWrapper />} />
        </Routes>
      </Router> 
    </div>
  );
}

export default App;