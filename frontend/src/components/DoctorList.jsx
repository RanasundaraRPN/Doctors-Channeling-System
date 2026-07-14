import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiFetch } from '../utils/api';
import './DoctorList.css';

const DoctorCard = ({ name, specialty, rating, reviews, image }) => (
    <div className="doctor-card">
        <div className="doctor-avatar-wrapper">
            <img src={image} alt={name} className="doctor-avatar" />
        </div>
        <h4 className="doctor-name">{name}</h4>
        <p className="doctor-specialty">{specialty}</p>
        <div className="doctor-rating">
            <Star size={14} fill="#fbbf24" color="#fbbf24" style={{ marginRight: 4 }} />
            <span className="rating-score">{rating}</span>
            <span className="rating-count">({reviews || 0} reviews)</span>
        </div>
        <button className="book-visit-btn">Book Visit</button>
    </div>
);

const DoctorList = () => {
    const [doctors, setDoctors] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await apiFetch('/doctors');
                setDoctors(data);
            } catch (err) {
                console.error('Failed to fetch doctors:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const displayDoctors = doctors.slice(0, 3).map(doc => ({
        name: doc.fullname,
        specialty: doc.specialty,
        rating: doc.rating,
        reviews: doc.reviews,
        image: doc.image_url
    }));

    return (
        <div className="doctor-list-container">
            <div className="section-header">
                <h3 className="section-title">Recommended Doctors</h3>
                <div className="nav-arrows">
                    <button className="arrow-btn"><ChevronLeft size={18} /></button>
                    <button className="arrow-btn"><ChevronRight size={18} /></button>
                </div>
            </div>
            <div className="doctor-grid">
                {loading ? (
                    <div className="loading">Loading doctors...</div>
                ) : displayDoctors.length > 0 ? (
                    displayDoctors.map((doc, index) => (
                        <DoctorCard key={index} {...doc} />
                    ))
                ) : (
                    <div className="no-results">No doctors found.</div>
                )}
            </div>
        </div>
    );
};

export default DoctorList;
