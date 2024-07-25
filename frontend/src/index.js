import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import App from './App';
import AdminPanel from './components/AdminPanel';
import AgentDashboard from './components/AgentDashboard';
import Login from './components/Login';

const Root = () => (
    <Router>
        <Routes>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/agent" element={<AgentDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<App />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));