import React from 'react';
import { LayoutDashboard, CalendarPlus, Calendar, Users, Settings, LogOut, User, Shield, Stethoscope } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('medichannel_user') || '{}');

    const navItems = [];

    if (!user.id) {
        // Guest user
        navItems.push(
            { icon: Users, label: 'Find Doctors', path: '/doctors' },
            { icon: LayoutDashboard, label: 'Login', path: '/' }
        );
    } else if (user.role === 'admin') {
        navItems.push(
            { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
            { icon: Stethoscope, label: 'Doctors', path: '/admin/doctors' },
            { icon: Users, label: 'Patients', path: '/admin/patients' },
            { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
            { icon: Shield, label: 'Add Admins', path: '/admin/management' },
            { icon: User, label: 'Profile', path: '/profile' },
            { icon: Settings, label: 'Settings', path: '/settings' }
        );
    } else if (user.role === 'doctor') {
        navItems.push(
            { icon: Calendar, label: 'Appointments', path: '/calendar' },
            { icon: User, label: 'Profile', path: '/profile' },
            { icon: Settings, label: 'Settings', path: '/settings' }
        );
    } else {
        // Patients or default
        navItems.push(
            { icon: Users, label: 'Find Doctors', path: '/doctors' },
            { icon: Calendar, label: 'Appointment Calendar', path: '/calendar' },
            { icon: User, label: 'Profile', path: '/profile' },
            { icon: Settings, label: 'Settings', path: '/settings' }
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('medichannel_token');
        localStorage.removeItem('medichannel_user');
        navigate('/');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">+</div>
                <div className="logo-text-col">
                    <span className="logo-brand">MediChannel</span>
                    <span className="logo-tag">Health Portal</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={20} className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-widget-row">
                    <img
                        src={user.image || `https://ui-avatars.com/api/?name=${user.fullname}&background=random`}
                        alt="User"
                        className="footer-avatar"
                    />
                    <div className="footer-user-info">
                        <span className="footer-name">{user.fullname || 'Guest'}</span>
                        <span className="footer-email">{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</span>
                    </div>
                    <button className="logout-icon-btn" onClick={handleLogout} title="Log out">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
