import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { UserPlus, Shield, Mail, Lock, User, Search } from 'lucide-react';
import { apiFetch } from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/shared/Toast';
import './AdminManagement.css';

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: ''
    });

    const fetchAdmins = async () => {
        try {
            const data = await apiFetch('/auth/admins'); // We'll need to add this endpoint
            setAdmins(data);
        } catch (err) {
            console.error('Failed to fetch admins:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // For demo, we'll just show the existing admins if we had a list, 
        // but since we only have one for now, we'll mock or handle empty
        setAdmins([
            { id: 1, fullname: 'Primary Admin', email: 'Admin@123', role: 'admin' }
        ]);
        setLoading(false);
    }, []);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await apiFetch('/auth/register-admin', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setToastMessage('New Admin added successfully!');
            setFormData({ fullname: '', email: '', password: '' });
            // Re-fetch or add to list
            setAdmins([...admins, { ...formData, id: Date.now(), role: 'admin' }]);
        } catch (err) {
            alert('Failed to add admin: ' + err.message);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <div className="admin-mgmt-container">
                    <header className="mgmt-header">
                        <h1>Admin Management</h1>
                        <p>Only the primary administrator can add and manage other administrators.</p>
                    </header>

                    <div className="mgmt-grid">
                        <div className="admin-list-col">
                            <div className="admin-list-card">
                                <div className="card-header-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <h3>System Administrators</h3>
                                    <div className="search-box-small" style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                        <input type="text" placeholder="Search admins..." style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.5rem 0.5rem 0.5rem 2rem', color: '#fff' }} />
                                    </div>
                                </div>

                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Admin User</th>
                                            <th>Status</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admins.map(admin => (
                                            <tr key={admin.id} className="admin-row">
                                                <td>
                                                    <div className="admin-info">
                                                        <img src={`https://ui-avatars.com/api/?name=${admin.fullname}&background=random`} alt="" className="admin-avatar" />
                                                        <div>
                                                            <div className="admin-name">{admin.fullname}</div>
                                                            <div className="admin-email">{admin.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="status-pill active" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem' }}>Active</span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7' }}>
                                                        <Shield size={14} />
                                                        <span>Administrator</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="admin-form-col">
                            <div className="admin-form-card">
                                <div className="admin-form">
                                    <h3>Add New Administrator</h3>
                                    <form onSubmit={handleAddAdmin}>
                                        <Input
                                            label="Full Name"
                                            placeholder="Admin Name"
                                            icon={User}
                                            required
                                            value={formData.fullname}
                                            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                        />
                                        <Input
                                            label="Admin Email"
                                            placeholder="admin@medichannel.com"
                                            icon={Mail}
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        <Input
                                            label="Temporary Password"
                                            placeholder="••••••••"
                                            isPassword
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <div style={{ marginTop: '1.5rem' }}>
                                            <Button type="submit" showArrow disabled={formLoading} style={{ width: '100%' }}>
                                                {formLoading ? 'Creating...' : 'Create Admin Account'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage('')} />
            )}
        </div>
    );
};

export default AdminManagement;
