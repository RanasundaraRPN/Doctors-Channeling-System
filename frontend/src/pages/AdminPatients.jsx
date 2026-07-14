import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Trash2, X } from 'lucide-react';
import { apiFetch } from '../utils/api';
import Toast from '../components/shared/Toast';
import './Manage.css'; // Reusing manage styles for table consistency

const AdminPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });

    const fetchPatients = async () => {
        try {
            const data = await apiFetch('/users/patients');
            setPatients(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this patient?')) return;
        try {
            await apiFetch(`/users/${id}`, { method: 'DELETE' });
            setToastMessage('Patient removed successfully!');
            fetchPatients();
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/users/patients', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setToastMessage('Patient added successfully!');
            setShowModal(false);
            setFormData({ fullname: '', email: '', password: '' });
            fetchPatients();
        } catch (err) {
            alert('Failed to add: ' + err.message);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <div className="manage-container">
                    <header className="manage-header">
                        <div className="header-text">
                            <h1>Manage Patients</h1>
                            <p>View and manage registered patients.</p>
                        </div>
                        <button className="book-new-btn" onClick={() => setShowModal(true)}>
                            <Plus size={18} /> Add Patient
                        </button>
                    </header>

                    <div className="manage-content">
                        {loading ? <p>Loading...</p> : (
                            <div className="manage-patients">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Patient Name</th>
                                            <th>Email</th>
                                            <th>Joined Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.map(p => (
                                            <tr key={p.id}>
                                                <td>{p.fullname}</td>
                                                <td>{p.email}</td>
                                                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="btn-icon delete" onClick={() => handleDelete(p.id)} title="Remove Patient">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {patients.length === 0 && (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No patients found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>Add New Patient</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        value={formData.fullname}
                                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'white' }}
                                    />
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" className="book-new-btn">Add Patient</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage('')} />
            )}
        </div>
    );
};

export default AdminPatients;
