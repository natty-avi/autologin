import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from './components/AdminPanel.js';
import AgentDashboard from './components/AgentDashboard.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<AdminPanel/>} />
        <Route exact path="/agent" element={<AgentDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;