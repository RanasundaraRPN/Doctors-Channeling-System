import React from 'react';
import Card from './shared/Card';
import { Lightbulb } from 'lucide-react';
import './DailyTip.css';

const DailyTip = () => {
    return (
        <Card className="daily-tip-card">
            <div className="tip-header">
                <Lightbulb className="tip-icon" size={20} />
                <h4 className="tip-title">Daily Tip</h4>
            </div>
            <p className="tip-content">
                Staying hydrated improves focus and energy levels. Aim for 8 glasses a day!
            </p>
            <div className="tip-bg-graphic"></div>
        </Card>
    );
};

export default DailyTip;
