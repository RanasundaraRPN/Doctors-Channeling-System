import React from 'react';
import Card from './shared/Card';
import './StatCard.css';

const StatCard = ({ title, value, type = 'default' }) => {
    return (
        <Card className={`stat-card stat-card-${type}`}>
            <h3 className="stat-title">{title}</h3>
            <div className="stat-value">{value}</div>
        </Card>
    );
};

export default StatCard;
