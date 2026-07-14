import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Users, User, Calendar, Plus, Trash2, Edit, X, Clock, DollarSign, MapPin } from 'lucide-react';
import { apiFetch } from '../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Toast from '../components/shared/Toast';
import './Manage.css';

const Manage = () => {
    const [activeTab, setActiveTab] = useState('doctors');
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [formData, setFormData] = useState({});

    const [selectedDoctorForSchedule, setSelectedDoctorForSchedule] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'doctors' || activeTab === 'schedules') {
                const data = await apiFetch('/doctors');
                setDoctors(data);
                if (data.length > 0 && activeTab === 'schedules' && !selectedDoctorForSchedule) {
                    setSelectedDoctorForSchedule(data[0]);
                }
            }
            if (activeTab === 'patients') {
                const data = await apiFetch('/api/users/patients');
                setPatients(data);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to remove this ${type}?`)) return;
        try {
            let endpoint = '';
            if (type === 'doctor') endpoint = `/doctors/${id}`;
            else if (type === 'patient') endpoint = `/api/users/${id}`;
            else if (type === 'schedule') endpoint = `/doctors/schedules/${id}`;

            await apiFetch(endpoint, { method: 'DELETE' });
            setToastMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully!`);
            fetchData();
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            let endpoint = '';
            let body = {};
            if (activeTab === 'doctors') {
                endpoint = '/doctors';
                body = { ...formData, rating: 5, reviews: 0, experience: parseInt(formData.experience) || 0, price: parseInt(formData.price) || 2500 };
            } else if (activeTab === 'patients') {
                endpoint = '/api/users/patients';
                body = formData;
            } else if (activeTab === 'schedules') {
                endpoint = `/doctors/${selectedDoctorForSchedule.id}/schedules`;
                body = formData;
            }

            await apiFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(body)
            });

            setToastMessage(`${activeTab.slice(0, -1)} added successfully!`);
            setShowModal(false);
            setFormData({});
            fetchData();
        } catch (err) {
            alert('Failed to add: ' + err.message);
        }
    };

    const renderDoctors = () => (
        <div className="manage-doctors">
            <div className="add-btn-floating">
                <Button onClick={() => { setFormData({}); setShowModal(true); }}>
                    <Plus size={18} /> Add Doctor
                </Button>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Doctor</th>
                        <th>Specialty</th>
                        <th>Price</th>
                        <th>Hospital</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map(doc => (
                        <tr key={doc.id}>
                            <td>
                                <div className="doctor-info-cell">
                                    <img src={doc.image_url} alt="" className="doctor-mini-img" />
                                    <span>{doc.fullname}</span>
                                </div>
                            </td>
                            <td>{doc.specialty}</td>
                            <td style={{ color: '#60a5fa', fontWeight: 'bold' }}>LKR {doc.price?.toLocaleString()}</td>
                            <td>{doc.hospital}</td>
                            <td>
                                <div className="action-btns">
                                    <button className="btn-icon delete" onClick={() => handleDelete('doctor', doc.id)}><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderPatients = () => (
        <div className="manage-patients">
            <div className="add-btn-floating">
                <Button onClick={() => { setFormData({}); setShowModal(true); }}>
                    <Plus size={18} /> Add Patient
                </Button>
            </div>
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
                                    <button className="btn-icon delete" onClick={() => handleDelete('patient', p.id)}><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderSchedules = () => (
        <div className="manage-schedules">
            <div className="schedule-manage-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                <div className="doctor-list-side">
                    <h3>Specialists</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                        {doctors.map(d => (
                            <button
                                key={d.id}
                                onClick={() => setSelectedDoctorForSchedule(d)}
                                style={{
                                    padding: '0.75rem',
                                    background: selectedDoctorForSchedule?.id === d.id ? 'rgba(96, 165, 250, 0.2)' : 'rgba(255,255,255,0.05)',
                                    border: '1px solid',
                                    borderColor: selectedDoctorForSchedule?.id === d.id ? '#60a5fa' : 'rgba(255,255,255,0.1)',
                                    borderRadius: '0.75rem',
                                    color: selectedDoctorForSchedule?.id === d.id ? '#60a5fa' : '#fff',
                                    textAlign: 'left',
                                    cursor: 'pointer'
                                }}
                            >
                                {d.fullname}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="select-doctor-schedule">
                    {selectedDoctorForSchedule ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3>Schedules for {selectedDoctorForSchedule.fullname}</h3>
                                <Button onClick={() => { setFormData({}); setShowModal(true); }}>
                                    <Plus size={16} /> Add Slot
                                </Button>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedDoctorForSchedule.schedules?.map(s => (
                                        <tr key={s.id}>
                                            <td>{s.day_of_week}</td>
                                            <td>{s.start_time}</td>
                                            <td>{s.end_time}</td>
                                            <td>
                                                <button className="btn-icon delete" onClick={() => handleDelete('schedule', s.id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!selectedDoctorForSchedule.schedules || selectedDoctorForSchedule.schedules.length === 0) && (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No schedules defined yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <p>Loading doctor info...</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <div className="manage-container">
                    <header className="manage-header">
                        <h1>System Management</h1>
                        <p>Configure doctors, patients, and appointment schedules.</p>
                    </header>

                    <div className="manage-tabs">
                        <button className={`manage-tab ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} /> Doctors
                            </div>
                        </button>
                        <button className={`manage-tab ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Users size={18} /> Patients
                            </div>
                        </button>
                        <button className={`manage-tab ${activeTab === 'schedules' ? 'active' : ''}`} onClick={() => setActiveTab('schedules')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={18} /> Schedules
                            </div>
                        </button>
                    </div>

                    <div className="manage-content">
                        {loading ? <p>Loading...</p> : (
                            activeTab === 'doctors' ? renderDoctors() :
                                activeTab === 'patients' ? renderPatients() :
                                    renderSchedules()
                        )}
                    </div>
                </div>
            </main>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className="form-grid">
                                <div className="form-full">
                                    <Input
                                        label="Full Name"
                                        placeholder="Enter name"
                                        required
                                        value={formData.fullname || ''}
                                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                    />
                                </div>
                                <div className="form-full">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="email@example.com"
                                        required
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-full">
                                    <Input
                                        label="Password"
                                        isPassword
                                        required
                                        value={formData.password || ''}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                {activeTab === 'doctors' && (
                                    <>
                                        <Input
                                            label="Specialty"
                                            placeholder="e.g. Cardiologist"
                                            required
                                            value={formData.specialty || ''}
                                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                        />
                                        <Input
                                            label="Price (LKR)"
                                            type="number"
                                            placeholder="2500"
                                            required
                                            value={formData.price || ''}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                        <Input
                                            label="Hospital"
                                            placeholder="Asiri Health"
                                            required
                                            value={formData.hospital || ''}
                                            onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                                        />
                                        <Input
                                            label="Experience"
                                            type="number"
                                            placeholder="10"
                                            required
                                            value={formData.experience || ''}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        />
                                    </>
                                )}
                                {activeTab === 'schedules' && (
                                    <>
                                        <div className="form-full">
                                            <label style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>Day of Week</label>
                                            <select
                                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff' }}
                                                value={formData.day_of_week || ''}
                                                onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Day</option>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <Input
                                            label="Start Time"
                                            type="time"
                                            required
                                            value={formData.start_time || ''}
                                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value + ':00' })}
                                        />
                                        <Input
                                            label="End Time"
                                            type="time"
                                            required
                                            value={formData.end_time || ''}
                                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value + ':00' })}
                                        />
                                    </>
                                )}
                            </div>
                            <div style={{ marginTop: '2rem' }}>
                                <Button type="submit" style={{ width: '100%' }}>Confirm & Add</Button>
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

export default Manage;
