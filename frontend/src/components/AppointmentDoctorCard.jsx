import React from 'react';
import { Star, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import './AppointmentDoctorCard.css';

const AppointmentDoctorCard = ({ name, specialty, location, experience, rating, image, onBook }) => {
    const [showProfile, setShowProfile] = React.useState(false);

    return (
        <div className="appt-doctor-card">
            <div className="appt-doc-image-wrapper">
                <img src={image} alt={name} className="appt-doc-image" />
                <div className="appt-rating-badge">
                    <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{rating}</span>
                </div>
            </div>

            <div className="appt-doc-content">
                <h3 className="appt-doc-name">{name}</h3>
                <p className="appt-doc-specialty">{specialty}</p>

                <div className="appt-doc-meta">
                    <div className="meta-pill">
                        <MapPin size={12} /> {location}
                    </div>
                    <div className="meta-pill">
                        <Briefcase size={12} /> {experience}
                    </div>
                </div>

                {showProfile && (
                    <div className="profile-details-expanded animate-in" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="detail-section">
                            <h4>Professional Background</h4>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
                                {specialty} specialist with over {experience} of clinical experience.
                                Currently practicing at <strong>{location}</strong>. High patient satisfaction score.
                            </p>
                        </div>
                        <div className="detail-section" style={{ marginTop: '0.75rem' }}>
                            <h4>Hospital</h4>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{location}, Colombo</p>
                        </div>
                    </div>
                )}

                <div className="appt-card-actions">
                    <button
                        className={`appt-btn-secondary ${showProfile ? 'active' : ''}`}
                        onClick={() => setShowProfile(!showProfile)}
                    >
                        {showProfile ? 'Hide Profile' : 'View Profile'}
                    </button>
                    <button className="appt-btn-primary" onClick={onBook}>
                        Book Appointment <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDoctorCard;
