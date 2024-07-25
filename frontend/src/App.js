import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import AgentDashboard from './components/AgentDashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" element={<AdminPanel/>} />
        <Route exact path="/agent" element={<AgentDashboard/>} />
      </Switch>
    </Router>
  );
}

export default App;