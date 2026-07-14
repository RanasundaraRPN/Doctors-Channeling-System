import React from 'react';
import Card from './shared/Card';
import { Video, Calendar } from 'lucide-react';
import './NextAppointmentCard.css';

const NextAppointmentCard = () => {
    return (
        <Card className="next-appointment-card">
            <div className="appointment-content">
                <div className="date-badge">
                    <span className="date-month">DEC</span>
                    <span className="date-day">28</span>
                </div>

                <div className="doctor-info">
                    <div className="doctor-header">
                        <h3>Dr. Sandamini Jayasiri</h3>
                        <span className="status-badge">CONFIRMED</span>
                    </div>
                    <p className="doctor-details">Cardiologist • 10:00 AM - 11:00 AM • Video Consultation</p>

                    <div className="appointment-actions">
                        <button className="primary-button">
                            <Video size={18} />
                            Join Video Call
                        </button>
                        <button className="secondary-button">
                            Reschedule
                        </button>
                    </div>
                </div>

                <div className="doctor-image-container">
                    <img src="https://ui-avatars.com/api/?name=Sandamini+Jayasiri&background=random" alt="Doctor" className="doctor-image" />
                </div>
            </div>
        </Card>
    );
};

export default NextAppointmentCard;
