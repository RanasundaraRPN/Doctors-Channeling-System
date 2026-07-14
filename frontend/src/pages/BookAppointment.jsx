import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, Bell, HelpCircle, Check, CreditCard, Calendar as CalendarIcon, Clock, DollarSign } from 'lucide-react';
import './BookAppointment.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import Button from '../components/Button';

const BookAppointment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState(location.state?.doctor || null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    // If we came from FindDoctors, we might have a doctor pre-selected
    useEffect(() => {
        if (selectedDoctor) {
            setStep(2);
        }
    }, [selectedDoctor]);

    const handleConfirmBooking = async () => {
        setBookingLoading(true);
        const user = JSON.parse(localStorage.getItem('medichannel_user') || '{}');
        try {
            await apiFetch('/appointments', {
                method: 'POST',
                body: JSON.stringify({
                    patient_id: user.id,
                    doctor_id: selectedDoctor.id,
                    appointment_date: selectedDate,
                    appointment_time: selectedTime
                })
            });
            setStep(4); // Success Step
        } catch (err) {
            alert('Booking failed: ' + err.message);
        } finally {
            setBookingLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className="step-content animate-in">
            <h2 className="step-title">Select Specialist</h2>
            <p>Please go back to the <button className="btn-link" onClick={() => navigate('/doctors')}>Booking Hub</button> to select a doctor first.</p>
        </div>
    );

    const renderStep2 = () => {
        // Calculate available days based on doctor schedules
        const availableDays = selectedDoctor.schedules?.map(s => s.day_of_week) || [];

        return (
            <div className="step-content animate-in">
                <div className="booking-summary-top">
                    <img src={selectedDoctor.image || selectedDoctor.image_url} alt="" className="summary-img" />
                    <div>
                        <h3>{selectedDoctor.fullname || selectedDoctor.name}</h3>
                        <p>{selectedDoctor.specialty}</p>
                    </div>
                </div>

                <div className="selection-area">
                    <div className="date-selection">
                        <h4><CalendarIcon size={18} /> Select Date</h4>
                        <input
                            type="date"
                            className="booking-date-input"
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <p className="hint">Doctor is available on: {availableDays.join(', ')}</p>
                    </div>

                    <div className="time-selection">
                        <h4><Clock size={18} /> Available Slots</h4>
                        <div className="time-slots-grid">
                            {selectedDoctor.schedules?.map((s, idx) => (
                                <button
                                    key={idx}
                                    className={`time-slot-pill ${selectedTime === s.start_time ? 'active' : ''}`}
                                    onClick={() => setSelectedTime(s.start_time)}
                                >
                                    {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="step-actions">
                    <Button
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setStep(3)}
                    >
                        Continue to Payment
                    </Button>
                </div>
            </div>
        );
    };

    const renderStep3 = () => (
        <div className="step-content animate-in">
            <h2 className="step-title">Payment & Confirmation</h2>
            <div className="payment-card">
                <div className="payment-details">
                    <div className="pay-row">
                        <span>Consultation Fee</span>
                        <span>LKR {selectedDoctor.price?.toLocaleString()}</span>
                    </div>
                    <div className="pay-row">
                        <span>Hospital Fee</span>
                        <span>LKR 850.00</span>
                    </div>
                    <hr />
                    <div className="pay-row total">
                        <span>Total Payable</span>
                        <span>LKR {(selectedDoctor.price + 850).toLocaleString()}</span>
                    </div>
                </div>

                <div className="card-mockup">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <CreditCard size={24} />
                        <span>VISA / MASTER</span>
                    </div>
                    <div className="mock-input">Valid Card on File (**** 4421)</div>
                </div>

                <Button
                    className="btn-pay"
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                >
                    {bookingLoading ? 'Processing...' : 'Pay & Confirm Booking'}
                </Button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="step-content success-step animate-in">
            <div className="success-icon-circle">
                <Check size={48} />
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Your appointment with <strong>{selectedDoctor.fullname || selectedDoctor.name}</strong> has been successfully scheduled for <strong>{selectedDate}</strong> at <strong>{selectedTime.slice(0, 5)}</strong>.</p>
            <div className="success-actions">
                <Button onClick={() => navigate('/calendar')}>Go to Calendar</Button>
                <button className="btn-secondary-outline" onClick={() => navigate('/dashboard')}>Home</button>
            </div>
        </div>
    );

    return (
        <div className="book-appt-layout">
            <Sidebar />
            <div className="book-appt-main">
                <header className="book-appt-header">
                    <button onClick={() => navigate(-1)} className="back-link-btn">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div className="header-right-actions">
                        <Bell size={20} />
                        <HelpCircle size={20} />
                    </div>
                </header>

                <div className="book-appt-content">
                    {step < 4 && (
                        <div className="progress-section">
                            <div className="progress-header">
                                <span className="step-label">STEP {step} OF 3</span>
                                <span className="step-completion">{step === 1 ? '33%' : step === 2 ? '66%' : '90%'} Completed</span>
                            </div>
                            <h2 className="step-title">
                                {step === 1 ? 'Select Specialist' : step === 2 ? 'Select Date & Time' : 'Review & Pay'}
                            </h2>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '90%' }}></div>
                            </div>
                        </div>
                    )}

                    <div className="booking-wizard-body">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 4 && renderStep4()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
