import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { apiFetch } from '../utils/api';
import './FindDoctors.css'; // Reuse some styles

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        fullname: '', email: '', password: 'doctor123', specialty: '', hospital: '', experience: 5, image_url: ''
    });

    const fetchDoctors = async () => {
        try {
            const data = await apiFetch('/doctors');
            setDoctors(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/doctors', {
                method: 'POST',
                body: JSON.stringify(newDoctor)
            });
            setIsAdding(false);
            setNewDoctor({ fullname: '', email: '', password: 'doctor123', specialty: '', hospital: '', experience: 5, image_url: '' });
            fetchDoctors();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="find-doctors-layout">
            <Sidebar />
            <div className="find-doctors-main">
                <header className="page-header">
                    <div className="header-text">
                        <h1>Manage Doctors</h1>
                        <p>Add, update or remove specialists from the system.</p>
                    </div>
                    <button className="book-new-btn" onClick={() => setIsAdding(true)}>
                        <Plus size={18} /> Add New Doctor
                    </button>
                </header>

                {isAdding && (
                    <div className="admin-form-card" style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                        <h3>Add New Specialist</h3>
                        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                            <input type="text" placeholder="Full Name" value={newDoctor.fullname} onChange={e => setNewDoctor({ ...newDoctor, fullname: e.target.value })} required style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white' }} />
                            <input type="email" placeholder="Email" value={newDoctor.email} onChange={e => setNewDoctor({ ...newDoctor, email: e.target.value })} required style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white' }} />
                            <input type="text" placeholder="Specialty" value={newDoctor.specialty} onChange={e => setNewDoctor({ ...newDoctor, specialty: e.target.value })} required style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white' }} />
                            <input type="text" placeholder="Hospital" value={newDoctor.hospital} onChange={e => setNewDoctor({ ...newDoctor, hospital: e.target.value })} required style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white' }} />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="book-new-btn">Save Doctor</button>
                                <button type="button" onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="doctors-table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Specialty</th>
                                <th style={{ padding: '1rem' }}>Hospital</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doc => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem' }}>{doc.fullname}</td>
                                    <td style={{ padding: '1rem' }}>{doc.specialty}</td>
                                    <td style={{ padding: '1rem' }}>{doc.hospital}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ color: doc.available ? '#10b981' : '#f43f5e' }}>
                                            {doc.available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', marginRight: '1rem' }}><Edit2 size={16} /></button>
                                        <button style={{ background: 'transparent', border: 'none', color: '#f43f5e' }}><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDoctors;
