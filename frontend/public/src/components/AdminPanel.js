import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

const AdminPanel = () => {
    const [partners, setPartners] = useState([]);
    const [form, setForm] = useState({ name: '', login_url: '', username: '', password: '' });

    const fetchPartners = async () => { // Extract fetchPartners function
        const response = await api.get('/admin/partners');
        setPartners(response.data);
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/admin/partners', form);
        setForm({ name: '', login_url: '', username: '', password: '' });
        fetchPartners();
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Name" />
                <input type="text" name="login_url" value={form.login_url} onChange={handleInputChange} placeholder="Login URL" />
                <input type="text" name="username" value={form.username} onChange={handleInputChange} placeholder="Username" />
                <input type="password" name="password" value={form.password} onChange={handleInputChange} placeholder="Password" />
                <button type="submit">Add Partner</button>
            </form>
            <h2>Partner List</h2>
            <ul>
                {partners.map(partner => (
                    <li key={partner.id}>{partner.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;

