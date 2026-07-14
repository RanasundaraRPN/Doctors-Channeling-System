import React, { useState } from 'react';
import { Star, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import './SpecialistCard.css';

const SpecialistCard = ({
    name,
    specialty,
    hospital,
    rating,
    reviews,
    experience,
    price,
    schedules = [],
    available = false,
    image,
    onBook
}) => {
    const [showProfile, setShowProfile] = useState(false);

    return (
        <div className="specialist-card">
            {available && (
                <span className="availability-badge">● Available Today</span>
            )}

            <div className="specialist-image-wrapper">
                <img src={image} alt={name} className="specialist-image" />
            </div>

            <h3 className="specialist-name">{name}</h3>
            <p className="specialist-title">{specialty}</p>

            <div className="specialist-stats">
                <div className="stat-rating">
                    <Star size={16} fill="#fbbf24" color="#fbbf24" style={{ marginRight: 4 }} />
                    <span className="rating-val">{rating}</span>
                    <span className="rating-count">({reviews})</span>
                </div>
                <div className="stat-divider">•</div>
                <div className="stat-exp">
                    {experience} Yrs Exp.
                </div>
            </div>

            {showProfile && (
                <div className="profile-details-expanded animate-in" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="detail-section">
                        <h4><GraduationCap size={16} /> Professional Background</h4>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
                            {specialty} specialist with over {experience} years of clinical experience.
                            Currently practicing at <strong>{hospital}</strong>. Rated high for patient care and surgical precision.
                        </p>
                    </div>
                    <div className="detail-section" style={{ marginTop: '0.75rem' }}>
                        <h4><MapPin size={16} /> Location</h4>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{hospital}, Colombo, Sri Lanka</p>
                    </div>
                </div>
            )}

            <div className="specialist-price-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '0.75rem', background: 'rgba(96, 165, 250, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Consultation Fee</span>
                <span style={{ color: '#60a5fa', fontWeight: '700', fontSize: '1.1rem' }}>LKR {price?.toLocaleString()}</span>
            </div>

            {schedules && schedules.length > 0 && (
                <div className="specialist-schedules" style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Available Slots:</p>
                    <div className="schedule-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {schedules.map((s, idx) => (
                            <span key={idx} style={{ fontSize: '0.7rem', background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', padding: '0.2rem 0.5rem', borderRadius: '0.5rem' }}>
                                {s.day_of_week.slice(0, 3)} {s.start_time.slice(0, 5)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="specialist-actions">
                <button className={`btn-profile ${showProfile ? 'active' : ''}`} onClick={() => setShowProfile(!showProfile)}>
                    {showProfile ? 'Hide Profile' : 'View Profile'}
                </button>
                <button className="btn-book" onClick={onBook}>Book Appointment</button>
            </div>
        </div>
    );
};

export default SpecialistCard;
