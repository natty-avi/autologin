import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import AgentDashboard from './components/AgentDashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={AdminPanel} />
        <Route exact path="/agent" component={AgentDashboard} />
      </Switch>
    </Router>
  );
}

export default App;