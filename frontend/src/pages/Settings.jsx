import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Bell, Shield, User, Smartphone, Moon, Globe } from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const [toggleState, setToggleState] = useState({
        emailNotifs: true,
        smsNotifs: false,
        darkMode: true,
        twoFactor: true
    });

    const handleToggle = (key) => {
        setToggleState(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="settings-layout">
            <Sidebar />
            <div className="settings-main">
                <header className="settings-header">
                    <h1>Settings</h1>
                    <p>Manage your preferences and account security.</p>
                </header>

                <div className="settings-content">

                    {/* Account Preferences */}
                    <div className="settings-section">
                        <h2><User className="section-icon" size={20} /> Account Preferences</h2>
                        <div className="settings-card">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-label">Language</span>
                                    <span className="setting-desc">Select your preferred language</span>
                                </div>
                                <select className="setting-select">
                                    <option>English (US)</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                </select>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-label">Time Zone</span>
                                    <span className="setting-desc">Set your local time zone</span>
                                </div>
                                <select className="setting-select">
                                    <option>(GMT-05:00) Eastern Time</option>
                                    <option>(GMT+05:30) India Standard Time</option>
                                    <option>(GMT+00:00) UTC</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="settings-section">
                        <h2><Bell className="section-icon" size={20} /> Notifications</h2>
                        <div className="settings-card">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-label">Email Notifications</span>
                                    <span className="setting-desc">Receive updates via email</span>
                                </div>
                                <button
                                    className={`toggle-btn ${toggleState.emailNotifs ? 'active' : ''}`}
                                    onClick={() => handleToggle('emailNotifs')}
                                >
                                    <div className="toggle-circle"></div>
                                </button>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-label">SMS Notifications</span>
                                    <span className="setting-desc">Receive updates via SMS</span>
                                </div>
                                <button
                                    className={`toggle-btn ${toggleState.smsNotifs ? 'active' : ''}`}
                                    onClick={() => handleToggle('smsNotifs')}
                                >
                                    <div className="toggle-circle"></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="settings-section">
                        <h2><Moon className="section-icon" size={20} /> Appearance</h2>
                        <div className="settings-card">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-label">Dark Mode</span>
                                    <span className="setting-desc">Toggle dark theme</span>
                                </div>
                                <button
                                    className={`toggle-btn ${toggleState.darkMode ? 'active' : ''}`}
                                    onClick={() => handleToggle('darkMode')}
                                >
                                    <div className="toggle-circle"></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="settings-section">
                        <h2><Shield className="section-icon" size={20} /> Security</h2>
                        <div className="settings-card">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-label">Two-Factor Authentication</span>
                                    <span className="setting-desc">Enable extra security</span>
                                </div>
                                <button
                                    className={`toggle-btn ${toggleState.twoFactor ? 'active' : ''}`}
                                    onClick={() => handleToggle('twoFactor')}
                                >
                                    <div className="toggle-circle"></div>
                                </button>
                            </div>
                            <div className="setting-item clickable">
                                <div className="setting-info">
                                    <span className="setting-label">Change Password</span>
                                    <span className="setting-desc">Update your password</span>
                                </div>
                                <button className="btn-secondary">Update</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
