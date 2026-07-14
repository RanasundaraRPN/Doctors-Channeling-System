import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Bell, Edit2, MoreHorizontal, Shield, Lock, Droplet, ArrowUpFromLine, Weight, Activity, Calendar as CalendarIcon, Clock, ArrowRight, User as UserIcon, CheckCircle2, XCircle, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Toast from '../components/shared/Toast';
import { apiFetch } from '../utils/api';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [toastMessage, setToastMessage] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointmentTab, setAppointmentTab] = useState('active');

    const user = JSON.parse(localStorage.getItem('medichannel_user') || '{}');

    useEffect(() => {
        if (location.state?.message) {
            setToastMessage(location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user.id) return;
            setLoading(true);
            try {
                const data = await apiFetch(`/appointments?userId=${user.id}&role=${user.role}`);
                setAppointments(data);
            } catch (err) {
                console.error('Failed to fetch appointments:', err);
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'appointments') {
            fetchAppointments();
        }
    }, [activeTab, user.id, user.role]);

    const handleCancelAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            await apiFetch(`/appointments/${id}/cancel`, { method: 'PUT' });
            setToastMessage('Appointment cancelled successfully');
            // Optimistically update the UI status
            setAppointments(prev => prev.map(appt =>
                appt.id === id ? { ...appt, status: 'cancelled' } : appt
            ));
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to cancel appointment:', err);
            setToastMessage('Failed to cancel appointment. Please try again.');
        }
    };

    const handleViewSummary = (appt) => {
        setSelectedAppointment(appt);
        setIsModalOpen(true);
    };

    const renderAppointmentModal = () => {
        if (!selectedAppointment) return null;

        const totalPaid = (selectedAppointment.price || 2500) + 850;

        return (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Appointment Summary</h2>
                        <button className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="summary-section">
                            <div className="summary-doc-info">
                                <img
                                    src={selectedAppointment.image_url || `https://ui-avatars.com/api/?name=${selectedAppointment.doctorName}&background=random`}
                                    alt={selectedAppointment.doctorName}
                                />
                                <div>
                                    <h3>{selectedAppointment.doctorName}</h3>
                                    <p>{selectedAppointment.specialty}</p>
                                </div>
                            </div>
                            <div className={`summary-status ${selectedAppointment.status}`}>
                                {selectedAppointment.status.toUpperCase()}
                            </div>
                        </div>

                        <div className="summary-grid">
                            <div className="summary-item">
                                <label>Date</label>
                                <span>{new Date(selectedAppointment.appointment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="summary-item">
                                <label>Time</label>
                                <span>{selectedAppointment.appointment_time}</span>
                            </div>
                            <div className="summary-item">
                                <label>Patient</label>
                                <span>{user.fullname}</span>
                            </div>
                            <div className="summary-item">
                                <label>Hospital</label>
                                <span>Asiri Health, Colombo</span>
                            </div>
                        </div>

                        <div className="payment-summary">
                            <h4>Payment Details</h4>
                            <div className="payment-row">
                                <span>Consultation Fee</span>
                                <span>LKR {selectedAppointment.price?.toLocaleString()}</span>
                            </div>
                            <div className="payment-row">
                                <span>Hospital & Booking Fee</span>
                                <span>LKR 850.00</span>
                            </div>
                            <div className="payment-divider"></div>
                            <div className="payment-row total">
                                <span>Total Paid</span>
                                <span>LKR {totalPaid.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button className="full-details-btn" onClick={() => navigate(`/appointments/${selectedAppointment.id}`)}>
                            Go to Full Receipt
                        </button>
                        {selectedAppointment.status.toLowerCase() === 'confirmed' && (
                            <button
                                className="cancel-btn"
                                style={{ width: '100%' }}
                                onClick={() => handleCancelAppointment(selectedAppointment.id)}
                            >
                                <XCircle size={14} /> Cancel Appointment
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderOverview = () => (
        <div className="profile-content-grid">
            {/* Left Column */}
            <div className="profile-col-left">
                {/* Main Profile Card */}
                <div className="profile-hero-card">
                    <div className="profile-hero-content">
                        <div className="avatar-section">
                            <div className="avatar-wrapper-lg">
                                <img src={user.image || `https://ui-avatars.com/api/?name=${user.fullname}&background=random`} alt={user.fullname} />
                                <div className="verified-badge">✓</div>
                            </div>
                        </div>
                        <div className="profile-info-primary">
                            <div className="name-row">
                                <h2>{user.fullname || 'Pasindu Neranjana'}</h2>
                                <span className="premium-badge">PREMIUM MEMBER</span>
                            </div>
                            <div className="id-row">
                                <span className="patient-id"><Shield size={14} /> Patient ID: #MC-8921</span>
                                <span className="member-since">Member since September 2021</span>
                            </div>
                        </div>
                        <div className="profile-hero-actions">
                            <button className="edit-profile-btn" onClick={() => navigate('/profile-settings')}>
                                <Edit2 size={16} /> Edit Profile
                            </button>
                            <button className="more-options-btn">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="info-section">
                    <h3 className="section-heading"><UserIcon size={18} /> Personal Information</h3>
                    <div className="info-grid">
                        <InfoField label="EMAIL ADDRESS" value={user.email || "pasindu123@gmail.com"} verified />
                        <InfoField label="PHONE NUMBER" value="077 1234 789" />
                        <InfoField label="DATE OF BIRTH" value="Apr 24 2002 (23 years)" />
                        <InfoField label="HOME ADDRESS" value="No: 2-D , Veyangoda , Gampaha" />
                    </div>
                </div>

                {/* Biological Data */}
                <div className="info-section">
                    <div className="section-header-row">
                        <h3 className="section-heading"><Activity size={18} /> Biological Data</h3>
                        <span className="private-tag"><Lock size={12} /> Private</span>
                    </div>
                    <div className="bio-grid">
                        <BioCard icon={Droplet} label="BLOOD TYPE" value="O+" color="#ef4444" />
                        <BioCard icon={ArrowUpFromLine} label="HEIGHT" value="170" unit="cm" color="#3b82f6" />
                        <BioCard icon={Weight} label="WEIGHT" value="65" unit="kg" color="#f59e0b" />
                        <BioCard icon={Activity} label="ALLERGIES" value="Peanuts" color="#8b5cf6" />
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="profile-col-right">
                {/* Next Appointment */}
                <div className="widget-card appointment-widget">
                    <h4 className="widget-title">NEXT APPOINTMENT</h4>
                    <div className="widget-doctor">
                        <div className="doc-avatar-sm">
                            <img src="https://ui-avatars.com/api/?name=Dr+Sadeepa&background=random" alt="Doc" />
                        </div>
                        <div>
                            <div className="doc-name">Dr. Sadeepa</div>
                            <div className="doc-spec">Cardiology</div>
                        </div>
                    </div>
                    <div className="appt-time-row">
                        <div className="appt-pill"><CalendarIcon size={14} /> Tomorrow</div>
                        <div className="appt-pill"><Clock size={14} /> 10:00 AM</div>
                    </div>
                    <button className="details-btn">
                        Details <ArrowRight size={16} />
                    </button>
                </div>

                {/* Emergency Contact */}
                <div className="widget-card">
                    <div className="widget-header-row">
                        <h4 className="widget-title-lg">Emergency Contact</h4>
                        <button className="link-btn">Edit</button>
                    </div>
                    <div className="emergency-contact">
                        <div className="contact-avatar">
                            <UserIcon size={20} />
                        </div>
                        <div className="contact-info">
                            <div className="contact-name">Sumedha Leelanthi</div>
                            <div className="contact-rel">Mother</div>
                            <div className="contact-phone">071 4042 589</div>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="widget-card">
                    <h4 className="widget-title-lg">Security</h4>
                    <div className="security-list">
                        <button className="security-item">
                            <div className="sec-icon"><Activity size={16} /></div>
                            <span>Change Password</span>
                            <ArrowRight size={16} className="arrow-fade" />
                        </button>
                        <button className="security-item">
                            <div className="sec-icon"><Shield size={16} /></div>
                            <span>2FA Settings</span>
                            <ArrowRight size={16} className="arrow-fade" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAppointments = () => {
        const filteredAppointments = appointments.filter(appt => {
            if (appointmentTab === 'active') return appt.status !== 'cancelled';
            if (appointmentTab === 'cancelled') return appt.status === 'cancelled';
            return true;
        });

        return (
            <div className="profile-appointments-tab">
                <div className="tab-header-row">
                    <h3 className="section-heading"><CalendarIcon size={18} /> My Channelling History</h3>
                    <div className="appt-stats">
                        Total: <strong>{appointments.length}</strong>
                    </div>
                </div>

                {/* Appointment Status Tabs */}
                <div className="profile-tabs" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <button
                        className={`tab-btn ${appointmentTab === 'active' ? 'active' : ''}`}
                        onClick={() => setAppointmentTab('active')}
                    >
                        Active ({appointments.filter(a => a.status !== 'cancelled').length})
                    </button>
                    <button
                        className={`tab-btn ${appointmentTab === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setAppointmentTab('cancelled')}
                    >
                        Cancelled ({appointments.filter(a => a.status === 'cancelled').length})
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Fetching your appointments...</p>
                    </div>
                ) : filteredAppointments.length > 0 ? (
                    <div className="appointments-list-grid">
                        {filteredAppointments.map((appt) => (
                            <div key={appt.id} className={`appointment-history-card ${appt.status}`}>
                                <div className="appt-status-banner">
                                    {appt.status === 'confirmed' ? (
                                        <>
                                            <CheckCircle2 size={14} /> Confirmed
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={14} /> {appt.status}
                                        </>
                                    )}
                                </div>
                                <div className="appt-card-content">
                                    <div className="doctor-info-mini">
                                        <img src={appt.image_url || `https://ui-avatars.com/api/?name=${appt.doctorName}&background=random`} alt={appt.doctorName} className="doc-img-mini" />
                                        <div className="doc-details-mini">
                                            <span className="doc-name-mini">{appt.doctorName}</span>
                                            <span className="doc-spec-mini">{appt.specialty}</span>
                                        </div>
                                    </div>
                                    <div className="appt-schedule-info">
                                        <div className="schedule-item">
                                            <CalendarIcon size={14} />
                                            <span>{new Date(appt.appointment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="schedule-item">
                                            <Clock size={14} />
                                            <span>{appt.appointment_time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="appt-card-footer">
                                    <button className="summary-btn" onClick={() => handleViewSummary(appt)}>
                                        <Info size={14} /> View Summary
                                    </button>
                                    <button className="view-details-small" onClick={() => navigate(`/appointments/${appt.id}`)}>
                                        Full Receipt <ArrowRight size={14} />
                                    </button>
                                    {appt.status.toLowerCase() === 'confirmed' && (
                                        <button className="cancel-btn" onClick={() => handleCancelAppointment(appt.id)}>
                                            <XCircle size={14} /> Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-card">
                        <Info size={40} className="empty-icon" />
                        <h4>No Appointments found</h4>
                        <p>You haven't booked any channelling sessions yet.</p>
                        <button className="book-now-cta" onClick={() => navigate('/doctors')}>
                            Find a Doctor
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="profile-layout">
            <Sidebar />
            <div className="profile-main">
                {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
                <header className="profile-header-top">
                    <div className="header-titles">
                        <h1>My Profile</h1>
                        <p>Manage your personal health information and channelling sessions.</p>
                    </div>
                    <div className="profile-tabs-nav">
                        <button
                            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('appointments')}
                        >
                            Appointments
                        </button>
                    </div>
                    <button className="icon-btn-circle">
                        <Bell size={20} />
                    </button>
                </header>

                <div className="profile-active-tab-container">
                    {activeTab === 'overview' ? renderOverview() : renderAppointments()}
                </div>
                {isModalOpen && renderAppointmentModal()}
            </div>
        </div>
    );
};

// Helper Components
const InfoField = ({ label, value, verified }) => (
    <div className="info-field">
        <label className="field-label">{label}</label>
        <div className="field-value-row">
            <span className="field-value">{value}</span>
            {verified && <span className="verified-check">✓</span>}
        </div>
    </div>
);

const BioCard = ({ icon: Icon, label, value, unit, color }) => (
    <div className="bio-card">
        <div className="bio-icon-wrapper" style={{ color: color, backgroundColor: `${color}20` }}>
            <Icon size={18} />
        </div>
        <div className="bio-label">{label}</div>
        <div className="bio-value">
            {value} <span className="bio-unit">{unit}</span>
        </div>
    </div>
);


export default Profile;
