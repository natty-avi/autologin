import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import AdminPanel from './components/AdminPanel';
import AgentDashboard from './components/AgentDashboard';
import Login from './components/Login';

const Root = () => (
    <Router>
        <Switch>
            <Route path="/admin" component={AdminPanel} />
            <Route path="/agent" component={AgentDashboard} />
            <Route path="/login" component={Login} />
            <Route path="/" component={App} />
        </Switch>
    </Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));
