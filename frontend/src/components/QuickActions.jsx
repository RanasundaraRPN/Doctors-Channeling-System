import React from 'react';
import Card from './shared/Card';
import { Plus, Search, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './QuickActions.css';

const QuickActions = ({ role }) => {
    let actions = [];

    if (role === 'admin') {
        actions = [
            { icon: Plus, title: 'Add Doctor', subtitle: 'Onboard new specialist', color: '#00d06c', path: '/admin/doctors' },
            { icon: Search, title: 'Manage Patients', subtitle: 'View registered users', color: '#4fd1c5', path: '/admin/patients' },
            { icon: Folder, title: 'View Schedule', subtitle: 'All appointments', color: '#9f7aea', path: '/admin/appointments' }
        ];
    } else if (role === 'doctor') {
        actions = [
            { icon: Plus, title: 'View Schedule', subtitle: 'My appointments', color: '#00d06c', path: '/calendar' },
            { icon: Search, title: 'My Profile', subtitle: 'Update details', color: '#4fd1c5', path: '/profile' },
            { icon: Folder, title: 'Settings', subtitle: 'Account settings', color: '#9f7aea', path: '/settings' }
        ];
    } else {
        // Default (Patient)
        actions = [
            { icon: Plus, title: 'Book New', subtitle: 'Find a doctor & schedule', color: '#00d06c', path: '/doctors' },
            { icon: Search, title: 'Find Specialist', subtitle: 'Browse by category', color: '#4fd1c5', path: '/doctors' },
            { icon: Folder, title: 'Medical Records', subtitle: 'View history & labs', color: '#9f7aea', path: '/profile' }
        ];
    }

    const navigate = useNavigate();

    return (
        <div className="quick-actions-container">
            <h3 className="section-title">Quick Actions</h3>
            <div className="quick-actions-grid">
                {actions.map((action, index) => (
                    <Card
                        key={index}
                        className="quick-action-card"
                        onClick={() => action.path && navigate(action.path)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="action-icon-wrapper">
                            <action.icon size={24} color={action.color} />
                        </div>
                        <div>
                            <h4 className="action-title">{action.title}</h4>
                            <p className="action-subtitle">{action.subtitle}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
