import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import SpecialistCard from '../components/SpecialistCard';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import './FindDoctors.css';

const FindDoctors = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('All');
    const [selectedHospital, setSelectedHospital] = useState('All');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await apiFetch('/doctors');
                // Map backend doctor data to frontend format if necessary
                const formattedDoctors = data.map(doc => ({
                    id: doc.id,
                    name: doc.fullname,
                    specialty: doc.specialty,
                    hospital: doc.hospital,
                    rating: doc.rating,
                    reviews: doc.reviews,
                    experience: doc.experience,
                    price: doc.price,
                    schedules: doc.schedules,
                    available: doc.available === 1,
                    image: doc.image_url
                }));
                setDoctors(formattedDoctors);
            } catch (err) {
                console.error('Failed to fetch doctors:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleBook = (doctor) => {
        const user = JSON.parse(localStorage.getItem('medichannel_user') || '{}');

        if (!user.id) {
            // Store target in case of redirect
            navigate('/', { state: { from: '/book-appointment', doctor } });
            return;
        }

        navigate('/book-appointment', { state: { doctor } });
    };


    const specializations = ['All', 'Neurologist', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Gynecologist', 'Orthopedist', 'Psychiatrist', 'General Surgeon'];
    const hospitals = ['All', 'Asiri Health', 'Nawaloka Hospital', 'Lanka Hospitals', 'Durdans Hospital', 'General Hospital'];

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialization === 'All' || doc.specialty === selectedSpecialization;
        const matchesHospital = selectedHospital === 'All' || doc.hospital === selectedHospital;
        return matchesSearch && matchesSpecialty && matchesHospital;
    });

    const handleReset = () => {
        setSearchTerm('');
        setSelectedSpecialization('All');
        setSelectedHospital('All');
    };

    return (
        <div className="find-doctors-layout">
            <Sidebar />
            <div className="find-doctors-main">
                <header className="page-header">
                    <div className="header-text">
                        <h1>Find Doctors</h1>
                        <p>Select your preferred doctor and book your channel slot.</p>
                    </div>
                    <div className="search-container">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or area of expertise..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="filters-bar">
                    <button className="filter-btn primary-filter">
                        <SlidersHorizontal size={16} />
                        All Filters
                    </button>
                    <div className="filter-select-wrapper">
                        <select
                            className="filter-select"
                            value={selectedSpecialization}
                            onChange={(e) => setSelectedSpecialization(e.target.value)}
                        >
                            {specializations.map(spec => <option key={spec} value={spec}>{spec === 'All' ? 'Specialization' : spec}</option>)}
                        </select>
                        <ChevronDown size={14} className="select-icon" />
                    </div>
                    <div className="filter-select-wrapper">
                        <select
                            className="filter-select"
                            value={selectedHospital}
                            onChange={(e) => setSelectedHospital(e.target.value)}
                        >
                            {hospitals.map(hosp => <option key={hosp} value={hosp}>{hosp === 'All' ? 'Hospital' : hosp}</option>)}
                        </select>
                        <ChevronDown size={14} className="select-icon" />
                    </div>
                    <button className="reset-btn" onClick={handleReset}>Reset</button>
                </div>

                <div className="doctors-grid">
                    {loading ? (
                        <div className="loading">Loading doctors...</div>
                    ) : filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doc, index) => (
                            <SpecialistCard key={index} {...doc} onBook={() => handleBook(doc)} />
                        ))
                    ) : (
                        <div className="no-results">No doctors found matching your criteria.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindDoctors;
