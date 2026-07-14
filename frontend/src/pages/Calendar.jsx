import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, Bell, HelpCircle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Toast from '../components/shared/Toast';
import { apiFetch } from '../utils/api';
import './Calendar.css';

const Calendar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const user = JSON.parse(localStorage.getItem('medichannel_user') || '{}');

    // Set Sri Lankan Time Zone
    const options = { timeZone: 'Asia/Colombo' };
    const slDateStr = currentDate.toLocaleString('en-US', options);
    const slDate = new Date(slDateStr);

    const currentYear = slDate.getFullYear();
    const currentMonth = slDate.getMonth();
    const currentMonthName = slDate.toLocaleString('default', { month: 'long', timeZone: 'Asia/Colombo' });

    useEffect(() => {
        if (location.state?.message) {
            setToastMessage(location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
        }

        const fetchAppointments = async () => {
            if (!user.id) return;
            try {
                const data = await apiFetch(`/appointments?userId=${user.id}&role=${user.role}`);
                setAppointments(data);
            } catch (err) {
                console.error('Failed to fetch appointments:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [location, navigate, user.id, user.role]);

    const handlePrevMonth = () => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() - 1);
        setCurrentDate(d);
    };

    const handleNextMonth = () => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() + 1);
        setCurrentDate(d);
    };

    const handleJumpToday = () => {
        setCurrentDate(new Date());
    };

    // Mock Calendar Data based on current month
    const calendarDays = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
        calendarDays.push({ day: prevMonthDays - i, month: 'prev' });
    }

    // Current month
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = i === todayDay && currentMonth === todayMonth && currentYear === todayYear;
        const isPast = (currentYear < todayYear) || (currentYear === todayYear && currentMonth < todayMonth) || (currentYear === todayYear && currentMonth === todayMonth && i < todayDay);
        const events = [];

        // Add appointments from backend
        appointments.forEach(appt => {
            const apptDate = new Date(appt.appointment_date);
            if (apptDate.getDate() === i && apptDate.getMonth() === currentMonth && apptDate.getFullYear() === currentYear) {
                events.push({
                    id: appt.id,
                    time: appt.appointment_time,
                    title: appt.doctorName || appt.patientName || 'Appointment',
                    type: appt.status === 'cancelled' ? 'error' : 'success'
                });
            }
        });

        calendarDays.push({
            day: i,
            id: i,
            month: 'curr',
            isToday,
            events: events.length > 0 ? events : undefined,
            hasFreeSlot: !isPast && !isToday && i % 7 === 3
        });
    }

    // Next month padding
    const remainingSlots = 35 - calendarDays.length;
    for (let i = 1; i <= (remainingSlots > 0 ? remainingSlots : 42 - calendarDays.length); i++) {
        calendarDays.push({ day: i, month: 'next' });
    }

    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
        <div className="calendar-layout">
            <Sidebar />
            <div className="calendar-main">
                {/* Top Global Header for this page */}
                <header className="global-header">
                    <div className="global-search">
                        <Search size={20} className="search-icon-global" />
                        <input type="text" placeholder="Search appointments, history..." />
                    </div>
                    <div className="header-right-actions">
                        <button className="icon-btn-circle">
                            <Bell size={20} />
                        </button>
                        <button className="support-btn">
                            <HelpCircle size={18} />
                            Support
                        </button>
                    </div>
                </header>

                <div className="calendar-content">
                    <div className="calendar-header-section">
                        <div>
                            <h1>Appointment Calendar</h1>
                            <p>Manage your booked and historical appointments (SLT Time)</p>
                        </div>
                        <div className="calendar-actions">
                            <div className="view-toggle">
                                <button className="active">Month</button>
                                <button>Week</button>
                                <button>Day</button>
                            </div>
                            <button className="book-new-btn" onClick={() => navigate('/doctors')}>
                                <Plus size={18} />
                                Book New
                            </button>
                        </div>
                    </div>

                    <div className="calendar-controls">
                        <div className="month-nav">
                            <button className="nav-arrow" onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                            <span className="current-month">{currentMonthName} {currentYear}</span>
                            <button className="nav-arrow" onClick={handleNextMonth}><ChevronRight size={20} /></button>
                        </div>
                        <button className="jump-today" onClick={handleJumpToday}>Jump to Today</button>
                    </div>

                    <div className="calendar-grid">
                        {/* Week Headers */}
                        {weekDays.map(day => (day === 'SUN' || day === 'SAT') ? <div key={day} className="grid-header-cell weekend">{day}</div> : <div key={day} className="grid-header-cell">{day}</div>)}

                        {/* Days */}
                        {calendarDays.map((day, idx) => (
                            <div key={idx} className={`grid-cell ${day.month !== 'curr' ? 'other-month' : ''}`}>
                                <div className={`day-number ${day.isToday ? 'today' : ''}`}>{day.day}</div>

                                <div className="events-stack">
                                    {day.events?.map((event, i) => (
                                        <div key={i} className={`event-pill ${event.type}`}>
                                            {event.time && <span className="event-time">{event.time}</span>}
                                            {event.time && ' • '}
                                            <span className="event-title">{event.title}</span>
                                        </div>
                                    ))}
                                    {day.hasFreeSlot && (
                                        <div className="free-slot-pill">+ Available</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage('')} />
            )}
        </div>
    );
};

export default Calendar;
