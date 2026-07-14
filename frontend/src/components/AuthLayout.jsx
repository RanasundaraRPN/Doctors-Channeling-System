import React from 'react';
import { Plus } from 'lucide-react';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
    return (
        <div className="auth-layout">
            <div className="auth-left">
                <div className="brand">
                    <div className="brand-icon">
                        <Plus size={20} color="#000" strokeWidth={3} />
                    </div>
                    <span className="brand-text">MediChannel</span>
                </div>

                <div className="hero-content">
                    <div className="floating-illustration">
                        {/* Abstract medical/glass shapes via CSS */}
                        <div className="glass-shape shape-1"></div>
                        <div className="glass-shape shape-2"></div>
                    </div>

                    <div className="hero-text">
                        <h1>Healthcare <br /> <span className="highlight">Reimagined.</span></h1>
                        <p>Join thousands of specialists and patients on the most secure and efficient channeling platform available today.</p>

                        <div className="doctors-preview">
                            <div className="avatars">
                                {/* Placeholders for avatars */}
                                <div className="avatar a1"></div>
                                <div className="avatar a2"></div>
                                <div className="avatar a3"></div>
                            </div>
                            <div className="doctors-info">
                                <span className="count">2k+ Doctors</span>
                                <span className="status">Active Now</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-container">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
