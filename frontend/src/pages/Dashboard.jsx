import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NextAppointmentCard from '../components/NextAppointmentCard';
import StatCard from '../components/StatCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import DoctorList from '../components/DoctorList';
import DailyTip from '../components/DailyTip';
import { apiFetch } from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, pending: 1, prescriptions: 4 });
    const [nextAppointment, setNextAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('medichannel_user') || '{}');

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/doctors');
            return;
        }

        const fetchDashboardData = async () => {
            if (!user.id) return;
            try {
                const data = await apiFetch(`/appointments?userId=${user.id}&role=${user.role}`);
                setStats(prev => ({ ...prev, total: data.length }));

                // Find next upcoming appointment
                const now = new Date();
                const upcoming = data
                    .filter(a => a.status !== 'cancelled' && new Date(`${a.appointment_date}T${a.appointment_time}`) > now)
                    .sort((a, b) => new Date(`${a.appointment_date}T${a.appointment_time}`) - new Date(`${b.appointment_date}T${b.appointment_time}`))[0];

                setNextAppointment(upcoming);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user.id, user.role]);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-main">
                <Header />

                <div className="dashboard-grid">
                    {/* Left Main Column */}
                    <div className="grid-main-col">
                        <section className="dashboard-section">
                            <h3 className="section-label">Next Appointment</h3>
                            <button
                                className="view-calendar-btn"
                                onClick={() => navigate('/calendar')}
                            >
                                View Calendar
                            </button>
                            {nextAppointment ? (
                                <NextAppointmentCard
                                    doctorName={nextAppointment.doctorName}
                                    specialty={nextAppointment.specialty}
                                    date={nextAppointment.appointment_date}
                                    time={nextAppointment.appointment_time}
                                />
                            ) : (
                                <div className="no-appointments-card" style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    {loading ? 'Loading...' : 'No upcoming appointments.'}
                                </div>
                            )}
                        </section>

                        <section className="dashboard-section">
                            <QuickActions role={user.role} />
                        </section>

                        <section className="dashboard-section">
                            <DoctorList />
                        </section>
                    </div>

                    {/* Right Side Column */}
                    <div className="grid-side-col">
                        <div className="stats-stack">
                            <StatCard title="Total Appointments" value={stats.total.toString()} />
                            <StatCard title="Pending Reports" value={stats.pending.toString()} />
                            <StatCard title="Prescriptions" value={stats.prescriptions.toString()} />
                        </div>

                        <div className="activity-section">
                            <RecentActivity />
                        </div>

                        <div className="tip-section">
                            <DailyTip />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
