import React from 'react';
import Card from './shared/Card';
import { MoreHorizontal, CheckCircle, FileText, Clock } from 'lucide-react';
import './RecentActivity.css';

const RecentActivity = () => {
    const activities = [
        {
            icon: CheckCircle,
            title: 'Appointment Completed',
            desc: 'Dr. Sandamini Jayasiri • General Checkup',
            time: 'Yesterday, 2:00 PM',
            iconColor: '#00d06c',
            iconBg: 'rgba(0, 208, 108, 0.15)'
        },
        {
            icon: FileText,
            title: 'New Lab Report Available',
            desc: 'Blood Test Results (PDF)',
            time: 'Oct 20, 9:30 AM',
            iconColor: '#3182ce',
            iconBg: 'rgba(49, 130, 206, 0.15)'
        },
        {
            icon: Clock,
            title: 'Appointment Scheduled',
            desc: 'Dr. Sadeepa Dilshan • Consultation',
            time: 'Oct 18, 4:15 PM',
            iconColor: '#d69e2e',
            iconBg: 'rgba(214, 158, 46, 0.15)'
        }
    ];

    return (
        <div className="recent-activity-container">
            <div className="section-header">
                <h3 className="section-title">Recent Activity</h3>
                <button className="icon-button-ghost">
                    <MoreHorizontal size={20} />
                </button>
            </div>
            <Card className="activity-card-container">
                <ul className="activity-list">
                    {activities.map((item, index) => (
                        <li key={index} className="activity-item">
                            <div className="activity-icon" style={{ backgroundColor: item.iconBg, color: item.iconColor }}>
                                <item.icon size={20} />
                            </div>
                            <div className="activity-details">
                                <h4 className="activity-title">{item.title}</h4>
                                <p className="activity-desc">{item.desc}</p>
                                <span className="activity-time">{item.time}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default RecentActivity;
