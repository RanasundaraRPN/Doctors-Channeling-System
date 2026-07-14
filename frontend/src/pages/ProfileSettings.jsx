import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Phone, Mail, Calendar, MapPin, CheckCircle, ChevronDown, Camera, Save, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import './ProfileSettings.css';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('medichannel_user') || '{}');

    const [fullname, setFullname] = useState(user.fullname || '');
    const [email, setEmail] = useState(user.email || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiFetch(`/auth/profile/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify({ fullname, email })
            });

            // Update local storage
            const updatedUser = { ...user, fullname, email };
            localStorage.setItem('medichannel_user', JSON.stringify(updatedUser));

            navigate('/profile', {
                state: { message: 'Profile updated successfully!' }
            });
        } catch (err) {
            alert('Failed to update profile: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-settings-layout">
            <Sidebar />
            <div className="ps-main">
                <div className="ps-breadcrumbs">
                    <span>Home</span> <span className="separator">/</span> <span className="active">Profile Settings</span>
                </div>

                <header className="ps-header">
                    <div>
                        <h1>Update Profile</h1>
                        <p>Manage your personal information, contact details, and address.</p>
                    </div>
                </header>

                <div className="ps-container">
                    {/* Photo Section */}
                    <div className="photo-card">
                        <div className="photo-content">
                            <div className="avatar-preview-wrapper">
                                <img src={`https://ui-avatars.com/api/?name=${fullname.replace(' ', '+')}&background=ffedd5&color=a16207`} alt="Profile" />
                                <button className="edit-avatar-btn"><Camera size={14} /></button>
                            </div>
                            <div className="photo-info">
                                <div className="photo-name-row">
                                    <h2>{fullname}</h2>
                                </div>
                                <div className="photo-meta">
                                    <span>User ID: #{user.id}</span>
                                    <div className="verified-pill">
                                        <div className="dot-green"></div> Account Verified
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="photo-actions">
                            <button className="btn-outline">Remove Photo</button>
                            <button className="btn-primary-green">Upload New</button>
                        </div>
                    </div>

                    <form className="ps-form" onSubmit={handleUpdate}>
                        {/* Personal Details */}
                        <div className="form-section">
                            <h3 className="section-title"><User size={18} /> Personal Details</h3>
                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={fullname}
                                        onChange={(e) => setFullname(e.target.value)}
                                        className="dark-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="form-section">
                            <h3 className="section-title"><Phone size={18} /> Contact Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="input-icon-wrapper">
                                        <Mail size={18} className="input-icon-left" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="dark-input pl-with-icon"
                                            required
                                        />
                                        <span className="verified-text"><CheckCircle size={14} /> VERIFIED</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="form-actions-footer">
                            <button type="button" className="btn-text" onClick={() => navigate('/profile')}>Cancel</button>
                            <button type="submit" className="btn-save" disabled={loading}>
                                <Save size={18} /> {loading ? 'Updating...' : 'Update Now'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
