import React from 'react';
import { Bell } from 'lucide-react';
import './Header.css';

const Header = ({ userName = "Pasindu" }) => {
    return (
        <header className="dashboard-header">
            <div className="header-greeting">
                <h1>Good morning, {userName}</h1>
                <p>Here's your health overview for today.</p>
            </div>

            <div className="header-actions">
                <button
                    className="icon-button"
                    onClick={() => alert('No new notifications')}
                    title="Notifications"
                >
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>
                <div className="user-profile">
                    {/* Placeholder for user image */}
                    <img src="https://ui-avatars.com/api/?name=Pasindu&background=random" alt="Profile" className="profile-image" />
                </div>
            </div>
        </header>
    );
};

export default Header;
