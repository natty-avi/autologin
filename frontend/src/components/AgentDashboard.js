import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import api from '../services/api';

const AgentDashboard = () => {
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const fetchPartners = async () => {
            const response = await api.get('/admin/partners');
            setPartners(response.data);
        };
        fetchPartners();
    }, []);

    const handleLogin = async (id) => {
        await api.post('/agent/login', { partnerId: id });
        alert('Login triggered');
    };

    return (
        <div className="container">
            <h1>Agent Dashboard</h1>
            <ul className="list-group">
                {partners.map(partner => (
                    <li key={partner.id} className="list-group-item">
                        {partner.name}
                        <button onClick={() => handleLogin(partner.id)} className="btn btn-primary">Login</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AgentDashboard;

