import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Trash2, AlertCircle, Plus, X } from 'lucide-react';
import { apiFetch } from '../utils/api';
import Toast from '../components/shared/Toast';
import './Calendar.css';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: ''
    });

    const fetchAppointments = async () => {
        try {
            const data = await apiFetch('/appointments?role=admin');
            setAppointments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatientsAndDoctors = async () => {
        try {
            const [patientsData, doctorsData] = await Promise.all([
                apiFetch('/users/patients'),
                apiFetch('/doctors')
            ]);
            setPatients(patientsData);
            setDoctors(doctorsData);
        } catch (err) {
            console.error('Failed to fetch patients/doctors:', err);
        }
    };

    useEffect(() => {
        fetchAppointments();
        fetchPatientsAndDoctors();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await apiFetch(`/appointments/${id}/cancel`, { method: 'PUT' });
            setToastMessage('Appointment cancelled successfully');
            fetchAppointments();
        } catch (err) {
            setToastMessage('Failed to cancel appointment');
        }
    };

    const handleAddAppointment = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stop bubbling

        console.log('Submitting appointment form:', formData);

        if (!formData.patient_id || !formData.doctor_id || !formData.appointment_date || !formData.appointment_time) {
            setToastMessage('Please fill in all fields');
            return;
        }

        try {
            await apiFetch('/appointments', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setToastMessage('Appointment added successfully');
            setShowAddModal(false);
            setFormData({ patient_id: '', doctor_id: '', appointment_date: '', appointment_time: '' });
            fetchAppointments();
        } catch (err) {
            console.error('Add Appointment Error:', err);
            setToastMessage(`Failed to add: ${err.message}`);
        }
    };

    const filteredAppointments = appointments.filter(appt => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return appt.status !== 'cancelled';
        if (activeTab === 'cancelled') return appt.status === 'cancelled';
        return true;
    });

    return (
        <div className="calendar-layout">
            <Sidebar />
            <div className="calendar-main">
                <header className="page-header" style={{ padding: '2rem' }}>
                    <div className="header-text">
                        <h1>Appointment Management</h1>
                        <p>Add, monitor, and manage all patient bookings across the system.</p>
                    </div>
                    <button
                        className="book-new-btn"
                        style={{ marginTop: '1rem' }}
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus size={18} /> Add Appointment
                    </button>
                </header>

                {/* Status Tabs */}
                <div className="profile-tabs" style={{ padding: '0 2rem', marginBottom: '1rem' }}>
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All ({appointments.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Active ({appointments.filter(a => a.status !== 'cancelled').length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cancelled')}
                    >
                        Cancelled ({appointments.filter(a => a.status === 'cancelled').length})
                    </button>
                </div>

                <div className="appointments-list" style={{ padding: '0 2rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-secondary)', borderRadius: '1rem', overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '1.2rem' }}>Patient</th>
                                <th style={{ padding: '1.2rem' }}>Doctor</th>
                                <th style={{ padding: '1.2rem' }}>Date</th>
                                <th style={{ padding: '1.2rem' }}>Time</th>
                                <th style={{ padding: '1.2rem' }}>Status</th>
                                <th style={{ padding: '1.2rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map(appt => (
                                <tr key={appt.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1.2rem' }}>{appt.patientName}</td>
                                    <td style={{ padding: '1.2rem' }}>{appt.doctorName}</td>
                                    <td style={{ padding: '1.2rem' }}>{new Date(appt.appointment_date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1.2rem' }}>{appt.appointment_time}</td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <span className={`status-badge ${appt.status}`} style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.8rem',
                                            background: appt.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                            color: appt.status === 'confirmed' ? '#10b981' : '#f43f5e'
                                        }}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        {appt.status !== 'cancelled' ? (
                                            <button
                                                onClick={() => handleCancel(appt.id)}
                                                style={{
                                                    background: 'rgba(244, 63, 94, 0.1)',
                                                    border: '1px solid rgba(244, 63, 94, 0.2)',
                                                    color: '#f43f5e',
                                                    cursor: 'pointer',
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>No Actions</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Appointment Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>Add New Appointment</h2>
                            <button className="close-modal" onClick={() => setShowAddModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddAppointment}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="input-group">
                                    <label>Patient *</label>
                                    <select
                                        required
                                        value={formData.patient_id}
                                        onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                                        style={{
                                            padding: '0.8rem',
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '0.5rem',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        <option value="">Select Patient</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.fullname} ({p.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Doctor *</label>
                                    <select
                                        required
                                        value={formData.doctor_id}
                                        onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                                        style={{
                                            padding: '0.8rem',
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '0.5rem',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        <option value="">Select Doctor</option>
                                        {doctors.map(d => (
                                            <option key={d.id} value={d.id}>Dr. {d.fullname} - {d.specialty}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.appointment_date}
                                        onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                                        style={{
                                            padding: '0.8rem',
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '0.5rem',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Time *</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.appointment_time}
                                        onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                                        style={{
                                            padding: '0.8rem',
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '0.5rem',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={{
                                        padding: '0.8rem 1.5rem',
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="book-new-btn"
                                >
                                    Add Appointment
                                </button>
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

export default AdminAppointments;
