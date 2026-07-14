import React from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/shared/Breadcrumbs';
import Badge from '../components/shared/Badge';
import {
    Calendar,
    Clock,
    Video,
    Info,
    CheckCircle2,
    CreditCard,
    Video as VideoIcon,
    Calendar as CalendarIcon,
    XCircle,
    Star,
    UserCheck,
    Download
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import './AppointmentDetails.css';

const AppointmentDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointment, setAppointment] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await apiFetch(`/appointments/${id}`);
                setAppointment(data);
            } catch (err) {
                console.error('Failed to fetch appointment details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleDownloadReceipt = () => {
        if (!appointment) return;
        const content = `
========================================
       MEDI CHANNEL HEALTH PORTAL       
          OFFICIAL E-RECEIPT           
========================================

RECEIPT NO: MC-${appointment.id.toString().padStart(6, '0')}
DATE: ${new Date().toLocaleDateString()}
TIME: ${new Date().toLocaleTimeString()}

----------------------------------------
APPOINTMENT DETAILS
----------------------------------------
Doctor: ${appointment.doctorName}
Specialty: ${appointment.specialty}
Hospital: Asiri Health, Colombo
Date: ${appointment.appointment_date}
Time: ${appointment.appointment_time}

----------------------------------------
FEES BREAKDOWN
----------------------------------------
Consultation Fee: LKR ${appointment.price?.toLocaleString()}
Hospital Charges: LKR 500.00
Booking Fee:      LKR 350.00
----------------------------------------
TOTAL PAID:       LKR ${totalPaid.toLocaleString()}
----------------------------------------

Payment Status: SUCCESSFUL
Payment Method: Online Payment

========================================
   THANK YOU FOR CHANNELING WITH US!   
   For support: +94 11 234 5678        
   www.medichannel.com                 
========================================
        `;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `MediChannel_Receipt_${appointment.id}.txt`;
        link.click();
    };

    if (loading) return <div className="dashboard-layout"><Sidebar /><main className="dashboard-main">Loading details...</main></div>;
    if (!appointment) return <div className="dashboard-layout"><Sidebar /><main className="dashboard-main">Appointment not found.</main></div>;

    const breadcrumbItems = [
        { label: 'Home', path: '/dashboard' },
        { label: 'Appointment Calendar', path: '/calendar' },
        { label: 'Details' }
    ];

    const totalPaid = (appointment.price || 2500) + 850;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <style>
                    {`
                    @media print {
                        .sidebar, .page-header, .payment-status, .manage-widget, .breadcrumb-nav {
                            display: none !important;
                        }
                        .dashboard-main {
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                        .details-grid {
                            display: block !important;
                        }
                        .widget {
                            border: 1px solid #000 !important;
                            color: #000 !important;
                            background: #fff !important;
                            box-shadow: none !important;
                        }
                        .doc-name, .time-card-value, .fee-value {
                            color: #000 !important;
                        }
                    }
                    `}
                </style>
                <header className="page-header">
                    <Breadcrumbs items={breadcrumbItems} />
                    <div className="header-title-row">
                        <h1 className="header-title">Appointment #{appointment.id}</h1>
                        <Badge status={appointment.status}>{appointment.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}</Badge>
                    </div>
                </header>

                <div className="details-grid">
                    <div className="details-main-col">
                        <div className="details-doc-card">
                            <div className="doc-avatar-container">
                                <img
                                    src={appointment.image_url || `https://ui-avatars.com/api/?name=${appointment.doctorName}&background=random`}
                                    alt={appointment.doctorName}
                                    className="doc-avatar"
                                />
                            </div>
                            <div className="doc-info">
                                <h2 className="doc-name">{appointment.doctorName}</h2>
                                <p className="doc-specialty">{appointment.specialty}</p>
                            </div>
                        </div>

                        <div className="widget date-time-widget">
                            <div className="widget-header">
                                <Clock size={18} className="widget-icon" />
                                <h3>Date & Time (SLT)</h3>
                            </div>
                            <div className="time-cards-row">
                                <div className="time-card">
                                    <span className="time-card-label">Date</span>
                                    <span className="time-card-value">{appointment.appointment_date}</span>
                                </div>
                                <div className="time-card">
                                    <span className="time-card-label">Time</span>
                                    <span className="time-card-value">{appointment.appointment_time}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="details-side-col">
                        <div className="widget fees-widget">
                            <h3 className="widget-subtitle">Channeling Fees</h3>
                            <div className="fee-row total">
                                <span>Consultation Fee</span>
                                <span className="fee-value">LKR {appointment.price?.toLocaleString() || '2,500'}</span>
                            </div>
                            <div className="fee-row">
                                <span>Hospital & Booking Fee</span>
                                <span className="fee-value">LKR 850.00</span>
                            </div>
                            <div className="fee-divider"></div>
                            <div className="fee-row grand-total">
                                <span>Total Paid</span>
                                <span className="fee-value">LKR {totalPaid.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="payment-status">
                            <CheckCircle2 size={14} /> <span>Paid via Online Payment</span>
                        </div>

                        {/* Manage Appointment Widget */}
                        <div className="widget manage-widget" style={{ marginTop: '1.5rem' }}>
                            <h3 className="widget-subtitle">Manage Appointment</h3>
                            <div className="manage-actions">
                                <button className="btn-primary-gradient" onClick={() => window.print()} style={{ width: '100%', marginBottom: '0.75rem' }}>
                                    <Download size={18} /> Print Official Receipt (PDF)
                                </button>
                                <button
                                    className="btn-danger-outline"
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to cancel this appointment?')) {
                                            apiFetch(`/appointments/${id}/cancel`, { method: 'PUT' })
                                                .then(() => {
                                                    alert('Appointment cancelled');
                                                    window.location.reload();
                                                });
                                        }
                                    }}
                                    style={{ width: '100%' }}
                                    disabled={appointment.status === 'cancelled'}
                                >
                                    <XCircle size={18} /> Cancel Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppointmentDetails;
